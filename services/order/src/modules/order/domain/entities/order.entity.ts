import { OrderStatus } from '../value-objects/order-status';
import { OrderPlacedEvent } from '../events/order-placed.event';
import { EmptyOrderItemsError, InvalidOrderStateError } from '../errors/order-domain.error';

export interface OrderItem {
  productId: string;
  quantity: number;
}

export class Order {
  readonly id: string;
  private _status: OrderStatus;
  private _items: OrderItem[];
  readonly createdAt: Date;

  constructor(id: string, items: OrderItem[]) {
    if (!id || id.trim() === '') throw new Error('Order id is required');
    if (!Array.isArray(items)) throw new Error('items must be an array');
    this.id = id;
    this._items = items.slice();
    this._status = OrderStatus.CREATED;
    this.createdAt = new Date();
  }

  get status() {
    return this._status;
  }

  get items() {
    return this._items.slice();
  }

  place(): OrderPlacedEvent {
    if (this._status !== OrderStatus.CREATED) {
      throw new InvalidOrderStateError('Only orders in CREATED state can be placed');
    }
    if (this._items.length === 0) {
      throw new EmptyOrderItemsError();
    }
    this._status = OrderStatus.PLACED;
    return new OrderPlacedEvent(this.id);
  }

  cancel(): void {
    if (this._status === OrderStatus.CANCELLED) return;
    if (this._status !== OrderStatus.PLACED) {
      throw new InvalidOrderStateError('Only PLACED orders can be cancelled');
    }
    this._status = OrderStatus.CANCELLED;
  }
}
