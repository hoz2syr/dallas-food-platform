// services/order-tracking.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class OrderTrackingService {
  // حساب التوقيتات التقديرية (mock)
  async calculateEstimates(orderId: string) {
    return {
      preparation: { estimated: 25, min: 15, max: 40 },
      delivery: { estimated: 20, min: 10, max: 60 },
      total: { estimated: 45, min: 25, max: 100 }
    };
  }

  // تحديث مرحلة الطلب (mock)
  async updateOrderStage(orderId: string, stage: string, status: string, userId: number, notes?: string, estimatedMinutes?: number) {
    // هنا يتم تحديث قاعدة البيانات وتسجيل التايملاين
    return {
      success: true,
      orderId,
      stage,
      status,
      notes,
      estimatedMinutes,
      timestamp: new Date()
    };
  }

  // جلب بيانات تتبع الطلب (mock)
  async getOrderTrackingData(orderId: string) {
    return {
      orderId,
      currentStatus: 'preparation',
      estimates: await this.calculateEstimates(orderId),
      timeline: [],
      lastUpdated: new Date()
    };
  }

  // جلب الطلبات النشطة (mock)
  async getActiveOrders(query: { status?: string; stage?: string; timeRange?: string }) {
    return {
      count: 1,
      orders: [
        { id: 1, status: 'preparation', stage: 'preparation', createdAt: new Date() }
      ],
      lastUpdated: new Date()
    };
  }
}
