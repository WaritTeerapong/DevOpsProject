import { DomainEvent } from "../../shared/DomainEventsBus";

export class FlagSubmittedCorrectly implements DomainEvent {
  public dateTimeOccurred: Date;
  
  constructor(
    public readonly userId: string,
    public readonly challengeId: string,
    public readonly pointsEarned: number,
    public readonly newTotalScore: number
  ) {
    this.dateTimeOccurred = new Date();
  }

  getAggregateId(): string {
    return this.userId;
  }
}
