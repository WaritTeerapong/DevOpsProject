import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/entities/User";
import { prisma } from "../database/prisma";

export class PrismaUserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    return new User({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      score: user.score,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return null;
    return new User({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      score: user.score,
    });
  }

  async save(user: User): Promise<void> {
    const data = user.toJSON();
    await prisma.user.upsert({
      where: { id: user.id },
      update: {
        name: data.name,
        email: data.email,
        image: data.image,
        score: data.score,
      },
      create: {
        id: data.id,
        name: data.name,
        email: data.email,
        image: data.image,
        score: data.score,
      },
    });
  }

  async updateScore(userId: string, newScore: number): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { score: newScore },
    });
  }
}
