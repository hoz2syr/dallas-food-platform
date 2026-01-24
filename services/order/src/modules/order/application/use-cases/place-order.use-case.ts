import { PlaceOrderCommand } from '../commands/place-order.command';
import { Order } from '../../domain/entities/order.entity';

export class PlaceOrderUseCase {
  execute(command: PlaceOrderCommand): Order {
    const order = new Order(command.orderId, command.items as any);
    order.place();
    return order;
  }
}
