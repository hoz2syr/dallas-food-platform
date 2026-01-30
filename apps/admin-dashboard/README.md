# Admin Dashboard (لوحة تحكم الإدارة)

واجهة مركزية لإدارة المطعم تشمل:

- نظرة عامة (Dashboard Overview)
- إدارة الطلبات
- إدارة القائمة
- إدارة المخزون
- التقارير والإحصائيات
- إدارة العروض
- إدارة العملاء
- إدارة الموظفين

## الهيكل الأولي

- `src/pages/` — صفحات رئيسية لكل قسم
- `src/components/` — مكونات مشتركة (جداول، بطاقات، إلخ)
- `src/styles/` — أنماط CSS/SCSS
- `src/api/` — استدعاءات API

## ربط مع الخدمات (APIs)

- صفحة إدارة الطلبات (OrdersManagementPage) مرتبطة فعليًا مع API وتعرض الطلبات من endpoint `/api/orders` مع مؤشرات تحميل ورسائل خطأ.

- **صفحة نظرة عامة (DashboardOverviewPage):**
	- تعرض إحصائيات المطعم بشكل مختصر وبصري.
	- تستخدم مكتبة MUI وGrid لواجهة متجاوبة وحديثة.
	- تدعم التحديث التلقائي للبيانات (auto-refresh) مع زر تحديث يدوي.
	- تعرض بطاقات إحصائية (StatCard) مع مؤشرات تغير النسبة المئوية.
	- تعرض مخطط بياني (RevenueChart) قابل للتبديل بين الإيرادات/الطلبات/العملاء.
	- تعرض آخر الطلبات في جدول مختصر (MiniTable).
	- تدعم تنسيقات العملة السعودية وتعرض وقت آخر تحديث.
	- معالجة الأخطاء والتحميل باستخدام MUI Alert وLinearProgress.
	- تعتمد على أنواع TypeScript مخصصة في `src/types/dashboard.types.ts`.

## تحسين تجربة المستخدم (UI/UX)

- تمت إضافة مؤشرات تحميل (`.loading`) ورسائل خطأ (`.error`) بتنسيق وألوان واضحة.
- تم تحسين ألوان لوحة الإدارة لتكون أكثر وضوحًا وسهولة في الاستخدام.
- تم توحيد جميع الصفحات لاستخدام MUI وtheme موحد.

## توثيق المكونات

- Table: مكون جدول عام لعرض البيانات.
- StatCard: بطاقة إحصائية مختصرة تدعم عرض التغيرات النسبية والأيقونات.
- Sidebar: شريط تنقل جانبي ثابت لجميع الصفحات.
- RevenueChart: مخطط بياني للإيرادات/الطلبات/العملاء.
- MiniTable: جدول مختصر لعرض آخر الطلبات.

## أنواع TypeScript

- جميع الإحصائيات والبيانات تعتمد على الأنواع التالية (انظر `src/types/dashboard.types.ts`):
	- `DashboardStats`, `ChartType`, `Order`, `ChartData`
	- بطاقات الإحصائيات تدعم props إضافية مثل: `icon`, `change`, `changeType`, `tooltip`

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
docker build -t admin-dashboard .
docker run --env-file .env admin-dashboard
```

## Troubleshooting

- Ensure all environment variables are set.
- If you encounter build issues, clean the cache or delete node_modules and reinstall.