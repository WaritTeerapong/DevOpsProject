import { IChallengeRepository } from "../domain/repositories/IChallengeRepository";

export interface ChallengeDTO {
  id: string;
  title: string;
  description: string;
  points: number;
  category: string;
}

export class GetChallengesUseCase {
  constructor(private challengeRepository: IChallengeRepository) {}

  async execute(): Promise<ChallengeDTO[]> {
    const challenges = await this.challengeRepository.findAll();
    
    // Convert to DTO to hide sensitive data like 'flag' from the UI
    return challenges.map(c => {
      const data = c.toJSON();
      return {
        id: data.id,
        title: data.title,
        description: data.description,
        points: data.points,
        category: data.category
      };
    });
  }
}
