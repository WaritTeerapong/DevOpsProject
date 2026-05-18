// services/submission-service/src/index.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const Redis = require('ioredis');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
const PORT = process.env.PORT || 3002;

app.use(express.json());

// Helper to hash flag
const hashFlag = (flag) => {
  return crypto.createHash('sha256').update(flag).digest('hex');
};

/**
 * Fixed Window Rate Limiter
 * Limits to 5 attempts per 60 seconds per User
 */
const checkRateLimit = async (userId) => {
  const key = `ratelimit:submission:${userId}`;
  const current = await redis.incr(key);
  
  if (current === 1) {
    await redis.expire(key, 60); // Set window to 60 seconds
  }
  
  return current <= 5;
};

// POST /submit - Main Flag Submission Endpoint
app.post('/submit', async (req, res) => {
  const { userId, challengeId, flag } = req.body;

  if (!userId || !challengeId || !flag) {
    return res.status(400).json({ error: 'userId, challengeId, and flag are required' });
  }

  try {
    // 1. Fixed Window Rate Limiting
    const isWithinLimit = await checkRateLimit(userId);
    if (!isWithinLimit) {
      return res.status(429).json({ 
        error: 'Too many requests', 
        message: 'Rate limit exceeded (5 attempts per minute). Please wait.' 
      });
    }

    // 2. Fetch Challenge and Check Flag
    const challenge = await prisma.challenge.findUnique({ where: { id: challengeId } });
    if (!challenge) return res.status(404).json({ error: 'Challenge not found' });

    const submittedHash = hashFlag(flag);
    const isCorrect = submittedHash === challenge.flagHash;

    // 3. Record Submission (Atomic-ish)
    await prisma.submission.create({
      data: {
        userId,
        challengeId,
        submittedFlag: flag,
        isCorrect,
      }
    });

    if (isCorrect) {
      // 4. Update Score if correct
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { totalScore: { increment: challenge.points } }
      });

      // 5. Pub/Sub for real-time updates
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

      return res.json({ correct: true, points: challenge.points, message: 'Correct flag!' });
    }

    res.json({ correct: false, message: 'Wrong flag, try again.' });
  } catch (error) {
    console.error('Submission Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Submission Service running on port ${PORT}`);
});
