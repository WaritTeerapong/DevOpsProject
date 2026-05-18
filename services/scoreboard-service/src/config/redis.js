// services/scoreboard-service/src/config/redis.js
const Redis = require('ioredis');
const redisSubscriber = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

redisSubscriber.on('error', (err) => console.error('Redis Subscriber Error', err));

module.exports = redisSubscriber;
