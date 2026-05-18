// services/challenge-service/src/index.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const Redis = require('ioredis');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Helper to hash flag
const hashFlag = (flag) => {
  return crypto.createHash('sha256').update(flag).digest('hex');
};

// Rate Limiting Middleware/Logic for Submissions
const checkRateLimit = async (userId) => {
  const key = `ratelimit:submission:${userId}`;
  const current = await redis.incr(key);
  
  if (current === 1) {
    await redis.expire(key, 60); // Reset every minute
  }
  
  return current <= 5;
};

// GET /challenges - List all challenges
app.get('/challenges', async (req, res) => {
  try {
    const challenges = await prisma.challenge.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        points: true,
        category: true,
      }
    });
    res.json(challenges);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch challenges' });
  }
});

// POST /challenges - Create a new challenge (Admin)
app.post('/challenges', async (req, res) => {
  const { title, description, points, flag, category } = req.body;
  try {
    const challenge = await prisma.challenge.create({
      data: {
        title,
        description,
        points,
        flagHash: hashFlag(flag),
        category,
      }
    });
    res.status(201).json({ id: challenge.id, title: challenge.title });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create challenge' });
  }
});

// POST /challenges/:id/submit - Submit flag
app.post('/challenges/:id/submit', async (req, res) => {
  const { id } = req.params;
  const { userId, flag } = req.body;

  if (!userId || !flag) {
    return res.status(400).json({ error: 'userId and flag are required' });
  }

  try {
    // 1. Check Rate Limit
    const isWithinLimit = await checkRateLimit(userId);
    if (!isWithinLimit) {
      return res.status(429).json({ 
        error: 'Too many requests', 
        message: 'You can only submit 5 times per minute. Please wait.' 
      });
    }

    // 2. Validate Challenge
    const challenge = await prisma.challenge.findUnique({ where: { id } });
    if (!challenge) return res.status(404).json({ error: 'Challenge not found' });

    // 3. Hash and Check
    const submittedHash = hashFlag(flag);
    const isCorrect = submittedHash === challenge.flagHash;

    // 4. Record submission
    await prisma.submission.create({
      data: {
        userId,
        challengeId: id,
        submittedFlag: flag,
        isCorrect,
      }
    });

    if (isCorrect) {
      // Update user score
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { totalScore: { increment: challenge.points } }
      });

      // Publish event to Redis Pub/Sub for real-time scoreboard
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
    console.error(error);
    res.status(500).json({ error: 'Submission failed' });
  }
});

// POST /users - Quick user creation for testing
app.post('/users', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash: crypto.createHash('sha256').update(password).digest('hex'),
      }
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

app.listen(PORT, () => {
  console.log(`Challenge Service running on port ${PORT}`);
});
