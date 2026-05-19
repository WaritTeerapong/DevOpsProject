import { StandingsListener } from "../infrastructure/listeners/StandingsListener";
import { PrismaTeamRepository } from "../infrastructure/repositories/PrismaTeamRepository";

export function initListeners() {
  const teamRepository = new PrismaTeamRepository();
  const standingsListener = new StandingsListener(teamRepository);
  
  standingsListener.initialize();
  console.log("[Listeners] All listeners initialized.");
}
