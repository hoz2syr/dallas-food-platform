# dallas-food-platform

Vision: Build a resilient, extensible food ordering platform for Dallas.

- Core hybrid architecture that balances central governance and service autonomy.
- Enable fast iteration for services (menu, orders, delivery, payments).
- Prioritize observability, security, and developer experience.

## Repository Structure Overview

- `services/`: Independent service folders, each owning domain logic (e.g., `menu`, `order`, `delivery`, `payments`). Services are small, independently deployable, and follow the platform ADRs.
- `packages/`: Shared packages used by multiple services (utilities, types, shared libraries). Start small and extract common code here to avoid duplication.
- `infra/`, `scripts/`, `docs/`: Infrastructure definitions, operational scripts, and architecture/ADR documentation respectively.

Follow ADRs in `docs/DECISIONS` for architecture and technology guidance.

## API Key Authentication

Services in this platform require a simple API key for request authentication.

- Header: `x-api-key`
- Environment variable: `API_KEY` (must be set in the service environment)

Example curl (replace <key> with your API key):

```bash
curl -X POST http://localhost:3001/menus \
	-H "x-api-key: <key>" \
	-H "Content-Type: application/json" \
	-d '{"menuId":"m1","name":"My Menu","items":[{"id":"i1","name":"Item","price":1}]}'
```

Unauthorized requests receive HTTP 401 with body:

```json
{ "error": "UNAUTHORIZED", "message": "Invalid API key" }
```
