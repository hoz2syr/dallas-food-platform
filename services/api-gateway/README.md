
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
