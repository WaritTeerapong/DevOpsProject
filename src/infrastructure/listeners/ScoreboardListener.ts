import { prisma } from "../database/prisma";
import { domainEventsBus } from "../../shared/DomainEventsBus";
import { FlagSubmittedCorrectly } from "../../domain/events/FlagSubmittedCorrectly";

export class ScoreboardListener {
  public static initialize() {
    domainEventsBus.subscribe<FlagSubmittedCorrectly>(
      "FlagSubmittedCorrectly",
      async (event) => {
        console.log(`[ScoreboardListener] Processing correct submission for user ${event.userId}`);
        
        try {
          // 1. Log the submission to the database
          await prisma.submission.create({
            data: {
              userId: event.userId,
              challengeId: event.challengeId,
              submittedFlag: "REDACTED", // In a real system, we might not want to store the plain flag again
              isCorrect: true,
            },
          });

          // 2. Additional side effects could go here:
          // - Invalidate cache
          // - Send notification to Discord/Slack
          // - Trigger a background job for statistics
          console.log(`[ScoreboardListener] Successfully logged submission and updated state.`);
        } catch (error) {
          console.error(`[ScoreboardListener] Error processing event:`, error);
        }
      }
    );
  }
}
