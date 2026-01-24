import { describe, it, expect } from 'vitest';
import { PlaceOrderUseCase } from '../application/use-cases/place-order.use-case';
import { PlaceOrderCommand } from '../application/commands/place-order.command';
import { EmptyOrderItemsError } from '../domain/errors/order-domain.error';

describe('PlaceOrderUseCase', () => {
  it('execute() returns an Order when valid command provided', () => {
    const useCase = new PlaceOrderUseCase();
    const command: PlaceOrderCommand = {
      orderId: 'u1',
      items: [{ productId: 'p1', quantity: 1 }]
    };
    const result = useCase.execute(command);
    expect(result).toBeDefined();
    expect(result.id).toBe('u1');
  });

  it('execute() propagates domain errors', () => {
    const useCase = new PlaceOrderUseCase();
    const command: PlaceOrderCommand = {
      orderId: 'u2',
      items: []
    };
    expect(() => useCase.execute(command)).toThrow(EmptyOrderItemsError);
  });
});
