import { Injectable } from '@nestjs/common';

@Injectable()
export class OrderStatusGateway {
  private io: any;

  setSocketServer(io: any) {
    this.io = io;
  }

  emitOrderStatusUpdate(orderId: string, status: string) {
    if (this.io) {
      this.io.to(`order-${orderId}`).emit('order-status-updated', {
        orderId,
        status,
        updatedAt: new Date()
      });
    }
  }
}
