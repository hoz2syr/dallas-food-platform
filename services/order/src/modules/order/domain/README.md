# Order Domain Layer

This folder contains the core business logic and rules for the Order domain.

## Structure
- `entities/`: Aggregate roots and entities (e.g., Order)
- `value-objects/`: Value objects (e.g., OrderStatus, OrderId)
- `errors/`: Domain-specific errors
- `repositories/`: Domain repository interfaces

## Principles
- No dependencies on frameworks or infrastructure
- Pure TypeScript, testable and isolated
- All business invariants and rules enforced here

## Usage Example

```
import { Order } from './entities/order.entity';
import { OrderStatus } from './value-objects/order-status';

const order = new Order('order-123', [{ itemId: 'item-1', qty: 2 }]);
order.place();
order.cancel();
```

See tests for more usage examples.
