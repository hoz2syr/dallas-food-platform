Order Application Layer
=======================

The application layer implements use cases (application services) that orchestrate domain objects to fulfill business scenarios. It depends on the domain model but contains no framework or persistence code.

This folder contains commands and use-cases. Use-cases should be plain TypeScript classes that accept input (commands), manipulate domain aggregates, and return results or domain events.


## Example

```typescript
// Example use-case (pseudo-code)
import { PlaceOrderUseCase } from './use-cases/place-order.usecase';

const useCase = new PlaceOrderUseCase(/* dependencies */);
const result = useCase.execute({
	customerId: 'customer-1',
	items: [{ itemId: 'item-1', qty: 2 }],
});
```

See tests for more usage examples.
