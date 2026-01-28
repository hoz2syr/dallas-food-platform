import { Order } from '../src/modules/domain/entities/order.entity';

describe('Order Entity', () => {
  it('should create an order', () => {
    const order = new Order('1', [{ productId: 'p1', quantity: 2 }]);
    expect(order.id).toBe('1');
    expect(order.status).toBe('CREATED');
  });
});
