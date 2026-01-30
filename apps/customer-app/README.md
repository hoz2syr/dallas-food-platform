# Customer App (واجهة العملاء)


واجهة تفاعلية حديثة لعملاء المطعم (ويب/موبايل) مبنية على Next.js وTypeScript.

## الميزات الرئيسية
- **استعراض القائمة**: جلب القوائم والأصناف من Menu Service.
- **سلة التسوق**: إضافة و تعديل المنتجات مع حالة مركزية (Context).
- **إتمام الطلب**: إرسال الطلب إلى Order Service.
- **الدفع**: اختيار طريقة الدفع والتكامل مع Payment Service.
- **تتبع الطلب الفوري**: تحديثات حية عبر WebSocket من Order/Delivery Service.
- **الحساب الشخصي والطلبات السابقة**: جلب البيانات من CRM Service.
- **مصادقة موحدة JWT**: تسجيل دخول المستخدم وتخزين التوكن واستخدامه في جميع الاستدعاءات.


## الهيكل البرمجي
- `src/pages/` — صفحات رئيسية (menu, cart, checkout, profile, order-tracking ...)
- `src/components/` — مكونات مشتركة (بطاقات، أزرار، متتبع الطلب ...)
- `src/lib/context/` — حالة مركزية للسلة والمصادقة (CartContext, AuthContext)
- `src/lib/api/` — دوال استدعاء الخدمات الخلفية (menu, order, payment, crm)
- `src/lib/websocket/` — عميل WebSocket متقدم لتتبع الطلبات
- `src/styles/` — أنماط CSS/SCSS
- `public/` — صور وأيقونات


## تدفق المستخدم
1. يسجل الدخول (JWT) أو يتصفح كزائر.
2. يستعرض القائمة ويضيف المنتجات للسلة.
3. يراجع السلة ويكمل الطلب.
4. يختار طريقة الدفع وينفذ العملية.
5. يتتبع حالة الطلب بشكل فوري.
6. يدير ملفه الشخصي ويستعرض الطلبات السابقة.

## التكامل مع الخدمات
- جميع الاستدعاءات تتم عبر API Gateway أو مباشرة مع الخدمات (Menu, Order, Payment, CRM) حسب البيئة.
- التوكن (JWT) يرسل في الهيدر Authorization عند الحاجة.

## متغيرات البيئة

يرجى نسخ ملف `.env.example` إلى `.env` وتعبئة القيم المطلوبة:

- REACT_APP_STRIPE_PUBLISHABLE_KEY
- API_KEY
- PORT

## البناء والتشغيل

```bash
pnpm install
pnpm run build
pnpm run start
```

أو باستخدام Docker:

```bash
docker build -t customer-app .
docker run --env-file .env customer-app
```

## حلول المشاكل
- تأكد من وجود جميع متغيرات البيئة.
- إذا ظهرت مشاكل في البناء، نظف الكاش أو احذف `node_modules` وأعد التثبيت.

## Environment Variables

Copy `.env.example` to `.env` and fill in the required values:

- REACT_APP_STRIPE_PUBLISHABLE_KEY
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
docker build -t customer-app .
docker run --env-file .env customer-app
```

## Troubleshooting
- Ensure all environment variables are set.
- If you encounter build issues, clean the cache or delete node_modules and reinstall.
