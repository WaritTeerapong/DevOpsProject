import { IChallengeRepository } from "../../domain/repositories/IChallengeRepository";
import { Challenge } from "../../domain/entities/Challenge";
import { prisma } from "../database/prisma";

export class PrismaChallengeRepository implements IChallengeRepository {
  async findById(id: string): Promise<Challenge | null> {
    const challenge = await prisma.challenge.findUnique({ where: { id } });
    if (!challenge) return null;
    return new Challenge({
      id: challenge.id,
      title: challenge.title,
      description: challenge.description,
      flag: challenge.flag,
      points: challenge.points,
      category: challenge.category,
    });
  }

  async findAll(): Promise<Challenge[]> {
    const challenges = await prisma.challenge.findMany();
    return challenges.map(
      (c) =>
        new Challenge({
          id: c.id,
          title: c.title,
          description: c.description,
          flag: c.flag,
          points: c.points,
          category: c.category,
        })
    );
  }
}
