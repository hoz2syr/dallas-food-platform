import { Controller, Get, Param, Patch, Body, Req, Query } from '@nestjs/common';
import { OrderTrackingService } from '../application/use-cases/order-tracking.service';

@Controller('orders')
export class OrderTrackingController {
  constructor(private readonly orderTrackingService: OrderTrackingService) {}

  // 1. الحصول على توقيتات الطلب وجدول التايملاين
  @Get(':orderId/tracking')
  async getOrderTimeline(@Param('orderId') orderId: string) {
    return this.orderTrackingService.getOrderTrackingData(orderId);
  }

  // 2. تحديث مرحلة الطلب (للموظفين)
  @Patch(':orderId/stage')
  async updateOrderStage(
    @Param('orderId') orderId: string,
    @Body() body: { stage: string; status: string; notes?: string; estimatedMinutes?: number },
    @Req() req: any
  ) {
    const userId = req.user?.id || 1; // مؤقتاً
    return this.orderTrackingService.updateOrderStage(orderId, body.stage, body.status, userId, body.notes, body.estimatedMinutes);
  }

  // 3. الحصول على جميع الطلبات النشطة (للوحة الإدارة)
  @Get('active')
  async getActiveOrders(@Query() query: { status?: string; stage?: string; timeRange?: string }) {
    return this.orderTrackingService.getActiveOrders(query);
  }
}
