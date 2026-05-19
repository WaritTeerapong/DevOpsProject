import { NextResponse } from "next/server";
import { PrismaTeamRepository } from "@/infrastructure/repositories/PrismaTeamRepository";
import { GetStandingsUseCase } from "@/use-cases/GetStandingsUseCase";

export async function GET() {
  try {
    const teamRepository = new PrismaTeamRepository();
    const getStandingsUseCase = new GetStandingsUseCase(teamRepository);
    
    const standings = await getStandingsUseCase.execute();
    return NextResponse.json(standings);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch standings" }, { status: 500 });
  }
}
