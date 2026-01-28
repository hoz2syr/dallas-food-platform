// Converted from Vitest to Jest: use Jest globals
import { Order } from '../../domain/entities/order.entity';
import { OrderStatus } from '../../domain/value-objects/order-status';
import { EmptyOrderItemsError, InvalidOrderStateError } from '../domain/errors/order-domain.error';

describe('Order entity', () => {
  it('placing order with items succeeds', () => {
    const order = new Order('o1', [{ productId: 'p1', quantity: 2 }]);
    const event = order.place();
    expect(order.status).toBe(OrderStatus.PLACED);
    expect(event.orderId).toBe('o1');
  });


  it('placing order with empty items throws EmptyOrderItemsError', () => {
    const order = new Order('o2', []);
    expect(() => order.place()).toThrow('Order must contain at least one item');
  });

  it('cancelling before placed throws InvalidOrderStateError', () => {
    const order = new Order('o3', [{ productId: 'p2', quantity: 1 }]);
    expect(() => order.cancel()).toThrow('Only PLACED orders can be cancelled');
  });
});
