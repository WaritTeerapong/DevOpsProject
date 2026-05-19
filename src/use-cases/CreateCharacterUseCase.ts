import { Character, CharacterStats } from "../domain/entities/Character";
import { ICharacterRepository } from "../domain/repositories/ICharacterRepository";
import { domainEventsBus } from "../shared/DomainEventsBus";
import { CharacterCreated } from "../domain/events/CharacterCreated";
import { v4 as uuidv4 } from 'uuid';

export interface CreateCharacterRequest {
  userId: string;
  name: string;
  race: string;
  class: string;
  stats: CharacterStats;
  skills: string[];
}

export class CreateCharacterUseCase {
  constructor(private characterRepository: ICharacterRepository) {}

  async execute(request: CreateCharacterRequest): Promise<Character> {
    const character = new Character({
      id: uuidv4(),
      ...request
    });

    await this.characterRepository.save(character);

    // Publish event
    await domainEventsBus.publish(
      "CharacterCreated",
      new CharacterCreated(character.id, character.userId, character.name)
    );

    return character;
  }
}
