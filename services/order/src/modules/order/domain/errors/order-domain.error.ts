// Order domain error base class
export class OrderDomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OrderDomainError';
  }
}

export class EmptyOrderItemsError extends OrderDomainError {
  constructor() {
    super('Order must contain at least one item');
    this.name = 'EmptyOrderItemsError';
  }
}

export class InvalidOrderStateError extends OrderDomainError {
  constructor(message = 'Invalid order state') {
    super(message);
    this.name = 'InvalidOrderStateError';
  }
}
