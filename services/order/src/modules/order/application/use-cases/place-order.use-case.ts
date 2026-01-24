import { PlaceOrderCommand } from '../commands/place-order.command';
import { Order } from '../../domain/entities/order.entity';
import { OrderRepository } from '../../domain/repositories/order.repository';

export class PlaceOrderUseCase {
  private readonly orderRepository: OrderRepository;

  constructor(orderRepository: OrderRepository) {
    this.orderRepository = orderRepository;
  }

  async execute(command: PlaceOrderCommand): Promise<Order> {
    const order = new Order(command.orderId, command.items as any);
    order.place();
    await this.orderRepository.save(order);
    return order;
  }
}
