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
      characterCount: user.characterCount,
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
        characterCount: data.characterCount,
      },
      create: {
        id: data.id,
        name: data.name,
        email: data.email,
        image: data.image,
        characterCount: data.characterCount,
      },
    });
  }

  async updateCharacterCount(userId: string, count: number): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { characterCount: count },
    });
  }
}
