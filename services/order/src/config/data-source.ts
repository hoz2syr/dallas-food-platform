import { DataSource } from 'typeorm';
import { Order } from '../models/Order';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'dallas',
  password: process.env.DB_PASS || 'dallas',
  database: process.env.DB_NAME || 'dallas',
  entities: [Order],
  migrations: [__dirname + '/../migrations/*.{ts,js}'],
  synchronize: false,
  logging: false,
});
