import amqp from 'amqplib';
import type { Channel, Connection } from 'amqplib';

export class EventEmitter {
  // @ts-ignore
  private static channel: any;
  private static exchange = 'order.events';

  static async initialize() {
    try {
      // @ts-ignore
      const connection: any = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
      this.channel = await connection.createChannel();
      await this.channel.assertExchange(this.exchange, 'topic', { durable: true });
      console.log('✅ EventEmitter connected to RabbitMQ');
    } catch (error) {
      console.error('❌ Failed to connect EventEmitter to RabbitMQ:', error);
    }
  }

  static emit(routingKey: string, eventData: any) {
    if (!this.channel) {
      console.warn('⚠️ EventEmitter channel not ready.');
      return;
    }
    this.channel.publish(
      this.exchange,
      routingKey,
      Buffer.from(JSON.stringify({
        ...eventData,
        timestamp: new Date().toISOString()
      }))
    );
    console.log(`📤 Event emitted: ${routingKey}`);
  }
}
