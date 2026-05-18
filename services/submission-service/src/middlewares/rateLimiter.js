// services/submission-service/src/middlewares/rateLimiter.js
const redis = require('../config/redis');

const submissionRateLimiter = async (req, res, next) => {
  const { userId } = req.body;
  if (!userId) return next();

  const key = `ratelimit:submission:${userId}`;
  try {
    const current = await redis.incr(key);
    
    if (current === 1) {
      await redis.expire(key, 60); // Set window to 60 seconds
    }
    
    if (current > 5) {
      return res.status(429).json({ 
        error: 'Too many requests', 
        message: 'Rate limit exceeded (5 attempts per minute). Please wait.' 
      });
    }
    next();
  } catch (error) {
    console.error('Rate Limiter Error:', error);
    next(); // Continue even if redis fails (fail-open)
  }
};

module.exports = {
  submissionRateLimiter
};
