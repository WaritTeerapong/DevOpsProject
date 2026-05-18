// services/auth-service/src/index.js
const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3004;

app.use(express.json());
app.use(passport.initialize());

// Passport Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user exists by googleId or email
      let user = await prisma.user.findFirst({
        where: {
          OR: [
            { googleId: profile.id },
            { email: profile.emails[0].value }
          ]
        }
      });

      if (!user) {
        // Create new user if not found
        user = await prisma.user.create({
          data: {
            googleId: profile.id,
            username: profile.displayName.replace(/\s+/g, '_').toLowerCase() + '_' + Math.floor(Math.random() * 1000),
            email: profile.emails[0].value,
            // totalScore defaults to 0
          }
        });
      } else if (!user.googleId) {
        // Link google account if user exists by email but has no googleId
        user = await prisma.user.update({
          where: { id: user.id },
          data: { googleId: profile.id }
        });
      }

      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

// Auth Routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback', 
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    // Generate JWT
    const token = jwt.sign(
      { userId: req.user.id, username: req.user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Redirect or Send token
    // In a real app, you might redirect to a frontend with the token in a query param or cookie
    res.json({
      message: 'Authentication successful',
      token: token,
      user: {
        id: req.user.id,
        username: req.user.username,
        email: req.user.email
      }
    });
  }
);

app.get('/health', (req, res) => {
  res.json({ status: 'Auth Service is live' });
});

app.listen(PORT, () => {
  console.log(`Auth Service running on port ${PORT}`);
});
