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