export interface ChallengeProps {
  id: string;
  title: string;
  description: string;
  flag: string;
  points: number;
  category: string;
}

export class Challenge {
  private props: ChallengeProps;

  constructor(props: ChallengeProps) {
    this.props = props;
  }

  get id(): string { return this.props.id; }
  get title(): string { return this.props.title; }
  get points(): number { return this.props.points; }
  get flag(): string { return this.props.flag; }

  public verifyFlag(submittedFlag: string): boolean {
    return this.props.flag === submittedFlag;
  }

  public toJSON() {
    return { ...this.props };
  }
}
