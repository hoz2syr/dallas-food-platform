import { Controller, Post, Body, HttpException } from '@nestjs/common';
import { PlaceOrderUseCase } from '../application/use-cases/place-order.use-case';
import { PlaceOrderCommand } from '../application/commands/place-order.command';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { mapToApiError } from '../../../../../shared/errors/http-exception.mapper';
@ApiTags('Orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly placeOrderUseCase: PlaceOrderUseCase) {}

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
}
