import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Order, OrderStatus } from '../models/Order';
import { EventEmitter } from '../events/EventEmitter';

export class OrderController {
  private orderRepository = AppDataSource.getRepository(Order);

  async createOrder(req: Request, res: Response) {
    try {
      const { customerId, customerName, deliveryAddress, items } = req.body;
      const totalAmount = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
      const newOrder = this.orderRepository.create({
        customerId,
        customerName,
        deliveryAddress,
        items,
        totalAmount,
        status: OrderStatus.PENDING
      });
      const savedOrder = await this.orderRepository.save(newOrder);
      EventEmitter.emit('order.created', savedOrder);
      res.status(201).json({ success: true, data: savedOrder });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getOrders(req: Request, res: Response) {
    try {
      const { status } = req.query;
      const where = status ? { status } : {};
      const orders = await this.orderRepository.find({
        where,
        order: { createdAt: 'DESC' }
      });
      res.json({ success: true, data: orders });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async updateOrderStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const order = await this.orderRepository.findOneBy({ id });
      if (!order) {
        return res.status(404).json({ success: false, error: 'Order not found' });
      }
      const previousStatus = order.status;
      order.status = status as OrderStatus;
      const updatedOrder = await this.orderRepository.save(order);
      EventEmitter.emit('order.status.updated', { orderId: updatedOrder.id, previousStatus, newStatus: updatedOrder.status, order: updatedOrder });
      res.json({ success: true, data: updatedOrder });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
