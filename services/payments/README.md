# Payments Service (services/payments)

## Purpose
 إدارة عمليات الدفع الإلكتروني والنقدي للطلبات.

## Structure
- `src/` — الكود المصدري (طبقات domain, application, infrastructure)
- `db/` — ملفات الهجرة (migrations) إذا لزم الأمر
- `Dockerfile` — بناء الخدمة كحاوية مستقلة

## Example API Usage (مقترح)
### Initiate Payment
POST /payments
```json
{
	"orderId": "o1",
	"amount": 100,
	"method": "card"
}
```

### Response
```json
{
	"paymentId": "p1",
	"status": "pending"
}
```

## Extending
- أضف دعم بوابات دفع متعددة.
- أضف اختبارات وحدات وتكامل.
- حسّن التوثيق الداخلي للكود.

## Environment Variables

Copy `.env.example` to `.env` and fill in the required values:

- API_KEY
- STRIPE_SECRET_KEY
- STRIPE_PUBLISHABLE_KEY
- STRIPE_WEBHOOK_SECRET
- PORT

## Build & Run

```bash
npm install
npm run build
npm run start:prod
```

Or using Docker:

```bash
docker build -t payments-service .
docker run --env-file .env payments-service
```

## Troubleshooting
- Ensure all environment variables are set.
- If you encounter build issues, clean the cache or delete node_modules and reinstall.