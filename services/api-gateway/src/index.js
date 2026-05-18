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
  challenge: process.env.CHALLENGE_SERVICE_URL || 'http://localhost:3001',
  submission: process.env.SUBMISSION_SERVICE_URL || 'http://localhost:3002',
  scoreboard: process.env.SCOREBOARD_SERVICE_URL || 'http://localhost:3003',
};

// Middleware
app.use(cors());
app.use(morgan('dev'));

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'API Gateway is live' });
});

// Proxy Routes
// 1. Auth Service
app.use('/auth', createProxyMiddleware({
  target: SERVICES.auth,
  changeOrigin: true,
}));

// 2. Challenge Service (Public)
app.use('/challenges', createProxyMiddleware({
  target: SERVICES.challenge,
  changeOrigin: true,
}));

// 3. User Service (within Challenge Service for now - Public for test creation)
app.use('/users', createProxyMiddleware({
  target: SERVICES.challenge,
  changeOrigin: true,
}));

// 4. Submission Service (Protected)
app.use('/submit', verifyToken, createProxyMiddleware({
  target: SERVICES.submission,
  changeOrigin: true,
  onProxyReq: (proxyReq, req, res) => {
    // Forward user info from token to the service
    if (req.user) {
      // For simplicity, we can pass it as a header or just assume the service trusts the gateway
      // Most services expect the userId in the body. Since this is a proxy, 
      // we might need to handle body parsing if we want to inject userId.
      // But for now, we'll just protect the route.
    }
  }
}));

// Start Gateway
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
  console.log('Routing table:', SERVICES);
});
