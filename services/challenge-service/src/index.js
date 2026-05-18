// services/challenge-service/src/index.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Helper to hash flag
const hashFlag = (flag) => {
  return crypto.createHash('sha256').update(flag).digest('hex');
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
