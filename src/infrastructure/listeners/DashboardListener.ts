import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { domainEventsBus } from "../../shared/DomainEventsBus";
import { CharacterCreated } from "../../domain/events/CharacterCreated";

export class DashboardListener {
  constructor(private userRepository: IUserRepository) {}

  public initialize() {
    domainEventsBus.subscribe<CharacterCreated>(
      "CharacterCreated",
      async (event) => {
        console.log(`[DashboardListener] Updating character count for user ${event.userId}`);
        
        const user = await this.userRepository.findById(event.userId);
        if (user) {
          user.incrementCharacterCount();
          await this.userRepository.updateCharacterCount(user.id, user.characterCount);
          console.log(`[DashboardListener] User character count updated to ${user.characterCount}`);
        }
      }
    );
  }
}
