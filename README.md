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

## System Overview (Arabic)

A new Arabic system overview document was added: `docs/system_overview_ar.md` which contains the high-level conceptual definition and primary personas (العميلية، التشغيلية، الإدارية، اللوجستية، الداعمة).

## Architecture Decisions

See `docs/DECISIONS/0001-architecture.md` for the canonical architecture decision record that describes the hybrid microservices approach, persona requirements, recommended service boundaries, configuration and observability guidance.

## Services

This repository uses a services-first monorepo layout. Each service should include:

- `src/` — implementation
- `src/config/` — configuration helpers that validate env vars
- `src/routes/` or `src/controllers/` — HTTP handlers
- `tests/` — unit and integration tests
- `Dockerfile` — container image build
- `README.md` — per-service documentation and required env variables

New skeleton README files were added for the primary services: order, menu, delivery, payments under `services/`.

## Configuration & Environments

This repository expects services to read configuration explicitly from environment variables. Each service should provide a `getAppConfig()` helper that validates required environment variables and fails-fast on startup if required values are missing.

Required environment variables (per service):

- `PORT` - numeric port the HTTP server listens on
- `DATABASE_URL` - database connection string (Postgres)
- `API_KEY` - API key used to authenticate incoming requests (when applicable)

Local development:

1. Copy `.env.example` to `.env` and edit values as needed.
2. Start services using your preferred approach (local, Docker Compose, or workspace scripts).

Production:

- Provide required environment variables through your deployment platform's secret/config system. Do not check real secrets into the repo.

## How to contribute

Please follow `CONTRIBUTING.md` and the ADRs in `docs/DECISIONS` when proposing changes that affect architecture, service contracts, or shared packages.

---