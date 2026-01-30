# Auth Service

خدمة المصادقة (Authentication Service) — مسؤولة عن تسجيل المستخدمين، تسجيل الدخول، إصدار وتحقق JWT، وتوفير واجهات API آمنة لباقي الخدمات.

## المميزات
- تسجيل مستخدم جديد (Signup)
- تسجيل الدخول (Login)
- إصدار JWT
- تحقق من صحة التوكن
- واجهات RESTful

## الخطوات القادمة
- بناء منطق المستخدمين وقاعدة البيانات
- إضافة اختبارات

## Authentication Flow

- **Signup:** `POST /api/auth/signup` — Register a new user (returns JWT)
- **Login:** `POST /api/auth/login` — Authenticate and receive JWT
- **Get current user:** `GET /api/auth/me` (requires `Authorization: Bearer <token>`)

Include the JWT in the `Authorization` header for all protected API requests to other services.

Example:
```http
Authorization: Bearer <your-jwt-token>
```
