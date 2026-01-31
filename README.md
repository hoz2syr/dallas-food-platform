---
# Dallas Food Platform

**Vision:** Build a resilient, extensible, and modern food ordering platform for Dallas and beyond.

## Key Principles

- Hybrid core + microservices architecture for scalability and autonomy
- Clean Architecture: clear separation of domain, application, and infrastructure layers
- API-first, event-ready, and cloud-native by design
- Developer experience, observability, and security are first-class concerns

## Repository Structure

```
```

```
services/        # Independent backend services (order, menu, delivery, payments, etc.)
packages/        # Shared libraries, types, and utilities
apps/            # Frontend and dashboard applications (web, admin-dashboard, customer-app, kitchen-display)
infra/           # Infrastructure as code, Docker, Kubernetes, CI/CD
   └── scripts/   # Automation and operational scripts (moved from root scripts/)
docs/            # Architecture, ADRs, API contracts, and system documentation
```

Other files moved for clarity:
- response.txt, PROJECT-REVIEW-REPORT.md, TODO.md → docs/

Each service follows a standard layout:

- `src/` — implementation (domain, application, infrastructure)
- `tests/` — unit and integration tests
- `db/` — migrations and schema (if needed)
- `Dockerfile` — container build
- `README.md` — service documentation

## Architecture Overview

This platform uses a "Hybrid Core + Services" model:

- **Core**: Shared authentication, observability, and platform-wide policies
- **Services**: Small, focused, independently deployable microservices (order, menu, delivery, payments, etc.)
- **Communication**: REST APIs for synchronous flows, events for async integration
- **Frontend**: Next.js (App Router), modern UI, API-first

See `docs/ARCHITECTURE_OVERVIEW.md` and `docs/REFERENCE-ARCHITECTURE.md` for details.

## Getting Started

1. Copy `.env.example` to `.env` and configure environment variables

Quickstart (Windows)

1. Enable Corepack and prepare the pinned pnpm version:

```powershell
corepack enable
corepack prepare pnpm@9.15.5 --activate
```

2. Install workspace dependencies:

```powershell
pnpm install -w
```

3. Start services locally with Docker Compose (unified example):

```powershell
docker compose -f infra/docker-compose.yml up --build
```

4. Access frontend apps at the configured ports

## Configuration & Environments

All services read configuration from environment variables. Each service must validate required variables at startup and fail fast if missing.

**Required variables (per service):**
- `PORT` — HTTP server port
- `DATABASE_URL` — Postgres connection string
- `API_KEY` — API key for authentication (if applicable)

Tip: add a reference table (or file in `docs/`) that lists required env vars per service (Postgres, Redis, RabbitMQ, Stripe, Google Maps, etc.) with example values.

**Production:**
- Use your deployment platform's secret/config system. Never commit real secrets.

## Authentication & Security

All backend APIs are now protected by JWT authentication. You must obtain a valid JWT token from the Auth Service (`/api/auth/login` or `/api/auth/signup`) and include it in the `Authorization: Bearer <token>` header for all requests to protected endpoints.

- **Auth Service**: Provides `/signup`, `/login`, and `/me` endpoints for user management and token issuance.
- **Public endpoints**: Some endpoints (e.g., `/payments/process`, `/payments/refund`) may be marked as public for demo/testing, but all other APIs require authentication.
- **How to use:**
  1. Register or login via the Auth Service to get a JWT.
  2. Add the token to your API requests:
     ```http
     Authorization: Bearer <your-jwt-token>
     ```
  3. If you receive a 401 error, your token is missing, expired, or invalid.

See each service's README for more details on authentication requirements and public endpoints.

## Contribution & Development

- Follow ADRs in `docs/DECISIONS` for architecture and technology guidance
- See `CONTRIBUTING.md` for contribution process
- Write clear code comments and keep documentation up to date (English only)

## Documentation

- `docs/DOCS-AUDIT.md` — تقرير تدقيق التوثيق (ملاحظات سريعة وخطة تحسين)
- `docs/ARCHITECTURE_OVERVIEW.md` — high-level architecture
- `docs/REFERENCE-ARCHITECTURE.md` — Clean Architecture and service layering
- `docs/API-CONTRACTS.md` — API contracts and examples
- `docs/SERVICE-BLUEPRINT.md` — service structure and best practices

## License

MIT License — see LICENSE file
---
   ```bash
   cp .env.example .env
   # ثم عدّل القيم حسب الحاجة
   ```
1. (Windows) تهيئة Corepack وpnpm:
   ```powershell
   corepack enable
   corepack prepare pnpm@9.15.5 --activate
   ```
2. ثبّت التبعيات:
   ```bash
   pnpm install -w
   ```
3. شغّل جميع الخدمات (أو شغّل خدمات محددة حسب الحاجة):
   ```bash
   docker compose -f infra/docker-compose.yml up --build
   # مثال لتشغيل خدمة واحدة: docker compose -f infra/docker-compose.yml up --build postgres menu
   ```
4. راقب السجلات:
   ```bash
   docker compose logs -f
   ```

- ملاحظة Windows: قد تواجه مشاكل طول مسار عند حذف `node_modules`. استخدم `npx rimraf` أو شغّل داخل WSL إذا ظهرت أخطاء.
- ضع جدول متغيرات البيئة لكل خدمة في `docs/` أو ملف مرجعي داخل `docs/`.

Please follow `CONTRIBUTING.md` and the ADRs in `docs/DECISIONS` when proposing changes that affect architecture, service contracts, or shared packages.

---
---