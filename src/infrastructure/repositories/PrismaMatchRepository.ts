import { IMatchRepository } from "../../domain/repositories/IMatchRepository";
import { Match } from "../../domain/entities/Match";
import { prisma } from "../database/prisma";

export class PrismaMatchRepository implements IMatchRepository {
  async findById(id: string): Promise<Match | null> {
    const match = await prisma.match.findUnique({ where: { id } });
    if (!match) return null;
    return new Match({
      id: match.id,
      homeTeamId: match.homeTeamId,
      awayTeamId: match.awayTeamId,
      homeScore: match.homeScore,
      awayScore: match.awayScore,
      matchDate: match.matchDate,
      status: match.status,
    });
  }

  async findAll(): Promise<Match[]> {
    const matches = await prisma.match.findMany({
      orderBy: { matchDate: "desc" },
    });
    return matches.map(
      (m) =>
        new Match({
          id: m.id,
          homeTeamId: m.homeTeamId,
          awayTeamId: m.awayTeamId,
          homeScore: m.homeScore,
          awayScore: m.awayScore,
          matchDate: m.matchDate,
          status: m.status,
        })
    );
  }

  async save(match: Match): Promise<void> {
    const data = match.toJSON();
    await prisma.match.update({
      where: { id: match.id },
      data: {
        homeScore: data.homeScore,
        awayScore: data.awayScore,
        status: data.status,
      },
    });
  }
}
