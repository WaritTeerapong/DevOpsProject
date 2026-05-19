import { DashboardListener } from "../infrastructure/listeners/DashboardListener";
import { PrismaUserRepository } from "../infrastructure/repositories/PrismaUserRepository";

export function initListeners() {
  const userRepository = new PrismaUserRepository();
  const dashboardListener = new DashboardListener(userRepository);
  
  dashboardListener.initialize();
  console.log("[Listeners] D&D Character Platform listeners initialized.");
}
