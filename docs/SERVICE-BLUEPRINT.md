# Service Blueprint — Standard for backend services

Purpose
-------

This document defines the standard folder layout, layer responsibilities, and guardrails for creating new backend services based on the Order Service reference implementation.

Standard folder structure
-------------------------

Every service SHOULD follow this structure under `services/<name>`:

- `src/modules/<name>/domain/` — domain entities, value objects, domain events, domain errors, and repository interfaces.
- `src/modules/<name>/application/` — commands, DTOs, and use-cases implementing business workflows. Use-cases depend on domain abstractions (interfaces) only.
- `src/modules/<name>/infrastructure/` — controllers/adapters, repository implementations, DI module, exception filters, and any framework-specific wiring.
- `db/` — migrations and SQL schema files where applicable.
- `__tests__/` or `tests/` — unit tests for domain and application logic.
- `Dockerfile`, `.dockerignore`, and service-level `package.json` for independent build and containerization.

Layer responsibilities and rules
------------------------------

- Domain
  - Must contain pure business logic and models.
  - Must NOT import any framework or external infrastructure code.
  - Allowed: entities, value objects, domain errors, domain events, repository interfaces.
  - Not allowed: database clients, HTTP frameworks, DI containers.

- Application
  - Orchestrates use-cases and enforces application policies.
  - Depends only on domain interfaces and pure DTOs.
  - Allowed: use-cases, command objects, application-level validation, mapping between domain and transport.
  - Not allowed: direct database queries or HTTP framework types.

- Infrastructure
  - Implements adapters that satisfy domain interfaces (repositories, external API clients) and provides controllers for transport.
  - Responsible for wiring dependencies into the module/container and translating domain errors into transport-level responses.
  - Allowed: NestJS controllers, repository implementations (PG client), DI providers, exception filters, SDK clients.
  - Not allowed: business rule implementations — those belong in `domain/`.

Required steps to create a new service from the Order blueprint
-------------------------------------------------------------

1. Create `services/<new-service>` and copy the `services/order` structure as a starting point.
2. Replace module and symbol names (`order`) with the new service name.
3. Implement domain entities and interfaces specific to the new service.
4. Implement application use-cases that depend on domain interfaces.
5. Provide infrastructure adapters (in-memory + production-ready persistence) that implement domain repository interfaces.
6. Add unit tests for `domain` and `application` layers.
7. Add `db/migrations` only if the service requires a schema; keep migrations under service `db/` folder.
8. Do not introduce framework-specific logic into `domain` or `application` layers; prefer constructor injection and interfaces.

Governance
----------

- All new services MUST include a README that declares compliance with this blueprint.
- Any intentional deviation from this blueprint requires an ADR describing the rationale and trade-offs.
