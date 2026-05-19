import { ITeamRepository } from "../../domain/repositories/ITeamRepository";
import { domainEventsBus } from "../../shared/DomainEventsBus";
import { MatchResultUpdated } from "../../domain/events/MatchResultUpdated";

export class StandingsListener {
  constructor(private teamRepository: ITeamRepository) {}

  public initialize() {
    domainEventsBus.subscribe<MatchResultUpdated>(
      "MatchResultUpdated",
      async (event) => {
        console.log(`[StandingsListener] Updating standings for match ${event.matchId}`);

        const [homeTeam, awayTeam] = await Promise.all([
          this.teamRepository.findById(event.homeTeamId),
          this.teamRepository.findById(event.awayTeamId),
        ]);

        if (homeTeam && awayTeam) {
          homeTeam.updateStats(event.homeScore, event.awayScore);
          awayTeam.updateStats(event.awayScore, event.homeScore);

          await Promise.all([
            this.teamRepository.save(homeTeam),
            this.teamRepository.save(awayTeam),
          ]);
          
          console.log(`[StandingsListener] Standings updated successfully.`);
        }
      }
    );
  }
}
