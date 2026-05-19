import { IMatchRepository } from "../domain/repositories/IMatchRepository";
import { domainEventsBus } from "../shared/DomainEventsBus";
import { MatchResultUpdated } from "../domain/events/MatchResultUpdated";

export interface UpdateMatchResultRequest {
  matchId: string;
  homeScore: number;
  awayScore: number;
}

export class UpdateMatchResultUseCase {
  constructor(private matchRepository: IMatchRepository) {}

  async execute(request: UpdateMatchResultRequest): Promise<void> {
    const { matchId, homeScore, awayScore } = request;

    const match = await this.matchRepository.findById(matchId);
    if (!match) throw new Error("Match not found");

    match.updateResult(homeScore, awayScore);
    await this.matchRepository.save(match);

    // Publish event for automatic standings update
    await domainEventsBus.publish(
      "MatchResultUpdated",
      new MatchResultUpdated(
        match.id,
        match.homeTeamId,
        match.awayTeamId,
        homeScore,
        awayScore
      )
    );
  }
}
