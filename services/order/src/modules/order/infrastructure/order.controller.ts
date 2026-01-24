import { Controller, Post, Body } from '@nestjs/common';
import { PlaceOrderUseCase } from '../application/use-cases/place-order.use-case';
import { PlaceOrderCommand } from '../application/commands/place-order.command';

@Controller('orders')
export class OrderController {
  constructor(private readonly placeOrderUseCase: PlaceOrderUseCase) {}

  @Post()
  async create(@Body() body: { orderId: string; items: string[] }) {
    const command: PlaceOrderCommand = {
      orderId: body.orderId,
      items: (body.items || []).map((p) => ({ productId: p, quantity: 1 }))
    };

    const order = await this.placeOrderUseCase.execute(command);
    return {
      id: order.id,
      status: order.status,
      createdAt: order.createdAt
    };
  }
}
