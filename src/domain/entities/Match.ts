export interface MatchProps {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore?: number | null;
  awayScore?: number | null;
  matchDate: Date;
  status: string;
}

export class Match {
  private props: MatchProps;

  constructor(props: MatchProps) {
    this.props = props;
  }

  get id(): string { return this.props.id; }
  get homeTeamId(): string { return this.props.homeTeamId; }
  get awayTeamId(): string { return this.props.awayTeamId; }
  get homeScore(): number | undefined | null { return this.props.homeScore; }
  get awayScore(): number | undefined | null { return this.props.awayScore; }

  public updateResult(homeScore: number, awayScore: number): void {
    if (this.props.status === "FINISHED") {
      throw new Error("Cannot update a finished match");
    }
    this.props.homeScore = homeScore;
    this.props.awayScore = awayScore;
    this.props.status = "FINISHED";
  }

  public toJSON() {
    return { ...this.props };
  }
}
