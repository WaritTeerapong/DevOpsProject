// services/api-gateway/src/index.js
require('dotenv').config();
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const morgan = require('morgan');
const verifyToken = require('./middlewares/authMiddleware');

const app = express();
const PORT = process.env.PORT || 8000;

// Configuration
const SERVICES = {
  auth: process.env.AUTH_SERVICE_URL || 'http://localhost:3004',
  authCanary: process.env.CANARY_AUTH_SERVICE_URL || '', // URL for Canary version
  challenge: process.env.CHALLENGE_SERVICE_URL || 'http://localhost:3001',
  submission: process.env.SUBMISSION_SERVICE_URL || 'http://localhost:3002',
  scoreboard: process.env.SCOREBOARD_SERVICE_URL || 'http://localhost:3003',
};

const CANARY_PERCENTAGE = parseFloat(process.env.CANARY_PERCENTAGE) || 0; // e.g., 0.1 for 10%

// Middleware
app.use(cors());
app.use(morgan('dev'));

// Health Check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'API Gateway is live',
    canaryEnabled: !!SERVICES.authCanary && CANARY_PERCENTAGE > 0,
    canaryPercentage: `${CANARY_PERCENTAGE * 100}%`
  });
});

// Proxy Routes
// 1. Auth Service (With Canary Support)
app.use('/auth', (req, res, next) => {
  const target = (SERVICES.authCanary && Math.random() < CANARY_PERCENTAGE) 
    ? SERVICES.authCanary 
    : SERVICES.auth;
  
  if (target === SERVICES.authCanary) {
    console.log(`[Canary] Routing request to: ${target}${req.url}`);
  }

  createProxyMiddleware({
    target,
    changeOrigin: true,
  })(req, res, next);
});

// 2. Challenge Service (Public)
app.use('/challenges', createProxyMiddleware({
  target: SERVICES.challenge,
  changeOrigin: true,
}));

// 3. User Service
app.use('/users', createProxyMiddleware({
  target: SERVICES.challenge,
  changeOrigin: true,
}));

// 4. Submission Service (Protected)
app.use('/submit', verifyToken, createProxyMiddleware({
  target: SERVICES.submission,
  changeOrigin: true,
}));

// Start Gateway
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
  console.log(`Canary percentage: ${CANARY_PERCENTAGE * 100}%`);
});
