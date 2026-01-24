export class OrderDomainError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'OrderDomainError';
  }
}

export class InvalidOrderStateError extends OrderDomainError {
  constructor(message?: string) {
    super(message || 'Invalid order state for requested operation');
    this.name = 'InvalidOrderStateError';
  }
}

export class EmptyOrderItemsError extends OrderDomainError {
  constructor(message?: string) {
    super(message || 'Order must contain at least one item');
    this.name = 'EmptyOrderItemsError';
  }
}
