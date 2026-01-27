import { DataSource } from 'typeorm';
import { Notification, UserNotificationPreference } from '../models/Notification';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'postgres',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'postgres',
    database: process.env.DB_NAME || 'dallas_food',
    entities: [Notification, UserNotificationPreference],
    synchronize: false,
    logging: true,
    migrations: [__dirname + '/../migrations/*.{ts,js}'],
});
