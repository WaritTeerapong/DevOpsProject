// services/scoreboard-service/src/services/scoreboardService.js
const redisSubscriber = require('../config/redis');
const socketService = require('./socketService');

const init = () => {
  redisSubscriber.subscribe('ctf:solves', (err, count) => {
    if (err) {
      console.error('Failed to subscribe to Redis channel:', err.message);
      return;
    }
    console.log(`Subscribed successfully to ${count} channel(s). Listening for solve events...`);
  });

  redisSubscriber.on('message', (channel, message) => {
    if (channel === 'ctf:solves') {
      console.log('Received solve event:', message);
      try {
        const data = JSON.parse(message);
        socketService.broadcast('new-solve', data);
      } catch (error) {
        console.error('Error parsing Redis message:', error);
      }
    }
  });
};

module.exports = {
  init
};
