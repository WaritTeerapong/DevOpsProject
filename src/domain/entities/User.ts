export interface UserProps {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  score: number;
}

export class User {
  private props: UserProps;

  constructor(props: UserProps) {
    this.props = props;
  }

  get id(): string { return this.props.id; }
  get name(): string | undefined | null { return this.props.name; }
  get email(): string | undefined | null { return this.props.email; }
  get score(): number { return this.props.score; }

  public addScore(points: number): void {
    if (points < 0) throw new Error("Points cannot be negative");
    this.props.score += points;
  }

  public toJSON() {
    return { ...this.props };
  }
}
