import { User } from "../entities/User";

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<void>;
  updateCharacterCount(userId: string, count: number): Promise<void>;
}
