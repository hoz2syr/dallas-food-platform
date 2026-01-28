
// Converted from Vitest to Jest: use Jest globals
import { PlaceOrderUseCase } from '../src/modules/order/application/use-cases/place-order.use-case';
import { OrderRepository } from '../src/modules/domain/repositories/order.repository';
import { PlaceOrderCommand } from '../src/modules/order/application/commands/place-order.command';
import { Order } from '../src/modules/domain/entities/order.entity';

describe('PlaceOrderUseCase', () => {
  let repo: OrderRepository;
  let savedOrder: Order | null = null;

  beforeEach(() => {
    savedOrder = null;
    repo = {
      save: async (order: Order) => { savedOrder = order; },
      findById: async (id: string) => null,
    };
  });

  it('should place order and save it', async () => {
    const useCase = new PlaceOrderUseCase(repo);
    const command: PlaceOrderCommand = {
      orderId: 'o1',
      items: [{ productId: 'p1', quantity: 2 }],
    };
    const order = await useCase.execute(command);
    expect(order.id).toBe('o1');
    expect(order.items.length).toBe(1);
    expect(savedOrder).not.toBeNull();
    expect(savedOrder!.id).toBe('o1');
  });
});
