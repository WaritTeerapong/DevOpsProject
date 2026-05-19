import { ITeamRepository } from "../domain/repositories/ITeamRepository";

export interface TeamStandingDTO {
  rank: number;
  name: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  gd: number;
  points: number;
}

export class GetStandingsUseCase {
  constructor(private teamRepository: ITeamRepository) {}

  async execute(): Promise<TeamStandingDTO[]> {
    const teams = await this.teamRepository.findAll();
    
    return teams.map((t, index) => {
      const data = t.toJSON();
      return {
        rank: index + 1,
        name: data.name,
        played: data.played,
        won: data.won,
        drawn: data.drawn,
        lost: data.lost,
        gf: data.gf,
        ga: data.ga,
        gd: data.gf - data.ga,
        points: data.points
      };
    });
  }
}
