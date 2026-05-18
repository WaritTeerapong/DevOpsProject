// services/challenge-service/src/services/challengeService.js
const prisma = require('../config/prisma');
const { hashFlag } = require('../utils/hash');

const getAllChallenges = async () => {
  return await prisma.challenge.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      points: true,
      category: true,
    }
  });
};

const createChallenge = async (data) => {
  const { title, description, points, flag, category } = data;
  return await prisma.challenge.create({
    data: {
      title,
      description,
      points,
      flagHash: hashFlag(flag),
      category,
    }
  });
};

module.exports = {
  getAllChallenges,
  createChallenge
};
