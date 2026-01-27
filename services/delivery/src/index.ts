import 'reflect-metadata';
import express from 'express';
import { AppDataSource } from './config/data-source';
import { DeliveryAssignmentConsumer } from './consumers/DeliveryAssignmentConsumer';
import deliveryRoutes from './routes/delivery';
import healthRoutes from './routes/health';

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/delivery', deliveryRoutes);
app.use('/api/health', healthRoutes);

// Initialize
async function startServer() {
    try {
        // 1. Connect to database
        await AppDataSource.initialize();
        console.log('✅ [Delivery] Database connected');
        // 2. Start RabbitMQ consumer
        const consumer = new DeliveryAssignmentConsumer();
        await consumer.start();
        // 3. Start HTTP server
        app.listen(PORT, () => {
            console.log(`🚚 [Delivery] Service running on port ${PORT}`);
        });
        // Graceful shutdown
        process.on('SIGTERM', async () => {
            console.log('🛑 [Delivery] Shutting down gracefully...');
            await consumer.stop();
            await AppDataSource.destroy();
            process.exit(0);
        });
    } catch (error) {
        console.error('❌ [Delivery] Failed to start:', error);
        process.exit(1);
    }
}

startServer();
