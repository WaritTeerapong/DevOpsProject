// services/scoreboard-service/src/index.js
require('dotenv').config();
const express = require('express');
const http = require('http');
const socketService = require('./services/socketService');
const scoreboardService = require('./services/scoreboardService');

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3003;

// Initialize Socket.io
socketService.init(server);

// Initialize Scoreboard Logic (Redis Subscriber)
scoreboardService.init();

app.get('/health', (req, res) => {
  res.json({ status: 'Scoreboard Streaming Service is live' });
});

server.listen(PORT, () => {
  console.log(`Scoreboard Streaming Service running on port ${PORT}`);
});
