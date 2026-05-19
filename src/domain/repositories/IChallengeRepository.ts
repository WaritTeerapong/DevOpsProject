import { Challenge } from "../entities/Challenge";

export interface IChallengeRepository {
  findById(id: string): Promise<Challenge | null>;
  findAll(): Promise<Challenge[]>;
}
