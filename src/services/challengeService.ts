// services/frontend/src/services/challengeService.ts
import api from './api';
import { Challenge } from '../types';

export const getChallenges = async (): Promise<Challenge[]> => {
  const response = await api.get('/challenges');
  return response.data;
};

export const getChallengeById = async (id: string): Promise<Challenge> => {
  const response = await api.get(`/challenges/${id}`);
  return response.data;
};

export const submitFlag = async (userId: string, challengeId: string, flag: string) => {
  const response = await api.post('/submit', { userId, challengeId, flag });
  return response.data;
};
