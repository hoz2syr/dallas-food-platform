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
    sendCommand: async (...args: string[]): Promise<string | number | boolean | Array<string | number | boolean>> => {
      // فكك المصفوفة: أول عنصر هو الأمر والباقي هي الوسائط
      return await redisClient.call(args[0], ...args.slice(1)) as string | number | boolean | Array<string | number | boolean>;
    },
  }),
  keyGenerator: req => req.ip || '',
  handler: (req, res) => {
    res.status(429).json({ message: 'Too many requests' });
  },
});
