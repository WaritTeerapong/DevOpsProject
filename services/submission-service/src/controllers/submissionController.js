// services/submission-service/src/controllers/submissionController.js
const submissionService = require('../services/submissionService');

const handleSubmit = async (req, res) => {
  const { userId, challengeId, flag } = req.body;

  if (!userId || !challengeId || !flag) {
    return res.status(400).json({ error: 'userId, challengeId, and flag are required' });
  }

  try {
    const result = await submissionService.submitFlag(userId, challengeId, flag);
    
    if (result.correct) {
      return res.json({ correct: true, points: result.points, message: 'Correct flag!' });
    }

    res.json({ correct: false, message: 'Wrong flag, try again.' });
  } catch (error) {
    if (error.message === 'CHALLENGE_NOT_FOUND') {
      return res.status(404).json({ error: 'Challenge not found' });
    }
    console.error('Submission Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  handleSubmit
};
