# Menu service E2E smoke tests

Prerequisites:

- Docker and Docker Compose installed and available on PATH
- A Unix-compatible shell (bash) to run the script

Run the Menu E2E smoke tests:

```bash
chmod +x infra/e2e/run-menu-e2e.sh
infra/e2e/run-menu-e2e.sh
```

What the script does:

- Brings up the Compose stack defined in `infra/docker-compose.yml` (builds if needed)
- Waits until the Menu service responds to a POST /menus
- Runs two checks:
  - POST /menus with a valid payload → expects HTTP 200
  - POST /menus with empty `items` → expects HTTP 400
- Brings the Compose stack down on completion or failure
# Order service smoke tests (E2E)

This folder contains a small smoke test runner for the `order` service. It is intended to be a quick verification that the service and its dependencies start, respond to a health check, and accept a basic `POST /orders` request.

Prerequisites
- Docker Desktop or a Docker Engine that supports `docker compose`.
- A Unix-like shell on Windows (Git Bash, WSL, or similar). The runner is a POSIX `sh` script and is not provided in PowerShell.

Files
- `run-order-e2e.sh` — starts the Compose stack, waits for `GET /health`, runs a couple of POST checks against `/orders`, then tears down the stack.

Quick run
1. Make the script executable (if needed):

```bash
chmod +x infra/e2e/run-order-e2e.sh
```

2. Run the E2E smoke test:

```bash
infra/e2e/run-order-e2e.sh
```

What the script does
- Brings up `infra/docker-compose.yml` (builds images if needed).
- Polls `http://localhost:3000/health` until it's ready (30 attempts).
- Sends a valid `POST /orders` and expects `200 OK`.
- Sends an invalid `POST /orders` (empty items) and expects `400 Bad Request` (verifies domain error → HTTP mapping).
- Brings the compose stack down and exits with non-zero if any step fails.

Troubleshooting
- If `docker` or `docker compose` is not found, ensure Docker Desktop is installed and available in your PATH.
- On Windows, run the script from Git Bash or WSL. Running this exact script in PowerShell is not supported.
- If ports conflict, stop other local services using port `3000` or update `infra/docker-compose.yml` before running.

Manual checks (alternative)

1. Start compose manually:

```bash
docker compose -f infra/docker-compose.yml up --build -d
```

2. Wait for health:

```bash
curl -fS http://localhost:3000/health
```

3. Create an order (expect 200):

```bash
curl -v -X POST http://localhost:3000/orders -H "Content-Type: application/json" -d '{"orderId":"o-e2e-1","items":["item-1"]}'
```

4. Tear down:

```bash
docker compose -f infra/docker-compose.yml down
```

Notes
- This README intentionally documents the existing POSIX script; no PowerShell scripts are included.
