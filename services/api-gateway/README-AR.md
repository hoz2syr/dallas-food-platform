# Dallas Food Platform - API Gateway

> **بوابة API مركزية** لمنصة Dallas Food Platform - توفر مصادقة موحدة، توجيه ذكي، وحماية شاملة

## 📋 المحتويات

- [نظرة عامة](#نظرة-عامة)
- [الميزات](#الميزات)
- [البدء السريع](#البدء-السريع)
- [البنية المعمارية](#البنية-المعمارية)
- [التكوين](#التكوين)
- [المصادقة والتفويض](#المصادقة-والتفويض)
- [نقاط النهاية API](#نقاط-النهاية-api)
- [الأمان](#الأمان)
- [المراقبة](#المراقبة)
- [النشر](#النشر)
- [الاختبار](#الاختبار)
- [استكشاف الأخطاء](#استكشاف-الأخطاء)

---

## 🎯 نظرة عامة

API Gateway هي نقطة الدخول الموحدة لجميع طلبات العملاء في منصة Dallas Food Platform. تقوم بـ:

- ✅ **المصادقة المركزية** - JWT-based authentication
- ✅ **التوجيه الذكي** - توجيه الطلبات إلى الخدمات المناسبة
- ✅ **الحماية الشاملة** - Rate limiting, CORS, Security headers
- ✅ **المرونة** - Circuit breaker, Retry logic, Timeouts
- ✅ **المراقبة** - Logging, Metrics, Health checks

---

## ✨ الميزات

### 🔐 الأمان
- JWT Authentication & Authorization
- Role-Based Access Control (RBAC)
- Permission-based access
- Rate limiting (IP & User-based)
- CORS configuration
- Helmet security headers
- Input validation

### 🚀 الأداء والمرونة
- Circuit Breaker pattern
- Automatic retry with exponential backoff
- Request timeout management
- Response caching (optional)
- Request/Response compression

### 📊 المراقبة والتتبع
- Structured logging (JSON/Console)
- Correlation IDs for distributed tracing
- Health check endpoints
- Circuit breaker statistics
- Request/Response metrics

### 🔄 التوجيه والبروكسي
- Dynamic service discovery
- Load balancing (Round-robin ready)
- Path-based routing
- Method-based routing
- Service health checking

---

## 🚀 البدء السريع

### المتطلبات

- Node.js >= 18.x
- npm >= 9.x or pnpm >= 8.x
- Redis (optional - for distributed rate limiting & caching)

### التثبيت

```bash
# استنساخ المشروع (أو نسخ مجلد api-gateway إلى services/)
cd services/api-gateway

# تثبيت التبعيات
npm install
# أو
pnpm install

# نسخ ملف البيئة
cp .env.example .env

# تحرير متغيرات البيئة
nano .env  # أو محرر النصوص المفضل لديك
```

### التشغيل

```bash
# Development mode (with hot reload)
npm run dev

# Production mode
npm run build
npm start

# مع Docker
docker-compose up api-gateway
```

### أول طلب API

```bash
# Health Check
curl http://localhost:8080/health

# تسجيل دخول (مثال - يحتاج تطبيق auth endpoints)
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

# استخدام Token للوصول للخدمات
curl http://localhost:8080/api/v1/orders \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🏗️ البنية المعمارية

### نظرة عامة

```
┌─────────────┐
│   Clients   │
│ (Web/Mobile)│
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────────┐
│            API Gateway (Port 8080)           │
│  ┌──────────────────────────────────────┐   │
│  │  Middleware Pipeline                 │   │
│  │  1. Correlation ID                   │   │
│  │  2. Request Logging                  │   │
│  │  3. CORS                             │   │
│  │  4. Helmet (Security Headers)        │   │
│  │  5. Rate Limiting                    │   │
│  │  6. Authentication (JWT)             │   │
│  │  7. Authorization (Permissions)      │   │
│  │  8. Proxy/Routing                    │   │
│  │  9. Error Handling                   │   │
│  └──────────────────────────────────────┘   │
│                                              │
│  ┌──────────────────────────────────────┐   │
│  │  Circuit Breaker                     │   │
│  │  - Failure detection                 │   │
│  │  - Auto recovery                     │   │
│  └──────────────────────────────────────┘   │
└──────────────┬───────────────────────────────┘
               │
       ┌───────┼───────┬─────────┬──────────┐
       ▼       ▼       ▼         ▼          ▼
   ┌────────┬────────┬─────────┬──────────┬──────────┐
   │ Order  │ Menu   │ Delivery│ Payment  │  Future  │
   │Service │Service │ Service │ Service  │ Services │
   │ :3001  │ :3002  │  :3003  │  :3004   │          │
   └────────┴────────┴─────────┴──────────┴──────────┘
```

### Request Flow

```
1. Client Request
   ↓
2. Correlation ID Assignment
   ↓
3. Request Logging
   ↓
4. Security Headers (Helmet)
   ↓
5. CORS Validation
   ↓
6. Rate Limit Check
   ↓
7. JWT Authentication
   ↓
8. Permission Check
   ↓
9. Circuit Breaker Evaluation
   ↓
10. Proxy to Service
   ↓
11. Response Transformation (if needed)
   ↓
12. Response Logging
   ↓
13. Client Response
```

---

## ⚙️ التكوين

### متغيرات البيئة الأساسية

```bash
# Server
PORT=8080
NODE_ENV=production

# JWT (REQUIRED - Must be strong secrets!)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars-CHANGE-THIS
JWT_REFRESH_SECRET=your-refresh-secret-min-32-chars-CHANGE-THIS
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Services (Required)
ORDER_SERVICE_URL=http://order-service:3001
MENU_SERVICE_URL=http://menu-service:3002
DELIVERY_SERVICE_URL=http://delivery-service:3003
PAYMENT_SERVICE_URL=http://payment-service:3004
```

### Redis (اختياري - للأداء المحسّن)

```bash
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=your-redis-password
```

### متغيرات إضافية

انظر `.env.example` للقائمة الكاملة.

---

## 🔐 المصادقة والتفويض

### JWT Token Structure

```json
{
  "sub": "user-id-123",
  "email": "customer@example.com",
  "roles": ["customer"],
  "permissions": [
    "order:create",
    "order:read:own",
    "order:cancel:own"
  ],
  "iat": 1234567890,
  "exp": 1234568790
}
```

### User Roles

| Role | Description | Permissions |
|------|-------------|-------------|
| **customer** | عميل عادي | order:create, order:read:own, payment:create |
| **restaurant_owner** | صاحب مطعم | menu:*, order:read:restaurant |
| **delivery_driver** | سائق توصيل | delivery:*, order:read:delivery |
| **admin** | مدير النظام | * (all permissions) |

### Permission Format

```
resource:action[:scope]

Examples:
- order:create
- order:read:own
- menu:write
- * (admin wildcard)
```

### Authentication Flow

```
1. Client → POST /api/v1/auth/login
   {
     "email": "user@example.com",
     "password": "password123"
   }

2. API Gateway ← 200 OK
   {
     "accessToken": "eyJhbG...",
     "refreshToken": "eyJhbG...",
     "expiresIn": 900
   }

3. Client → GET /api/v1/orders
   Headers: Authorization: Bearer eyJhbG...

4. Gateway validates JWT

5. Gateway proxies to Order Service
   Headers: 
     - X-User-Id: user-id-123
     - X-User-Roles: customer
     - X-Correlation-Id: abc-123

6. Order Service processes request

7. Gateway returns response to client
```

---

## 📡 نقاط النهاية API

### Health & Monitoring

```
GET  /health              # Overall health
GET  /health/services     # Backend services health
GET  /metrics             # Prometheus metrics (if enabled)
GET  /stats/circuit-breaker  # Circuit breaker statistics
```

### Authentication

```
POST /api/v1/auth/register    # User registration
POST /api/v1/auth/login       # User login
POST /api/v1/auth/refresh     # Refresh access token
POST /api/v1/auth/logout      # User logout
GET  /api/v1/auth/me          # Get current user info
```

### Orders (Proxied to Order Service)

```
GET    /api/v1/orders           # List orders
POST   /api/v1/orders           # Create order
GET    /api/v1/orders/:id       # Get order details
PATCH  /api/v1/orders/:id       # Update order
DELETE /api/v1/orders/:id       # Cancel order
```

### Menu (Proxied to Menu Service)

```
GET  /api/v1/menu/restaurants/:id/items    # Get restaurant menu
GET  /api/v1/menu/items/:id                # Get item details
POST /api/v1/menu/items                    # Create item (restaurant owner)
PUT  /api/v1/menu/items/:id                # Update item
DELETE /api/v1/menu/items/:id              # Delete item
```

### Delivery (Proxied to Delivery Service)

```
GET   /api/v1/delivery/orders/:orderId     # Get delivery status
POST  /api/v1/delivery/assign              # Assign driver
PATCH /api/v1/delivery/:id/status          # Update delivery status
```

### Payments (Proxied to Payment Service)

```
POST /api/v1/payments/intents      # Create payment intent
POST /api/v1/payments/confirm      # Confirm payment
GET  /api/v1/payments/orders/:id   # Get payment status
```

---

## 🛡️ الأمان

### Security Headers (Helmet)

تلقائياً يتم إضافة:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security`
- `Content-Security-Policy`

### Rate Limiting

**Default (Global)**
- 100 requests per 15 minutes per IP

**Strict (Auth endpoints)**
- 5 requests per minute for login/register

**Custom per endpoint** - يمكن تخصيص حدود مختلفة

### CORS

```javascript
// Default configuration
{
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Correlation-Id']
}
```

### Input Validation

جميع المدخلات تُفحص باستخدام Joi schemas قبل المعالجة.

---

## 📊 المراقبة

### Logging

**Structured JSON Logging**
```json
{
  "timestamp": "2024-01-28T10:30:00.000Z",
  "level": "info",
  "service": "api-gateway",
  "correlationId": "abc-123-def-456",
  "message": "Request completed",
  "method": "GET",
  "path": "/api/v1/orders",
  "statusCode": 200,
  "duration": "45ms",
  "userId": "user-123"
}
```

### Correlation IDs

كل طلب يحصل على معرّف فريد يمكن تتبعه عبر جميع الخدمات:

```
Client Request
  ↓ X-Correlation-Id: abc-123
API Gateway
  ↓ X-Correlation-Id: abc-123
Order Service
  ↓ X-Correlation-Id: abc-123
Database
```

### Health Checks

```bash
# Check gateway health
curl http://localhost:8080/health

# Response
{
  "status": "healthy",
  "service": "api-gateway",
  "timestamp": "2024-01-28T10:30:00.000Z",
  "uptime": 123456,
  "checks": {
    "redis": true,
    "services": {
      "order-service": true,
      "menu-service": true,
      "delivery-service": false,  # Circuit open
      "payment-service": true
    }
  }
}
```

### Circuit Breaker Stats

```bash
curl http://localhost:8080/stats/circuit-breaker

# Response
[
  {
    "name": "order-service",
    "state": "CLOSED",
    "failures": 2,
    "successes": 1523,
    "rejections": 0,
    "fallbacks": 0
  },
  {
    "name": "delivery-service",
    "state": "OPEN",
    "failures": 15,
    "successes": 823,
    "rejections": 45,
    "fallbacks": 0
  }
]
```

---

## 🚢 النشر

### Development

```bash
npm run dev
```

### Production

```bash
# Build
npm run build

# Run
NODE_ENV=production npm start
```

### Docker

```dockerfile
# Dockerfile already created
docker build -t api-gateway:latest .
docker run -p 8080:8080 --env-file .env api-gateway:latest
```

### Docker Compose

```yaml
# في الملف الرئيسي docker-compose.yml
services:
  api-gateway:
    build: ./services/api-gateway
    ports:
      - "8080:8080"
    environment:
      - NODE_ENV=production
    env_file:
      - ./services/api-gateway/.env
    depends_on:
      - order-service
      - menu-service
      - delivery-service
      - payment-service
      - redis
    networks:
      - dallas-food-network
```

### Kubernetes (مثال)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-gateway
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api-gateway
  template:
    metadata:
      labels:
        app: api-gateway
    spec:
      containers:
      - name: api-gateway
        image: api-gateway:latest
        ports:
        - containerPort: 8080
        env:
        - name: NODE_ENV
          value: "production"
        envFrom:
        - secretRef:
            name: api-gateway-secrets
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5
```

---

## 🧪 الاختبار

### Unit Tests

```bash
npm run test

# With coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### Integration Tests

```bash
# يحتاج خدمات خلفية قيد التشغيل
npm run test:integration
```

### Manual API Testing

```bash
# Using httpie
http POST localhost:8080/api/v1/auth/login \
  email=user@example.com \
  password=password123

# Using curl
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

---

## 🔧 استكشاف الأخطاء

### المشكلة: "Invalid or expired token"

**الحل**:
```bash
# تحقق من JWT_SECRET في .env
# تأكد من أن Token لم ينتهي
# احصل على token جديد عبر /auth/refresh
```

### المشكلة: "Service unavailable"

**الحل**:
```bash
# تحقق من أن الخدمة الخلفية تعمل
docker-compose ps

# تحقق من Circuit Breaker
curl http://localhost:8080/stats/circuit-breaker

# إعادة تعيين Circuit Breaker (للتطوير فقط)
# يمكن إضافة endpoint للإدارة
```

### المشكلة: "Rate limit exceeded"

**الحل**:
```bash
# انتظر حتى نهاية النافذة الزمنية
# أو قم بتعديل RATE_LIMIT_MAX_REQUESTS في .env
```

### المشكلة: "CORS error"

**الحل**:
```bash
# تحقق من CORS_ORIGIN في .env
# تأكد من أنه يتطابق مع origin الخاص بالعميل
```

---

## 📝 المهام المتبقية

### ✅ تم الانتهاء
- [x] البنية الأساسية
- [x] Configuration management
- [x] JWT Authentication service
- [x] Circuit Breaker service
- [x] Auth middleware
- [x] Logging middleware
- [x] Custom errors
- [x] TypeScript types

### 🚧 يحتاج إكمال (التالي)
- [ ] Error handling middleware
- [ ] Rate limiting middleware
- [ ] CORS middleware
- [ ] Proxy service implementation
- [ ] Auth routes (login/register)
- [ ] Proxy routes
- [ ] Main server setup
- [ ] Health check implementation
- [ ] Tests
- [ ] Docker configuration
- [ ] Documentation updates

---

## 📚 الموارد الإضافية

- [Express.js Documentation](https://expressjs.com/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [Circuit Breaker Pattern](https://martinfowler.com/bliki/CircuitBreaker.html)
- [API Gateway Pattern](https://microservices.io/patterns/apigateway.html)

---

## 👥 الفريق والدعم

للأسئلة أو المساعدة، يرجى التواصل مع:
- فريق التطوير: dev@dallasfood.com
- قناة Slack: #api-gateway

---

## 📄 الترخيص

MIT License - انظر ملف LICENSE للتفاصيل

---

**تم الإنشاء بواسطة**: Dallas Food Platform Team  
**آخر تحديث**: يناير 2026  
**الإصدار**: 1.0.0
