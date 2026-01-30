# Menu Service (services/menu)

## Purpose
 إدارة القوائم وأصناف الطعام للمنصة. توفر الخدمة واجهات API لإنشاء وتحديث واستعراض القوائم والأصناف.

## Structure
- `src/` — الكود المصدري (طبقات domain, application, infrastructure)
- `db/` — ملفات الهجرة (migrations) وتهيئة البيانات (seeding)
- `Dockerfile` — بناء الخدمة كحاوية مستقلة

## Example API Usage
### Create Menu
POST /menus
```json
{
	"menuId": "m1",
	"name": "Lunch",
	"items": [
		{ "id": "i1", "name": "Burger", "price": 5 }
	]
}
```

### Response
```json
{
	"id": "m1",
	"name": "Lunch",
	"createdAt": "2026-01-01T00:00:00.000Z"
}
```

## Extending
- أضف دعم الترجمة أو التصنيفات للأصناف.
- أضف اختبارات وحدات وتكامل.
- حسّن التوثيق الداخلي للكود.

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
docker build -t menu-service .
docker run --env-file .env menu-service
```

## Authentication

- All endpoints require a valid JWT in the `Authorization` header.
- Obtain a JWT from the Auth Service (`/api/auth/login` or `/api/auth/signup`).
- Example:
  ```http
  Authorization: Bearer <your-jwt-token>
  ```
- If you receive a 401 error, your token is missing, expired, or invalid.

## Troubleshooting
- Ensure all environment variables are set.
- If you encounter build issues, clean the cache or delete node_modules and reinstall.