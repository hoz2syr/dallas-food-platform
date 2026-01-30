# services/order

Purpose
-------


The Order Service owns order lifecycle, orchestration, and related domain rules for the platform. This service now includes core business logic, domain-driven design, and testable modules.

Clean Architecture
------------------

This service follows a layered approach (Clean Architecture):

- `domain/`: core domain models and business rules.
- `application/`: use cases, application services, and orchestrations.
- `infrastructure/`: adapters, persistence, and external integration wiring.

Project layout (created):

- `src/modules/order/domain/`
- `src/modules/order/application/`
- `src/modules/order/infrastructure/`


## Usage Example

```typescript
import { Order } from './src/modules/order/domain/entities/order.entity';

const order = new Order('order-123', [{ itemId: 'item-1', qty: 2 }]);
order.place();
order.cancel();
```

See [domain/README.md](src/modules/order/domain/README.md) for more details and usage examples.

## Environment Variables

Copy `.env.example` to `.env` and fill in the required values:

- API_KEY
- PORT

## Build & Run

```bash
pnpm install
pnpm run build
pnpm run start
```

Or using Docker:

```bash
docker build -t order-service .
docker run --env-file .env order-service
```

## Troubleshooting
- Ensure all environment variables are set.
- If you encounter build issues, clean the cache or delete node_modules and reinstall.


Reference implementation
------------------------

Order Service is the reference implementation for all backend services. New services should use the `services/order` layout and behavior as the canonical blueprint. See the higher-level blueprint for rules and steps: [SERVICE-BLUEPRINT.md](../../docs/SERVICE-BLUEPRINT.md)
