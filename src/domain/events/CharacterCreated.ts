export class CharacterCreated {
  public dateTimeOccurred: Date;
  
  constructor(
    public readonly characterId: string,
    public readonly userId: string,
    public readonly characterName: string
  ) {
    this.dateTimeOccurred = new Date();
  }

  getAggregateId(): string {
    return this.characterId;
  }
}
