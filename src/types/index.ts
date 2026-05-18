// services/frontend/src/types/index.ts
export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  category: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface SolveEvent {
  userId: string;
  username: string;
  challengeId: string;
  challengeTitle: string;
  points: number;
  totalScore: number;
  solvedAt: string;
}
