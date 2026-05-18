import Redis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL;

if (!REDIS_URL && process.env.NODE_ENV === 'production') {
  console.warn('Warning: REDIS_URL is not defined in production environment.');
}

const globalForRedis = global as unknown as { redis: Redis };

export const redis =
  globalForRedis.redis ||
  new Redis(REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: null,
  });

redis.on('error', (err) => {
  if (err.name === 'MaxRetriesPerRequestError') {
    console.error('Critical Redis Error: MaxRetriesPerRequestError. The client has exceeded the maximum number of retries.');
    console.error('Details:', err.message);
  } else {
    console.error('Redis Client Error:', err);
  }
});

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis;
