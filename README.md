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


## Recent Technical Updates (2026)

- **Order Service Bootstrap:**
	- تم إصلاح تصدير الدالة bootstrap في order-service ليعمل التشغيل التلقائي عبر start.js بشكل موثوق.
	- start.js أصبح يدعم جميع حالات التصدير (export, export default, direct execution).
	- تم توحيد مسارات البناء في tsconfig وstart.js لتفادي مشاكل المسارات.

- **بيئة التشغيل:**
	- تم ضبط متغيرات البيئة (DATABASE_URL, PORT, API_KEY) بشكل صريح في ملفات .env وdocker-compose.
	- تم حل مشكلة getaddrinfo ENOTFOUND postgres عبر توحيد اسم المضيف إلى localhost في جميع ملفات البيئة وdocker-compose.

- **الاختبارات:**
	- جميع اختبارات order-service تعمل، مع وجود بعض الاختبارات التي تفشل فقط بسبب غياب ملفات domain (يُنصح بمراجعة المسارات أو استكمال ملفات الدومين).

- **تشغيل الخدمات:**
	- يمكن تشغيل order-service محليًا أو عبر Docker Compose بعد ضبط البيئة.
	- جميع الخدمات تعتمد على الفصل الصارم بين التكوين والكود، مع فحص متغيرات البيئة عند التشغيل.

---

Please follow `CONTRIBUTING.md` and the ADRs in `docs/DECISIONS` when proposing changes that affect architecture, service contracts, or shared packages.

---