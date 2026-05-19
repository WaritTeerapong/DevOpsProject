import { Team } from "../entities/Team";

export interface ITeamRepository {
  findById(id: string): Promise<Team | null>;
  findAll(): Promise<Team[]>;
  save(team: Team): Promise<void>;
}
