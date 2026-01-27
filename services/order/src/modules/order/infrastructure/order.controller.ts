import { Controller, Post, Body, HttpException, Patch, Param, Inject, Req } from '@nestjs/common';
import { PlaceOrderUseCase } from '../application/use-cases/place-order.use-case';
import { PlaceOrderCommand } from '../application/commands/place-order.command';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { mapToApiError } from '../../../../../shared/errors/http-exception.mapper';
import { OrderStatusGateway } from './order-status.gateway';
@ApiTags('Orders')
@Controller('orders')
export class OrderController {
  constructor(
    private readonly placeOrderUseCase: PlaceOrderUseCase,
    private readonly orderStatusGateway: OrderStatusGateway
  ) {}

  @Post()
  @ApiOperation({ summary: 'Place a new order' })
  @ApiBody({
    schema: {
      example: { orderId: 'o1', items: ['p1', 'p2'] },
    },
  })
  @ApiResponse({ status: 200, description: 'Order placed', schema: { example: { id: 'o1', status: 'PENDING', createdAt: '2026-01-01T00:00:00.000Z' } } })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Body() body: { orderId: string; items: string[] }) {
    const command: PlaceOrderCommand = {
      orderId: body.orderId,
      items: (body.items || []).map((p) => ({ productId: p, quantity: 1 }))
    };

    try {
      const order = await this.placeOrderUseCase.execute(command);
      return {
        id: order.id,
        status: order.status,
        createdAt: order.createdAt
      };
    } catch (err) {
      const mapped = mapToApiError(err);
      throw new HttpException(mapped.body, mapped.status);
    }
  }

  @Patch(':orderId/status')
  async updateStatus(
    @Param('orderId') orderId: string,
    @Body('status') status: string,
    @Req() req: any
  ) {
    // هنا يجب تحديث حالة الطلب في قاعدة البيانات (منطقيًا)
    // ثم إرسال التحديث عبر WebSocket
    // مثال توضيحي فقط:
    // await OrderService.updateStatus(orderId, status);
    this.orderStatusGateway.emitOrderStatusUpdate(orderId, status);
    return { success: true, orderId, status };
  }
}
