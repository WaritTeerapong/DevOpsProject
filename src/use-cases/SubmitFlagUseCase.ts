import { IChallengeRepository } from "../domain/repositories/IChallengeRepository";
import { IUserRepository } from "../domain/repositories/IUserRepository";
import { domainEventsBus } from "../shared/DomainEventsBus";
import { FlagSubmittedCorrectly } from "../domain/events/FlagSubmittedCorrectly";

export interface SubmitFlagRequest {
  userId: string;
  challengeId: string;
  submittedFlag: string;
}

export interface SubmitFlagResponse {
  isCorrect: boolean;
  pointsEarned: number;
  message: string;
}

export class SubmitFlagUseCase {
  constructor(
    private userRepository: IUserRepository,
    private challengeRepository: IChallengeRepository
  ) {}

  async execute(request: SubmitFlagRequest): Promise<SubmitFlagResponse> {
    const { userId, challengeId, submittedFlag } = request;

    // 1. Find User & Challenge
    const [user, challenge] = await Promise.all([
      this.userRepository.findById(userId),
      this.challengeRepository.findById(challengeId),
    ]);

    if (!user) throw new Error("User not found");
    if (!challenge) throw new Error("Challenge not found");

    // 2. Verify Flag
    const isCorrect = challenge.verifyFlag(submittedFlag);

    if (isCorrect) {
      // 3. Update User Score
      user.addScore(challenge.points);
      await this.userRepository.updateScore(user.id, user.score);

      // 4. Publish Domain Event
      await domainEventsBus.publish(
        "FlagSubmittedCorrectly",
        new FlagSubmittedCorrectly(
          user.id,
          challenge.id,
          challenge.points,
          user.score
        )
      );

      return {
        isCorrect: true,
        pointsEarned: challenge.points,
        message: "Correct flag! Well done.",
      };
    }

    return {
      isCorrect: false,
      pointsEarned: 0,
      message: "Incorrect flag. Try again.",
    };
  }
}
