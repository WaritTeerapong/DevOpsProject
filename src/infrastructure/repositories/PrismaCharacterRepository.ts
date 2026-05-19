import { ICharacterRepository } from "../../domain/repositories/ICharacterRepository";
import { Character } from "../../domain/entities/Character";
import { prisma } from "../database/prisma";

export class PrismaCharacterRepository implements ICharacterRepository {
  async findById(id: string): Promise<Character | null> {
    const c = await prisma.character.findUnique({ where: { id } });
    if (!c) return null;
    return new Character({
      id: c.id,
      userId: c.userId,
      name: c.name,
      race: c.race,
      class: c.class,
      stats: {
        strength: c.strength,
        dexterity: c.dexterity,
        constitution: c.constitution,
        intelligence: c.intelligence,
        wisdom: c.wisdom,
        charisma: c.charisma,
      },
      skills: c.skills,
    });
  }

  async findByUserId(userId: string): Promise<Character[]> {
    const characters = await prisma.character.findMany({ where: { userId } });
    return characters.map(c => new Character({
      id: c.id,
      userId: c.userId,
      name: c.name,
      race: c.race,
      class: c.class,
      stats: {
        strength: c.strength,
        dexterity: c.dexterity,
        constitution: c.constitution,
        intelligence: c.intelligence,
        wisdom: c.wisdom,
        charisma: c.charisma,
      },
      skills: c.skills,
    }));
  }

  async save(character: Character): Promise<void> {
    const data = character.toJSON();
    await prisma.character.upsert({
      where: { id: character.id },
      update: {
        name: data.name,
        race: data.race,
        class: data.class,
        strength: data.stats.strength,
        dexterity: data.stats.dexterity,
        constitution: data.stats.constitution,
        intelligence: data.stats.intelligence,
        wisdom: data.stats.wisdom,
        charisma: data.stats.charisma,
        skills: data.skills,
      },
      create: {
        id: data.id,
        userId: data.userId,
        name: data.name,
        race: data.race,
        class: data.class,
        strength: data.stats.strength,
        dexterity: data.stats.dexterity,
        constitution: data.stats.constitution,
        intelligence: data.stats.intelligence,
        wisdom: data.stats.wisdom,
        charisma: data.stats.charisma,
        skills: data.skills,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.character.delete({ where: { id } });
  }
}
