# API Gateway

Central API Gateway for Restaurant AR Platform

---

## 🚀 Features

- ✅ JWT Authentication & RBAC
- ✅ Service Discovery & Proxying
- ✅ Rate Limiting & Circuit Breaker
- ✅ Request/Response Transformation
- ✅ Logging & Metrics
- ✅ Health Checks & Metrics

---

## 🛠️ Getting Started

1. **Clone the repo & enter directory**
   ```bash
   git clone <repo-url>
   cd services/api-gateway
   ```
2. **Copy environment variables template**
   ```bash
   cp .env.example .env
   # ثم عدّل القيم حسب بيئتك
   ```
3. **Install dependencies**
   ```bash
   npm install
   ```
4. **Run in development**
   ```bash
   npm run dev
   ```
5. **Build for production**
   ```bash
   npm run build
   npm start
   ```

---

## 📁 Project Structure

```
src/
  config/
  middleware/
  services/
  routes/
  utils/
  types/
  index.ts
  server.ts
tests/
.env.example
Dockerfile
docker-compose.yml
package.json
tsconfig.json
README.md
```

---

## ⚙️ Example .env

```
PORT=8080
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
ORDER_SERVICE_URL=http://localhost:3001
MENU_SERVICE_URL=http://localhost:3002
DELIVERY_SERVICE_URL=http://localhost:3003
PAYMENT_SERVICE_URL=http://localhost:3004
REDIS_URL=redis://localhost:6379
CORS_ORIGIN=http://localhost:3000
```

---

## 🛡️ Middleware Overview

### Rate Limiting

Requests are rate-limited using Redis and `express-rate-limit`. Settings are controlled via environment variables:

```
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
REDIS_URL=redis://localhost:6379
```

You can customize the window and max requests per IP. See `src/middleware/rateLimit.middleware.ts` for implementation.

### CORS

CORS is enabled and configured via:

```
CORS_ORIGIN=http://localhost:3000
```

See `src/middleware/cors.middleware.ts` for details.

### Input Validation

All sensitive endpoints (e.g., auth) use input validation with Joi schemas. Example:

```typescript
import Joi from 'joi';
import { validate } from '../utils/validators';

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

router.post('/login', (req, res) => {
  const { email, password } = validate(loginSchema, req.body);
  // ...
});
```

See `src/utils/validators.ts` and `src/routes/auth.routes.ts` for usage.

---

## 🧑‍💻 Usage Examples

### Health Check

```http
GET /health
Response: { "status": "ok" }
```

### Auth

```http
POST /api/v1/auth/login
Body: { "email": "user@example.com", "password": "pass" }
Response: { "accessToken": "...", "refreshToken": "..." }
```

### Orders

```http
GET /api/v1/orders
Authorization: Bearer <token>
Response: [ { ...order } ]
```

### Menu (Public)

```http
GET /api/v1/menu/items
Response: [ { ...item } ]
```

---

## 🧪 Testing

- Run all tests:
  ```bash
  npm test
  ```

---

## 🐳 Docker

- Build:
  ```bash
  docker build -t api-gateway:latest .
  ```
- Run:
  ```bash
  docker run -p 8080:8080 --env-file .env api-gateway:latest
  ```
- Compose:
  ```bash
  docker-compose up -d api-gateway
  ```

---

## 📚 Documentation

- See `/docs` for architecture, API contracts, and more details.

---

## 📞 Support

For issues, open a GitHub issue or contact the team.

---

## License

MIT

---

## Recent Technical Updates (2026)

- **TypeScript Middleware Fixes:**
  - All custom middlewares (logging, correlation, rate limiting) now use explicit type signatures compatible with Express and TypeScript, preventing runtime and compile errors.
  - `RequestWithUser` interface now extends Express `Request` for type safety.
- **Dependency Updates:**
  - Upgraded `supertest`, `superagent`, and added `uuid` with its type definitions to resolve deprecation and missing module errors.
  - All dependencies audited and updated to address security vulnerabilities where possible.
- **Security & Compatibility:**
  - Rate limiting middleware now uses a type-safe Redis command signature for compatibility with `ioredis` and `rate-limit-redis`.
  - All environment variables and configuration files reviewed for consistency and security best practices.

Please refer to this section for any breaking changes or migration notes related to the 2026 update cycle.

## Environment Variables

Copy `.env.example` to `.env` and fill in the required values:

- API_KEY
- PORT

## Build & Run

```bash
pnpm install
pnpm run build
pnpm run start
```

Or using Docker:

```bash
docker build -t api-gateway .
docker run --env-file .env api-gateway
```

## Troubleshooting

- Ensure all environment variables are set.
- If you encounter build issues, clean the cache or delete node_modules and reinstall.
