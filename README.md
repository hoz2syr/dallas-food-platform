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

Follow ADRs in `docs/DECISIONS` for architecture and technology guidance.

## Configuration & Environments

This repository expects services to read configuration explicitly from environment variables. Each service exposes a small `getAppConfig()` helper under `src/config/app.config.ts` that validates required values and throws early if any required variable is missing.

Required environment variables (per service):

- `PORT` - numeric port the HTTP server listens on
- `DATABASE_URL` - database connection string (Postgres)
- `API_KEY` - API key used to authenticate incoming requests

Local development:

1. Copy `.env.example` to `.env` and edit values as needed.
2. Start services using your preferred approach (local, Docker Compose).

Production:

- Provide the required environment variables through your deployment platform's secret/config system. Do not check real secrets into the repo.

