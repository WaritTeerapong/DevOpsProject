import { NextResponse } from "next/server";
import { PrismaChallengeRepository } from "@/infrastructure/repositories/PrismaChallengeRepository";
import { GetChallengesUseCase } from "@/use-cases/GetChallengesUseCase";

export async function GET() {
  try {
    const challengeRepository = new PrismaChallengeRepository();
    const getChallengesUseCase = new GetChallengesUseCase(challengeRepository);

    const challenges = await getChallengesUseCase.execute();
    return NextResponse.json(challenges);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
