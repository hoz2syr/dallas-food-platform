import { Controller, Get, Param, Patch, Body, Req, Query } from '@nestjs/common';
import { OrderTrackingService } from '../application/use-cases/order-tracking.service';

@Controller('orders')
export class OrderTrackingController {
  constructor(private readonly orderTrackingService: OrderTrackingService) {}

  // 1. Retrieve order timing estimates and timeline
  @Get(':orderId/tracking')
  async getOrderTimeline(@Param('orderId') orderId: string) {
    return this.orderTrackingService.getOrderTrackingData(orderId);
  }

  // 2. Update order stage (for staff)
  @Patch(':orderId/stage')
  async updateOrderStage(
    @Param('orderId') orderId: string,
    @Body() body: { stage: string; status: string; notes?: string; estimatedMinutes?: number },
    @Req() req: any
  ) {
    const userId = req.user?.id || 1; // Temporary fallback userId
    return this.orderTrackingService.updateOrderStage(orderId, body.stage, body.status, userId, body.notes, body.estimatedMinutes);
  }

  // 3. Retrieve all active orders (for admin dashboard)
  @Get('active')
  async getActiveOrders(@Query() query: { status?: string; stage?: string; timeRange?: string }) {
    return this.orderTrackingService.getActiveOrders(query);
  }
}
