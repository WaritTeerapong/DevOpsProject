// services/scoreboard-service/src/index.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const Redis = require('ioredis');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust in production
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3003;

// Redis Connections
// Note: We need a dedicated connection for subscribing
const redisSubscriber = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// 1. Subscribe to the 'ctf:solves' channel
redisSubscriber.subscribe('ctf:solves', (err, count) => {
  if (err) {
    console.error('Failed to subscribe to Redis channel:', err.message);
    return;
  }
  console.log(`Subscribed successfully to ${count} channel(s). Listening for solve events...`);
});

// 2. Listen for messages and broadcast via WebSockets
redisSubscriber.on('message', (channel, message) => {
  if (channel === 'ctf:solves') {
    console.log('Received solve event:', message);
    
    try {
      const data = JSON.parse(message);
      // Broadcast to all connected clients
      io.emit('new-solve', data);
    } catch (error) {
      console.error('Error parsing Redis message:', error);
    }
  }
});

// WebSocket Connection Logic
io.on('connection', (socket) => {
  console.log('A client connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'Scoreboard Streaming Service is live' });
});

server.listen(PORT, () => {
  console.log(`Scoreboard Streaming Service running on port ${PORT}`);
});
