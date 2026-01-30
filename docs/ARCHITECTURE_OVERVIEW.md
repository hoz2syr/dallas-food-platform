---
# Architecture Overview

## Hybrid Core + Services Model

The Dallas Food Platform is built on a "Hybrid Core + Services" architecture. This approach combines a small, centralized core for shared concerns (authentication, observability, platform policies) with a set of independent, focused microservices (order, menu, delivery, payments, etc.).

**Key Principles:**
- Centralized governance for security, logging, monitoring, and CI/CD
- Autonomous services with clear API boundaries and independent release cycles
- Prefer asynchronous events for eventual consistency; use synchronous APIs for critical flows
- Each service owns its data and domain logic

## Technology Stack

- **Language:** TypeScript (Node.js LTS)
- **Backend Framework:** NestJS
- **Frontend:** Next.js (App Router)
- **Package Manager:** pnpm
- **API Style:** REST-first, event-ready
- **Infrastructure:** Docker, Docker Compose, Kubernetes-ready

## Service Design

- Services are small, focused, and independently deployable
- Each service follows Clean Architecture (domain, application, infrastructure layers)
- Shared libraries and types are extracted to `packages/`
- Infrastructure and deployment scripts are in `infra/` (including `infra/scripts/`)

## Communication

- REST APIs for synchronous flows (e.g., order placement, menu queries)
- Event-driven integration for cross-service workflows (e.g., order status updates, notifications)

## See Also

- `docs/REFERENCE-ARCHITECTURE.md` — Clean Architecture and service layering
- `docs/SERVICE-BLUEPRINT.md` — service structure and best practices

---