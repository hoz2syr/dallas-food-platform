
import rateLimit from 'express-rate-limit';
import { config } from '../config';

let store;
if (process.env.NODE_ENV === 'production' && config.redis.url) {
  // استخدم RedisStore في الإنتاج فقط
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const RedisStore = require('rate-limit-redis');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Redis = require('ioredis');
  const redisClient = new Redis(config.redis.url, {
    password: config.redis.password || undefined,
  });
  store = new RedisStore({
    sendCommand: async (...args: string[]): Promise<string | number | boolean | Array<string | number | boolean>> => {
      return await redisClient.call(args[0], ...args.slice(1));
    },
  });
} else {
  // استخدم MemoryStore في التطوير أو عند غياب Redis
  store = undefined; // الافتراضي في express-rate-limit
}

export const rateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  store,
  keyGenerator: req => req.ip || '',
  handler: (req, res) => {
    res.status(429).json({ message: 'Too many requests' });
  },
});
