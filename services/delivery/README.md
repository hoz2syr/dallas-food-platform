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