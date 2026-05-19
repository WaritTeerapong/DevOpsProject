import { Character } from "../entities/Character";

export interface ICharacterRepository {
  findById(id: string): Promise<Character | null>;
  findByUserId(userId: string): Promise<Character[]>;
  save(character: Character): Promise<void>;
  delete(id: string): Promise<void>;
}
