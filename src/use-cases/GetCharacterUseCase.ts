import { ICharacterRepository } from "../domain/repositories/ICharacterRepository";
import { Character } from "../domain/entities/Character";

export class GetCharacterUseCase {
  constructor(private characterRepository: ICharacterRepository) {}

  async execute(id: string, userId: string): Promise<Character | null> {
    const character = await this.characterRepository.findById(id);
    
    if (!character) return null;
    
    // Security check: ensure the character belongs to the requesting user
    if (character.userId !== userId) {
      throw new Error("Unauthorized access to character");
    }

    return character;
  }
}
