import { ScoreboardListener } from "../infrastructure/listeners/ScoreboardListener";

// Initialize all domain event listeners
export function initListeners() {
  ScoreboardListener.initialize();
  console.log("Listeners initialized");
}
