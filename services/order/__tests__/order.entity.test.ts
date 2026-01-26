
import { describe, it, expect } from 'vitest';
import { Order } from '../src/modules/domain/entities/order.entity';
import { OrderStatus } from '../src/modules/domain/value-objects/order-status';
import { EmptyOrderItemsError, InvalidOrderStateError } from '../src/modules/domain/errors/order-domain.error';

describe('Order Entity', () => {
  it('should create order with valid id and items', () => {
    const order = new Order('o1', [{ productId: 'p1', quantity: 2 }]);
    expect(order.id).toBe('o1');
    expect(order.items.length).toBe(1);
    expect(order.status).toBe(OrderStatus.CREATED);
  });

  it('should throw if id is empty', () => {
    expect(() => new Order('', [{ productId: 'p1', quantity: 1 }])).toThrow();
  });

  it('should throw if items is not array', () => {
    // @ts-expect-error
    expect(() => new Order('o1', null)).toThrow();
  });

  it('should place order if valid', () => {
    const order = new Order('o1', [{ productId: 'p1', quantity: 1 }]);
    order.place();
    expect(order.status).toBe(OrderStatus.PLACED);
  });

  it('should throw EmptyOrderItemsError if placing with no items', () => {
    const order = new Order('o1', []);
    expect(() => order.place()).toThrow(EmptyOrderItemsError);
  });

  it('should throw InvalidOrderStateError if placing twice', () => {
    const order = new Order('o1', [{ productId: 'p1', quantity: 1 }]);
    order.place();
    expect(() => order.place()).toThrow(InvalidOrderStateError);
  });

  it('should cancel placed order', () => {
    const order = new Order('o1', [{ productId: 'p1', quantity: 1 }]);
    order.place();
    order.cancel();
    expect(order.status).toBe(OrderStatus.CANCELLED);
  });

  it('should throw InvalidOrderStateError if cancel before placing', () => {
    const order = new Order('o1', [{ productId: 'p1', quantity: 1 }]);
    expect(() => order.cancel()).toThrow(InvalidOrderStateError);
  });
});
