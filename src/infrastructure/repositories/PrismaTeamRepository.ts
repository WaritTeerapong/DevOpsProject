import { ITeamRepository } from "../../domain/repositories/ITeamRepository";
import { Team } from "../../domain/entities/Team";
import { prisma } from "../database/prisma";

export class PrismaTeamRepository implements ITeamRepository {
  async findById(id: string): Promise<Team | null> {
    const team = await prisma.team.findUnique({ where: { id } });
    if (!team) return null;
    return new Team({
      id: team.id,
      name: team.name,
      logoUrl: team.logoUrl,
      played: team.played,
      won: team.won,
      drawn: team.drawn,
      lost: team.lost,
      gf: team.gf,
      ga: team.ga,
      points: team.points,
    });
  }

  async findAll(): Promise<Team[]> {
    const teams = await prisma.team.findMany({
      orderBy: [
        { points: "desc" },
        { gf: "desc" }, // Simple tie-breaker
      ],
    });
    return teams.map(
      (t) =>
        new Team({
          id: t.id,
          name: t.name,
          logoUrl: t.logoUrl,
          played: t.played,
          won: t.won,
          drawn: t.drawn,
          lost: t.lost,
          gf: t.gf,
          ga: t.ga,
          points: t.points,
        })
    );
  }

  async save(team: Team): Promise<void> {
    const data = team.toJSON();
    await prisma.team.update({
      where: { id: team.id },
      data: {
        played: data.played,
        won: data.won,
        drawn: data.drawn,
        lost: data.lost,
        gf: data.gf,
        ga: data.ga,
        points: data.points,
      },
    });
  }
}
