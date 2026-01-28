import winston from 'winston';
import { config } from '../config';

export const logger = winston.createLogger({
  level: config.logging.level,
  format: config.logging.format === 'json' ? winston.format.json() : winston.format.simple(),
  transports: [
    new winston.transports.Console(),
  ],
});
