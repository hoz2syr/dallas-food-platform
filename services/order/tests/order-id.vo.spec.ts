import { OrderId } from '../src/modules/order/domain/value-objects/order-id.vo';

describe('OrderId Value Object', () => {
  it('should create an OrderId', () => {
    const id = new OrderId('abc123');
    expect(id.value).toBe('abc123');
  });
  it('should throw if empty', () => {
    expect(() => new OrderId('')).toThrow();
  });
});
