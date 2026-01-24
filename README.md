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