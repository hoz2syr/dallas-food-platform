# Web Frontend (apps/web)

Purpose
-------

This folder contains the frontend application scaffold for the platform. It is an API-first Next.js (App Router) TypeScript project intended to host the web UI in the future. At this stage the repository only includes architecture, minimal configuration, and client abstractions — the UI is intentionally not implemented yet.

How it connects to backend
--------------------------

- The app is API-first: it uses a centralized HTTP client at `src/lib/api/http-client.ts` to communicate with backend services.
- The HTTP client reads the base URL and API key from environment variables (`NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_API_KEY`).

What is included
-----------------

- `src/app/layout.tsx` — minimal root layout placeholder required by Next.js App Router.
- `src/lib/api/http-client.ts` — centralized fetch wrapper that injects `x-api-key`.
- `src/lib/auth/auth.ts` — placeholder auth abstraction (`isAuthenticated`, `getApiKey`).
- `src/lib/config/` — placeholder for future config helpers.
- `src/components/`, `src/types/`, `src/styles/`, `public/` — folders prepared for future UI work.

API client responsibilities
-------------------------

This scaffold includes a typed API client layer under `src/lib/api/` and shared API types under `src/types/api`.

- `src/lib/api/http-client.ts`: low-level fetch wrapper — reads `NEXT_PUBLIC_API_BASE_URL` and injects `x-api-key` from `NEXT_PUBLIC_API_KEY`.
- `src/lib/api/menu-api.ts` and `src/lib/api/order-api.ts`: typed client functions that use `http-client.ts` and throw normalized errors (`src/types/api/error.types.ts`).

Separation from UI
------------------

The API client layer is intentionally separated from UI components and state. UI and pages should import the client functions and types, but none are included in this scaffold.

Cart state abstraction
----------------------

This scaffold now includes a frontend cart state boundary as a pure TypeScript module (no React integration). The cart store lives at `src/lib/cart/cart-store.ts` and exposes functions:

- `addItem(item, quantity?)` — add a product to the cart
- `removeItem(id)` — remove product by id
- `updateQuantity(id, quantity)` — set quantity (throws on negative)
- `clear()` — clear the cart
- `getState()` — returns the current `Cart` snapshot

The cart types are defined under `src/types/cart.types.ts`.

Note: There is no UI integration in this scaffold — the module is prepared for future consumption by UI code.

Running locally
---------------

This is a scaffold only. To develop the frontend further:

1. Install dependencies with `pnpm install` in `apps/web`.
2. Provide environment variables by copying `.env.example` to `.env` and editing values.
3. Run `pnpm dev` from `apps/web` to start the dev server.

Notes
-----

- No UI, pages, or routes are included yet.
- No authentication flows are implemented — `src/lib/auth/auth.ts` is a placeholder.
- The app is intentionally not connected to backend services at this time.
# web (frontend)

This workspace contains the frontend scaffold for the platform. It is intentionally minimal — a foundation for future UI work.

Purpose:

- Provide an API-first Next.js TypeScript app aligned with backend contracts.
- Include a centralized HTTP client and auth/config abstractions.

How it connects to backend APIs:

- The `http-client` in `src/lib/api/http-client.ts` centralizes calls and injects `x-api-key` from `NEXT_PUBLIC_API_KEY`.
- Base URL is controlled via `NEXT_PUBLIC_API_BASE_URL`.

Current state:

- No UI routes, pages, or components are implemented yet.
- No real authentication flows or storage are implemented — `src/lib/auth` contains placeholders.

To run in development (after installing deps with `pnpm install`):

```bash
pnpm dev
```
