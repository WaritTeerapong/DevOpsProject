// services/auth-service/src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const authController = require('../controllers/authController');

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback', 
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  authController.googleCallback
);

router.get('/health', authController.healthCheck);

module.exports = router;
