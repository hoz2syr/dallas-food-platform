# Kitchen Display System (واجهة المطبخ)

واجهة عرض الطلبات للمطبخ تشمل:
- شاشة الطلبات الواردة (Orders Queue)
- شاشة تفاصيل الطلب (Order Details)
- تحديث حالة التحضير (Preparation Status)
- شاشة التنبيهات (Alerts)

## الهيكل الأولي
- `src/pages/` — صفحات رئيسية
- `src/components/` — مكونات عرض الطلبات
- `src/styles/` — أنماط CSS

## للبدء
- سيتم بناء كل شاشة بشكل منفصل مع دعم التحديث اللحظي (real-time) لاحقاً.

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
docker build -t kitchen-display .
docker run --env-file .env kitchen-display
```

## Troubleshooting
- Ensure all environment variables are set.
- If you encounter build issues, clean the cache or delete node_modules and reinstall.
