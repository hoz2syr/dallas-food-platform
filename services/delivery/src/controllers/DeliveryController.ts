import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { DeliveryTrip } from '../models/DeliveryTrip';
import { DeliveryStatus } from '../types/delivery';

export class DeliveryController {
    // الحصول على رحلة التوصيل بواسطة معرف الطلب
    async getDeliveryByOrderId(req: Request, res: Response) {
        try {
            const { orderId } = req.params;
            const deliveryRepo = AppDataSource.getRepository(DeliveryTrip);
            const delivery = await deliveryRepo.findOne({
                where: { orderId: parseInt(orderId) },
                order: { createdAt: 'DESC' }
            });
            if (!delivery) {
                return res.status(404).json({
                    success: false,
                    error: 'Delivery trip not found for this order'
                });
            }
            res.json({
                success: true,
                data: delivery
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
    // تحديث حالة رحلة التوصيل
    async updateDeliveryStatus(req: Request, res: Response) {
        try {
            const { tripId } = req.params;
            const { status, driverId, driverName } = req.body;
            const deliveryRepo = AppDataSource.getRepository(DeliveryTrip);
            const trip = await deliveryRepo.findOneBy({ id: parseInt(tripId) });
            if (!trip) {
                return res.status(404).json({
                    success: false,
                    error: 'Delivery trip not found'
                });
            }
            // تحديث الحالة والبيانات المرتبطة
            trip.status = status as DeliveryStatus;
            if (driverId) trip.assignedDriverId = driverId;
            if (driverName) trip.assignedDriverName = driverName;
            if (status === DeliveryStatus.PICKED_UP) {
                trip.pickedUpAt = new Date();
            } else if (status === DeliveryStatus.DELIVERED) {
                trip.deliveredAt = new Date();
            }
            await deliveryRepo.save(trip);
            // TODO: في المستقبل، يمكن إرسال حدث تحديث الحالة عبر RabbitMQ
            res.json({
                success: true,
                data: trip,
                message: `Delivery status updated to ${status}`
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
    // الحصول على جميع رحلات التوصيل بحالة معينة
    async getDeliveriesByStatus(req: Request, res: Response) {
        try {
            const { status } = req.params;
            const { limit = 50 } = req.query;
            const deliveryRepo = AppDataSource.getRepository(DeliveryTrip);
            const deliveries = await deliveryRepo.find({
                where: { status: status as DeliveryStatus },
                order: { createdAt: 'DESC' },
                take: parseInt(limit as string)
            });
            res.json({
                success: true,
                data: {
                    count: deliveries.length,
                    deliveries
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
}
