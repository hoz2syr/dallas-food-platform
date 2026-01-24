# services/order

Purpose
-------

The Order Service owns order lifecycle, orchestration, and related domain rules for the platform. This repository entry is a structural scaffold only — no business logic is implemented yet.

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

No business logic implemented yet.

Reference implementation
------------------------

Order Service is the reference implementation for all backend services. New services should use the `services/order` layout and behavior as the canonical blueprint. See the higher-level blueprint for rules and steps: [SERVICE-BLUEPRINT.md](docs/SERVICE-BLUEPRINT.md)
