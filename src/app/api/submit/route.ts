import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashFlag } from '@/lib/hash';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

// In-memory Rate Limiting (Map)
const rateLimitMap = new Map<string, { count: number, lastReset: number }>();

async function rateLimit(userId: string) {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const limit = 5;

  const userLimit = rateLimitMap.get(userId) || { count: 0, lastReset: now };

  if (now - userLimit.lastReset > windowMs) {
    userLimit.count = 1;
    userLimit.lastReset = now;
  } else {
    userLimit.count++;
  }

  rateLimitMap.set(userId, userLimit);
  return userLimit.count > limit;
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { challengeId, flag } = await request.json();
    const userId = session.user.id;

    if (!challengeId || !flag) {
      return NextResponse.json({ error: 'challengeId and flag are required' }, { status: 400 });
    }

    // Rate Limiting (In-memory)
    const isLimited = await rateLimit(userId);
    if (isLimited) {
      return NextResponse.json({ 
        error: 'Too many requests', 
        message: 'Rate limit exceeded (5 attempts per minute). Please wait.' 
      }, { status: 429 });
    }

    // 1. Fetch Challenge
    const challenge = await prisma.challenge.findUnique({ where: { id: challengeId } });
    if (!challenge) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
    }

    const submittedHash = hashFlag(flag);
    const isCorrect = submittedHash === challenge.flagHash;

    // 2. Record Submission
    await prisma.submission.create({
      data: {
        userId,
        challengeId,
        submittedFlag: flag,
        isCorrect,
      }
    });

    if (isCorrect) {
      // 3. Update Score
      await prisma.user.update({
        where: { id: userId },
        data: { totalScore: { increment: challenge.points } }
      });

      // Note: Real-time update (io.emit) is currently disabled as it required Redis Pub/Sub 
      // or direct access to the Socket.io instance.

      return NextResponse.json({ correct: true, points: challenge.points, message: 'Correct flag!' });
    }

    return NextResponse.json({ correct: false, message: 'Wrong flag, try again.' });
  } catch (error) {
    console.error('Submission Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
