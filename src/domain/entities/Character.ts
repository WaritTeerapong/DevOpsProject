export interface CharacterStats {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export interface CharacterProps {
  id: string;
  userId: string;
  name: string;
  race: string;
  class: string;
  stats: CharacterStats;
  skills: string[];
}

export class Character {
  private props: CharacterProps;

  constructor(props: CharacterProps) {
    this.props = props;
    this.validateStats();
  }

  get id(): string { return this.props.id; }
  get userId(): string { return this.props.userId; }
  get name(): string { return this.props.name; }

  private validateStats() {
    const stats = this.props.stats;
    const allStats = [stats.strength, stats.dexterity, stats.constitution, stats.intelligence, stats.wisdom, stats.charisma];
    if (allStats.some(s => s < 1 || s > 30)) {
      throw new Error("Stats must be between 1 and 30");
    }
  }

  public toJSON() {
    return { ...this.props };
  }
}
