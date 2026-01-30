# Delivery Service (services/delivery)

## Purpose
 إدارة عمليات التوصيل وتتبع الطلبات من نقطة التحضير حتى التسليم.

## Structure
- `src/` — الكود المصدري (طبقات domain, application, infrastructure)
- `db/` — ملفات الهجرة (migrations) إذا لزم الأمر
- `Dockerfile` — بناء الخدمة كحاوية مستقلة

## Example API Usage (مقترح)
### Track Delivery
GET /deliveries/{orderId}

### Response
```json
{
	"orderId": "o1",
	"status": "on-the-way",
	"estimatedArrival": "2026-01-26T18:00:00.000Z"
}
```

## Extending
- أضف منطق تتبع السائقين.
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
docker build -t delivery-service .
docker run --env-file .env delivery-service
```

## Troubleshooting
- Ensure all environment variables are set.
- If you encounter build issues, clean the cache or delete node_modules and reinstall.