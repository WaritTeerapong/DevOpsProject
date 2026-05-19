export interface TeamProps {
  id: string;
  name: string;
  logoUrl?: string | null;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  points: number;
}

export class Team {
  private props: TeamProps;

  constructor(props: TeamProps) {
    this.props = props;
  }

  get id(): string { return this.props.id; }
  get name(): string { return this.props.name; }
  get points(): number { return this.props.points; }

  public updateStats(goalsFor: number, goalsAgainst: number): void {
    this.props.played += 1;
    this.props.gf += goalsFor;
    this.props.ga += goalsAgainst;

    if (goalsFor > goalsAgainst) {
      this.props.won += 1;
      this.props.points += 3;
    } else if (goalsFor === goalsAgainst) {
      this.props.drawn += 1;
      this.props.points += 1;
    } else {
      this.props.lost += 1;
    }
  }

  public toJSON() {
    return { ...this.props };
  }
}
