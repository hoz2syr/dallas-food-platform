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