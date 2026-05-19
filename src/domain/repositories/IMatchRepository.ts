import { Match } from "../entities/Match";

export interface IMatchRepository {
  findById(id: string): Promise<Match | null>;
  findAll(): Promise<Match[]>;
  save(match: Match): Promise<void>;
}
