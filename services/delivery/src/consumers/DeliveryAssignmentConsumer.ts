import amqp, { Channel, Connection } from 'amqplib';
import { DeliveryTrip } from '../models/DeliveryTrip';
import { AppDataSource } from '../config/data-source';
import { DeliveryAssignmentEvent } from '../types/delivery';
import { geocodeAddress } from '../services/GeocodingService';
import { calculateRoute } from '../services/RoutingService';

export class DeliveryAssignmentConsumer {
    private connection: Connection | null = null;
    private channel: Channel | null = null;
    private readonly queueName = 'order.status.updates';
    private readonly routingKey = 'order.status.ready_for_delivery';

    async start(): Promise<void> {
        try {
            const rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://order_service:order_service_pass@rabbitmq:5672';
            this.connection = await amqp.connect(rabbitmqUrl);
            this.channel = await this.connection.createChannel();
            // التأكد من وجود الطابور (يجب أن يكون موجوداً من تعريفات infra)
            await this.channel.assertQueue(this.queueName, { durable: true });
            // الربط بالموضوع المحدد
            await this.channel.bindQueue(this.queueName, 'order.events', this.routingKey);
            console.log(`✅ [Delivery] Consumer started, listening on queue: ${this.queueName}, routing key: ${this.routingKey}`);
            this.channel.consume(this.queueName, async (msg) => {
                if (msg) {
                    try {
                        const event = JSON.parse(msg.content.toString()) as DeliveryAssignmentEvent;
                        console.log(`📦 [Delivery] Received assignment event for order ${event.orderId}`);
                        // معالجة الحدث
                        await this.processDeliveryAssignment(event);
                        // تأكيد استلام الرسالة
                        this.channel?.ack(msg);
                    } catch (error) {
                        console.error('❌ [Delivery] Error processing message:', error);
                        // رفض الرسالة دون إعادة إرسال (يمكن تحسينها لاحقاً)
                        this.channel?.nack(msg, false, false);
                    }
                }
            });
        } catch (error) {
            console.error('❌ [Delivery] Failed to start RabbitMQ consumer:', error);
            throw error;
        }
    }

    private async processDeliveryAssignment(event: DeliveryAssignmentEvent): Promise<void> {
        const deliveryRepo = AppDataSource.getRepository(DeliveryTrip);
        // 1. تحويل العنوان إلى إحداثيات (Geocoding)
        const destinationCoords = await geocodeAddress(event.deliveryAddress);
        if (!destinationCoords) {
            throw new Error(`Failed to geocode address: ${event.deliveryAddress}`);
        }
        // 2. حساب المسار والوقت المقدر
        const routeInfo = await calculateRoute(
            event.restaurantLocation,
            destinationCoords
        );
        // 3. إنشاء سجل رحلة توصيل
        const deliveryTrip = deliveryRepo.create({
            orderId: event.orderId,
            deliveryAddress: event.deliveryAddress,
            status: 'pending',
            destinationLat: destinationCoords.lat,
            destinationLng: destinationCoords.lng,
            pickupLat: event.restaurantLocation.lat,
            pickupLng: event.restaurantLocation.lng,
            estimatedDurationMinutes: Math.ceil(routeInfo.duration / 60) // تحويل إلى دقائق
        });
        await deliveryRepo.save(deliveryTrip);
        console.log(`✅ [Delivery] Created delivery trip #${deliveryTrip.id} for order ${event.orderId}`);
        // TODO: في المستقبل، يمكن إضافة منطق تعيين سائق تلقائياً هنا
        // this.assignDriver(deliveryTrip.id);
    }

    async stop(): Promise<void> {
        if (this.channel) {
            await this.channel.close();
        }
        if (this.connection) {
            await this.connection.close();
        }
        console.log('🛑 [Delivery] Consumer stopped');
    }
}
