import { SubmitFlagUseCase } from "./SubmitFlagUseCase";
import { IUserRepository } from "../domain/repositories/IUserRepository";
import { IChallengeRepository } from "../domain/repositories/IChallengeRepository";
import { User } from "../domain/entities/User";
import { Challenge } from "../domain/entities/Challenge";

// 1. Mock Repositories (In-Memory)
class MockUserRepository implements IUserRepository {
  private users: User[] = [];

  constructor(initialUsers: User[] = []) {
    this.users = initialUsers;
  }

  async findById(id: string): Promise<User | null> {
    return this.users.find((u) => u.id === id) || null;
  }
  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((u) => u.email === email) || null;
  }
  async save(user: User): Promise<void> {
    this.users.push(user);
  }
  async updateScore(userId: string, newScore: number): Promise<void> {
    const user = await this.findById(userId);
    if (user) {
      // In a real mock we might update the internal state, 
      // but the Entity already updated its own state in the UseCase.
    }
  }
}

class MockChallengeRepository implements IChallengeRepository {
  private challenges: Challenge[] = [];

  constructor(initialChallenges: Challenge[] = []) {
    this.challenges = initialChallenges;
  }

  async findById(id: string): Promise<Challenge | null> {
    return this.challenges.find((c) => c.id === id) || null;
  }
  async findAll(): Promise<Challenge[]> {
    return this.challenges;
  }
}

// 2. Test Suite
describe("SubmitFlagUseCase", () => {
  let submitFlagUseCase: SubmitFlagUseCase;
  let mockUserRepo: MockUserRepository;
  let mockChallengeRepo: MockChallengeRepository;

  const mockUser = new User({
    id: "user1",
    name: "Test User",
    email: "test@example.com",
    score: 0,
  });

  const mockChallenge = new Challenge({
    id: "challenge1",
    title: "Easy SQLi",
    description: "Find the flag",
    flag: "CTF{sQl_1nj3cti0n_w1n}",
    points: 100,
    category: "Web",
  });

  beforeEach(() => {
    // รีเซ็ต Mock ทุกครั้งก่อนรันแต่ละ Test
    mockUserRepo = new MockUserRepository([mockUser]);
    mockChallengeRepo = new MockChallengeRepository([mockChallenge]);
    submitFlagUseCase = new SubmitFlagUseCase(mockUserRepo, mockChallengeRepo);
  });

  it("should return true and add points if flag is correct", async () => {
    // Arrange
    const request = {
      userId: "user1",
      challengeId: "challenge1",
      submittedFlag: "CTF{sQl_1nj3cti0n_w1n}",
    };

    // Act
    const response = await submitFlagUseCase.execute(request);

    // Assert
    expect(response.isCorrect).toBe(true);
    expect(response.pointsEarned).toBe(100);
    expect(mockUser.score).toBe(100); // คะแนนต้องถูกบวกใน Entity
  });

  it("should return false and not add points if flag is incorrect", async () => {
    // Arrange
    const request = {
      userId: "user1",
      challengeId: "challenge1",
      submittedFlag: "CTF{wrong_flag}",
    };

    // Act
    const response = await submitFlagUseCase.execute(request);

    // Assert
    expect(response.isCorrect).toBe(false);
    expect(response.pointsEarned).toBe(0);
    expect(mockUser.score).toBe(0); // คะแนนต้องไม่เพิ่ม
  });

  it("should throw an error if user does not exist", async () => {
    const request = {
      userId: "non_existent_user",
      challengeId: "challenge1",
      submittedFlag: "CTF{sQl_1nj3cti0n_w1n}",
    };

    await expect(submitFlagUseCase.execute(request)).rejects.toThrow("User not found");
  });
});
