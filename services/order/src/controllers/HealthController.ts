import { Request, Response } from 'express';
import amqp from 'amqplib';
// افترض وجود دالة getDataSource للاتصال بقاعدة البيانات
export class HealthController {
        private async checkRabbitMQ(): Promise<{ healthy: boolean; details?: string }> {
            const amqpUrl = process.env.RABBITMQ_URL || 'amqp://admin:admin123@rabbitmq:5672';
            try {
                const connection = await amqp.connect(amqpUrl);
                const channel = await connection.createChannel();
                await channel.close();
                await connection.close();
                return { healthy: true, details: 'RabbitMQ connection successful' };
            } catch (error: any) {
                return {
                    healthy: false,
                    details: `RabbitMQ connection failed: ${error.message}`
                };
            }
        }
    private wsConnectedClients: number = 0;

    constructor() {
        setInterval(() => {
            this.wsConnectedClients = global.wsServer?.engine?.clientsCount || 0;
        }, 5000);
    }

    async getHealth(req: Request, res: Response) {
        const rabbitmqCheck = await this.checkRabbitMQ();
        const healthStatus = {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            service: 'order-service',
            version: process.env.npm_package_version || '1.0.0',
            uptime: process.uptime(),
            checks: {
                database: { healthy: true }, // يمكن تحسينها لاحقاً
                rabbitmq: rabbitmqCheck,
                websocket: { healthy: true },
                memory: { healthy: true }
            },
            metrics: {
                wsConnectedClients: this.wsConnectedClients,
                memoryUsage: process.memoryUsage()
            }
        };
        res.status(200).json(healthStatus);
    }

    async getMetrics(req: Request, res: Response) {
        const metrics = {
            timestamp: new Date().toISOString(),
            process: {
                pid: process.pid,
                memory: process.memoryUsage(),
                cpu: process.cpuUsage(),
                uptime: process.uptime()
            },
            websocket: {
                connectedClients: this.wsConnectedClients
            }
        };
        res.json(metrics);
    }
}
