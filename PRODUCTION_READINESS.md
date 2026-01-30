# Production Readiness Guide — Dallas Food Platform

This guide provides best practices and step-by-step instructions for deploying the Dallas Food Platform to a production environment.

---

## 1. Prerequisites

- **Cloud/VPS server** (Ubuntu 22.04 LTS or similar recommended)
- **Docker & Docker Compose** installed
- **Domain name** (optional, for public access)
- **Secure SSH access**

## 2. Prepare the Server

- Update the OS and install security patches:
  ```bash
  sudo apt update && sudo apt upgrade -y
  ```
- Install Docker & Docker Compose (see official docs)
- Create a non-root user for deployment

## 3. Secure the Environment

- Set strong, unique passwords for all services (DB, Redis, RabbitMQ, etc.)
- Store secrets in environment variables or a secret manager (never in code)
- Restrict open ports using a firewall (allow only necessary ports: 80, 443, 8080, etc.)
- Enable HTTPS (see below)

## 4. Configure Environment Variables

- Copy `.env.example` to `.env` and set all production values:
  - Database credentials
  - API keys
  - JWT/secret keys
  - Email/SMS providers
- Never use default or development secrets in production

## 5. Build & Deploy

- Clone the repository to the server
- Install pnpm and dependencies (if needed for build)
- Build and start all services:
  ```bash
  docker compose -f infra/docker-compose.yml up --build -d
  ```
- Check logs and health endpoints to verify all services are running

## 6. Enable HTTPS

- Use a reverse proxy (Nginx, Caddy, Traefik) to terminate SSL
- Obtain a free SSL certificate (e.g., Let's Encrypt)
- Forward traffic from 80/443 to the API gateway (nginx container)
- Example Nginx config and SSL setup can be provided if needed

## 7. Database & Data Management

- Schedule regular automated backups for Postgres
- Enable database monitoring and alerts
- Apply migrations carefully and test before applying to production

## 8. Monitoring & Logging

- Integrate centralized logging (ELK, Loki, etc.)
- Set up monitoring and alerting (Prometheus, Grafana, Sentry, etc.)
- Monitor resource usage (CPU, RAM, disk)

## 9. Security Best Practices

- Change all default credentials
- Enable CORS and rate limiting on all APIs
- Keep all dependencies and Docker images up to date
- Regularly audit for vulnerabilities (npm audit, Snyk, etc.)
- Limit user permissions and use RBAC

## 10. Performance Tuning

- Use production builds for all frontend apps
- Enable caching where possible (Redis, CDN)
- Scale services horizontally if needed (Docker Swarm, Kubernetes)
- Optimize database indexes and queries

## 11. Disaster Recovery

- Test backup and restore procedures regularly
- Document recovery steps for major failures
- Keep offsite backups if possible

## 12. Maintenance & Updates

- Use CI/CD pipelines for safe, repeatable deployments
- Apply security patches promptly
- Monitor for and resolve errors quickly

---

For more details, see SECURITY.md and the documentation in the `docs/` folder.
If you need a sample Nginx SSL config or CI/CD pipeline, contact the maintainers.
