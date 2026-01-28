import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';
import { config } from '../config';

const redisClient = new Redis(config.redis.url, {
  password: config.redis.password || undefined,
});

export const rateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  store: new RedisStore({
    sendCommand: (...args: string[]) => redisClient.call(...args),
  }),
  keyGenerator: req => req.ip,
  handler: (req, res) => {
    res.status(429).json({ message: 'Too many requests' });
  },
});
