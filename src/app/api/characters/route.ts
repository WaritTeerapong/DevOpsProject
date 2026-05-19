import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/infrastructure/auth/next-auth";
import { PrismaCharacterRepository } from "@/infrastructure/repositories/PrismaCharacterRepository";
import { CreateCharacterUseCase } from "@/use-cases/CreateCharacterUseCase";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const characterRepository = new PrismaCharacterRepository();
  // @ts-ignore
  const characters = await characterRepository.findByUserId(session.user.id);
  
  return NextResponse.json(characters.map(c => c.toJSON()));
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const characterRepository = new PrismaCharacterRepository();
  const createCharacterUseCase = new CreateCharacterUseCase(characterRepository);

  try {
    // @ts-ignore
    const character = await createCharacterUseCase.execute({
      // @ts-ignore
      userId: session.user.id,
      ...body
    });
    return NextResponse.json(character.toJSON());
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
