// services/challenge-service/src/controllers/challengeController.js
const challengeService = require('../services/challengeService');

const getChallenges = async (req, res) => {
  try {
    const challenges = await challengeService.getAllChallenges();
    res.json(challenges);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch challenges' });
  }
};

const createChallenge = async (req, res) => {
  try {
    const challenge = await challengeService.createChallenge(req.body);
    res.status(201).json({ id: challenge.id, title: challenge.title });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create challenge' });
  }
};

module.exports = {
  getChallenges,
  createChallenge
};
