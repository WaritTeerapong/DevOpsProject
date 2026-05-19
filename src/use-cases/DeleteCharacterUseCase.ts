import { ICharacterRepository } from "../domain/repositories/ICharacterRepository";
import { IUserRepository } from "../domain/repositories/IUserRepository";

export class DeleteCharacterUseCase {
  constructor(
    private characterRepository: ICharacterRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(id: string, userId: string): Promise<void> {
    const character = await this.characterRepository.findById(id);
    
    if (!character) throw new Error("Character not found");
    if (character.userId !== userId) throw new Error("Unauthorized");

    await this.characterRepository.delete(id);

    // Update user stats (Decrement count)
    const user = await this.userRepository.findById(userId);
    if (user) {
      user.decrementCharacterCount();
      await this.userRepository.updateCharacterCount(user.id, user.characterCount);
    }
  }
}
