export class MatchResultUpdated {
  public dateTimeOccurred: Date;
  
  constructor(
    public readonly matchId: string,
    public readonly homeTeamId: string,
    public readonly awayTeamId: string,
    public readonly homeScore: number,
    public readonly awayScore: number
  ) {
    this.dateTimeOccurred = new Date();
  }

  getAggregateId(): string {
    return this.matchId;
  }
}
