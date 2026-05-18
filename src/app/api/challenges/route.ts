import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashFlag } from '@/lib/hash';

export async function GET() {
  try {
    const challenges = await prisma.challenge.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        points: true,
        category: true,
      }
    });
    return NextResponse.json(challenges);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch challenges' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { title, description, points, flag, category } = data;
    const challenge = await prisma.challenge.create({
      data: {
        title,
        description,
        points,
        flagHash: hashFlag(flag),
        category,
      }
    });
    return NextResponse.json({ id: challenge.id, title: challenge.title }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create challenge' }, { status: 500 });
  }
}
