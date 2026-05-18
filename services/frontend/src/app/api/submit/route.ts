import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { redis } from '@/lib/redis';
import { hashFlag } from '@/lib/hash';
import { verifyToken } from '@/lib/auth-utils';

async function rateLimit(userId: string) {
  const key = `ratelimit:submission:${userId}`;
  const current = await redis.incr(key);
  if (current === 1) {
    await redis.expire(key, 60);
  }
  return current > 5;
}

export async function POST(request: Request) {
  try {
    const decoded = verifyToken(request);
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { challengeId, flag } = await request.json();
    const userId = decoded.userId;

    if (!challengeId || !flag) {
      return NextResponse.json({ error: 'challengeId and flag are required' }, { status: 400 });
    }

    // Rate Limiting
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
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { totalScore: { increment: challenge.points } }
      });

      // 4. Pub/Sub for real-time updates
      const eventData = {
        userId: updatedUser.id,
        username: updatedUser.username,
        challengeId: challenge.id,
        challengeTitle: challenge.title,
        points: challenge.points,
        totalScore: updatedUser.totalScore,
        solvedAt: new Date().toISOString()
      };
      
      await redis.publish('ctf:solves', JSON.stringify(eventData));

      return NextResponse.json({ correct: true, points: challenge.points, message: 'Correct flag!' });
    }

    return NextResponse.json({ correct: false, message: 'Wrong flag, try again.' });
  } catch (error) {
    console.error('Submission Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
