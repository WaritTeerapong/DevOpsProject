import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/infrastructure/auth/next-auth";
import { PrismaUserRepository } from "@/infrastructure/repositories/PrismaUserRepository";
import { PrismaChallengeRepository } from "@/infrastructure/repositories/PrismaChallengeRepository";
import { SubmitFlagUseCase } from "@/use-cases/SubmitFlagUseCase";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { challengeId, submittedFlag } = await req.json();

    const userRepository = new PrismaUserRepository();
    const challengeRepository = new PrismaChallengeRepository();
    const submitFlagUseCase = new SubmitFlagUseCase(userRepository, challengeRepository);

    // @ts-ignore
    const result = await submitFlagUseCase.execute({
      // @ts-ignore
      userId: session.user.id,
      challengeId,
      submittedFlag,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
