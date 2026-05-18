// services/submission-service/src/services/submissionService.js
const prisma = require('../config/prisma');
const redis = require('../config/redis');
const { hashFlag } = require('../utils/hash');

const submitFlag = async (userId, challengeId, flag) => {
  // 1. Fetch Challenge
  const challenge = await prisma.challenge.findUnique({ where: { id: challengeId } });
  if (!challenge) throw new Error('CHALLENGE_NOT_FOUND');

  const submittedHash = hashFlag(flag);
  const isCorrect = submittedHash === challenge.flagHash;

  // 2. Record Submission
  await prisma.submission.create({
    data: {
      userId,
      challengeId,
      submittedFlag: flag,
      isCorrect,
    }
  });

  if (isCorrect) {
    // 3. Update Score
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { totalScore: { increment: challenge.points } }
    });

    // 4. Pub/Sub for real-time updates
    const eventData = {
      userId: updatedUser.id,
      username: updatedUser.username,
      challengeId: challenge.id,
      challengeTitle: challenge.title,
      points: challenge.points,
      totalScore: updatedUser.totalScore,
      solvedAt: new Date().toISOString()
    };
    
    await redis.publish('ctf:solves', JSON.stringify(eventData));

    return { correct: true, points: challenge.points };
  }

  return { correct: false };
};

module.exports = {
  submitFlag
};
