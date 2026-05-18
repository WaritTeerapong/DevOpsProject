import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const topUsers = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        totalScore: true,
      },
      orderBy: {
        totalScore: 'desc',
      },
      take: 50, // Top 50 users
    });

    return NextResponse.json(topUsers);
  } catch (error) {
    console.error('Scoreboard API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
