import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/infrastructure/auth/next-auth";
import { PrismaCharacterRepository } from "@/infrastructure/repositories/PrismaCharacterRepository";
import { PrismaUserRepository } from "@/infrastructure/repositories/PrismaUserRepository";
import { GetCharacterUseCase } from "@/use-cases/GetCharacterUseCase";
import { DeleteCharacterUseCase } from "@/use-cases/DeleteCharacterUseCase";

export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = params;
  const characterRepository = new PrismaCharacterRepository();
  const getCharacterUseCase = new GetCharacterUseCase(characterRepository);

  try {
    // @ts-ignore
    const character = await getCharacterUseCase.execute(id, session.user.id);
    if (!character) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(character.toJSON());
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = params;
  const characterRepository = new PrismaCharacterRepository();
  const userRepository = new PrismaUserRepository();
  const deleteCharacterUseCase = new DeleteCharacterUseCase(characterRepository, userRepository);

  try {
    // @ts-ignore
    await deleteCharacterUseCase.execute(id, session.user.id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
