# Getting Started — Dallas Food Platform

This guide will help you set up, configure, and run the Dallas Food Platform locally using Docker Compose. It covers all prerequisites, environment setup, service access, and troubleshooting tips.

---

## 1. Prerequisites

- **Node.js** (v18 or higher)
- **Docker** & **Docker Compose**
- **pnpm** (v9+)
- **Git** (for cloning the repository)

## 2. Clone the Repository

```bash
git clone <your-repo-url>
cd dallas-food-platform
```

## 3. Environment Configuration

- Copy the example environment file and edit as needed:
  ```bash
  cp .env.example .env
  # Edit .env and set all required variables (API keys, DB credentials, etc.)
  ```
- **Important:** Never commit your real `.env` file to version control.

## 4. Install pnpm (if not already installed)

```bash
npm install -g pnpm@9.15.5
```

## 5. Install Project Dependencies

```bash
pnpm install -w
```

## 6. Build & Run All Services

```bash
docker compose -f infra/docker-compose.yml up --build
```

- This will build and start all backend services, frontend apps, and infrastructure (Postgres, Redis, RabbitMQ, Nginx).
- The first build may take several minutes (downloads images, installs dependencies).

## 7. Accessing the Platform

- **API Gateway (Nginx):** http://localhost:8080
- **Web App:** http://localhost:3002
- **Admin Dashboard:** http://localhost:3005
- **Customer App:** http://localhost:3006
- **Kitchen Display:** http://localhost:3007
- **Postgres:** localhost:5432 (default user/pass in .env)
- **RabbitMQ UI:** http://localhost:15672 (default user/pass in .env)

> Ports may be changed in `infra/docker-compose.yml` if needed.

## 8. Service Health & Logs

- Check logs for all services:
  ```bash
  docker compose logs -f
  ```
- To check a specific service:
  ```bash
  docker compose logs -f <service-name>
  # Example: docker compose logs -f menu-service
  ```
- Health endpoints (for most services):
  - http://localhost:<port>/health

## 9. Common Issues & Troubleshooting

- **Port already in use:** Stop any conflicting services or change the port in docker-compose.yml.
- **Environment variable errors:** Ensure `.env` is complete and correct.
- **Database connection issues:** Make sure Postgres is running and credentials match.
- **Docker build fails:** Try `docker compose down -v` then rebuild.
- **Performance:** First build is slow; subsequent builds are faster due to caching.

# Getting Started — Dallas Food Platform

This guide will help you set up, configure, and run the Dallas Food Platform locally using Docker Compose. It covers all prerequisites, environment setup, service access, and troubleshooting tips.

---

## 1. Prerequisites

- **Node.js** (v18 or higher)
- **Docker** & **Docker Compose**
- **pnpm** (v9+)
- **Git** (for cloning the repository)

## 2. Clone the Repository

```bash
git clone <your-repo-url>
cd dallas-food-platform
```

## 3. Environment Configuration

- Copy the example environment file and edit as needed:

  ```bash
  cp .env.example .env
  # Edit .env and set all required variables (API keys, DB credentials, etc.)
  ```

- **Important:** Never commit your real `.env` file to version control.

## 4. Install pnpm (if not already installed)

```bash
npm install -g pnpm@9.15.5
```

## 5. Install Project Dependencies

```bash
pnpm install -w
```

## 6. Build & Run All Services

```bash
docker compose -f infra/docker-compose.yml up --build
```

- This will build and start all backend services, frontend apps, and infrastructure (Postgres, Redis, RabbitMQ, Nginx).
- The first build may take several minutes (downloads images, installs dependencies).

## 7. Accessing the Platform

- **API Gateway (Nginx):** http://localhost:8080
- **Web App:** http://localhost:3002
- **Admin Dashboard:** http://localhost:3005
- **Customer App:** http://localhost:3006
- **Kitchen Display:** http://localhost:3007
- **Postgres:** localhost:5432 (default user/pass in .env)
- **RabbitMQ UI:** http://localhost:15672 (default user/pass in .env)

> Ports may be changed in `infra/docker-compose.yml` if needed.

## 8. Service Health & Logs

- Check logs for all services:

  ```bash
  docker compose logs -f
  ```

- To check a specific service:

  ```bash
  docker compose logs -f <service-name>
  # Example: docker compose logs -f menu-service
  ```

- Health endpoints (for most services):
  - http://localhost:<port>/health

## 9. Common Issues & Troubleshooting

- **Port already in use:** Stop any conflicting services or change the port in docker-compose.yml.
- **Environment variable errors:** Ensure `.env` is complete and correct.
- **Database connection issues:** Make sure Postgres is running and credentials match.
- **Docker build fails:** Try `docker compose down -v` then rebuild.
- **Performance:** First build is slow; subsequent builds are faster due to caching.

## 10. Stopping & Cleaning Up

- To stop all services:

  ```bash
  docker compose down
  ```

- To remove all containers, networks, and volumes:

  ```bash
  docker compose down -v
  ```

## 11. Additional Resources

- **Architecture:** docs/ARCHITECTURE_OVERVIEW.md
- **API Contracts:** docs/API-CONTRACTS.md
- **Service Blueprints:** docs/SERVICE-BLUEPRINT.md
- **Decisions & ADRs:** docs/DECISIONS/
- **Contribution Guide:** CONTRIBUTING.md
- **Automation Scripts:** infra/scripts/ (all operational scripts are now here)

---

For any issues, please check the documentation or contact the maintainers.
