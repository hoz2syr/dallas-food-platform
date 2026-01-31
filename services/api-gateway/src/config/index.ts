import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 8080,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwt: {
    secret: process.env.JWT_SECRET || '',
    refreshSecret: process.env.JWT_REFRESH_SECRET || '',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  services: {
    order: process.env.ORDER_SERVICE_URL || '',
    menu: process.env.MENU_SERVICE_URL || '',
    delivery: process.env.DELIVERY_SERVICE_URL || '',
    payment: process.env.PAYMENT_SERVICE_URL || '',
  },
  redis: {
    url: process.env.REDIS_URL || '',
    password: process.env.REDIS_PASSWORD || '',
  },
  rateLimit: {
    windowMs: process.env.RATE_LIMIT_WINDOW_MS ? parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) : 900000,
    max: process.env.RATE_LIMIT_MAX_REQUESTS ? parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) : 100,
  },
  cors: {
    // ⚠️ هام: يجب ضبط CORS_ORIGIN في .env للإنتاج وعدم الاعتماد على '*'
    // مثال: CORS_ORIGIN="http://localhost:3000,https://your-production-domain.com"
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
      : [
          'http://localhost:3000',
          'http://localhost:3001',
          'https://your-production-domain.com'
        ],
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'json',
  },
  circuitBreaker: {
    timeout: process.env.CIRCUIT_BREAKER_TIMEOUT ? parseInt(process.env.CIRCUIT_BREAKER_TIMEOUT, 10) : 3000,
    errorThreshold: process.env.CIRCUIT_BREAKER_ERROR_THRESHOLD ? parseInt(process.env.CIRCUIT_BREAKER_ERROR_THRESHOLD, 10) : 50,
    resetTimeout: process.env.CIRCUIT_BREAKER_RESET_TIMEOUT ? parseInt(process.env.CIRCUIT_BREAKER_RESET_TIMEOUT, 10) : 30000,
  },
  timeouts: {
    proxy: 5000,
  },
  retry: {
    maxAttempts: 3,
  },
};
