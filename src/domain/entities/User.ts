export interface UserProps {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  characterCount: number;
}

export class User {
  private props: UserProps;

  constructor(props: UserProps) {
    this.props = props;
  }

  get id(): string { return this.props.id; }
  get name(): string | undefined | null { return this.props.name; }
  get characterCount(): number { return this.props.characterCount; }

  public incrementCharacterCount(): void {
    this.props.characterCount += 1;
  }

  public decrementCharacterCount(): void {
    if (this.props.characterCount > 0) {
      this.props.characterCount -= 1;
    }
  }

  public toJSON() {
    return { ...this.props };
  }
}
