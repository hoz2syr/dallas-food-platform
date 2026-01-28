// Converted from Vitest to Jest: use Jest globals
import { PlaceOrderUseCase } from '../application/use-cases/place-order.use-case';
import { PlaceOrderCommand } from '../application/commands/place-order.command';
import { EmptyOrderItemsError } from '../../domain/errors/order-domain.error';
import { OrderRepository } from '../../domain/repositories/order.repository';

describe('PlaceOrderUseCase', () => {
  let mockRepo: OrderRepository;
  beforeEach(() => {
    mockRepo = {
      save: jest.fn(async () => {}),
      findById: jest.fn(async () => null)
    };
  });

  it('execute() returns an Order when valid command provided', async () => {
    const useCase = new PlaceOrderUseCase(mockRepo);
    const command: PlaceOrderCommand = {
      orderId: 'u1',
      items: [{ productId: 'p1', quantity: 1 }]
    };
    const result = await useCase.execute(command);
    expect(result).toBeDefined();
    expect(result.id).toBe('u1');
  });

  it('execute() propagates domain errors', async () => {
    const useCase = new PlaceOrderUseCase(mockRepo);
    const command: PlaceOrderCommand = {
      orderId: 'u2',
      items: []
    };
    await expect(useCase.execute(command)).rejects.toThrow(EmptyOrderItemsError);
  });
});
