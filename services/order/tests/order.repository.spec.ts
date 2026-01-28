import { OrderRepository } from '../src/modules/domain/repositories/order.repository';
import { Order } from '../src/modules/domain/entities/order.entity';

describe('OrderRepository Interface', () => {
  it('should define findById and save', () => {
    const repo: OrderRepository = {
      async findById(id: string) { return null; },
      async save(order: Order) { return; }
    };
    expect(typeof repo.findById).toBe('function');
    expect(typeof repo.save).toBe('function');
  });
});
