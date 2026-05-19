import { NextResponse } from "next/server";
import { PrismaMatchRepository } from "@/infrastructure/repositories/PrismaMatchRepository";
import { UpdateMatchResultUseCase } from "@/use-cases/UpdateMatchResultUseCase";
import { initListeners } from "@/shared/init-listeners";

// Initialize listeners on first request (Simple approach for Next.js)
initListeners();

export async function POST(req: Request) {
  try {
    const { matchId, homeScore, awayScore } = await req.json();
    
    const matchRepository = new PrismaMatchRepository();
    const updateMatchResultUseCase = new UpdateMatchResultUseCase(matchRepository);
    
    await updateMatchResultUseCase.execute({ matchId, homeScore, awayScore });
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
