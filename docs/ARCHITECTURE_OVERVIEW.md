Overview: Hybrid core + services

This project follows a "Hybrid core + services" architecture. A small, opinionated core provides shared concerns like authentication, observability, and platform-wide policies. Independent services (menu, order, delivery, payments) implement domain logic and own their data stores where appropriate. The hybrid model balances centralized governance and common tooling with autonomy for fast, independently deployable services.

Key points:
- Core responsibilities: auth, logging, monitoring, CI/CD conventions, and shared libraries.
- Services: small bounded contexts with clear APIs and independent release cycles.
- Communication: prefer asynchronous events for eventual consistency; sync APIs for critical paths.

See original architecture document.

## Technology Baseline

- Language: TypeScript
- Runtime: Node.js (LTS)
- Backend framework direction: NestJS
- Package manager: pnpm
- API style: REST-first, event-ready
- Infra baseline: Docker (local-first)