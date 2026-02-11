# Dallas Food Platform

**رؤية المشروع:** بناء منصة طلبات طعام مرنة وقابلة للتوسع لمدينة دالاس وما بعدها.

**الإصدار:** 2.0.0  
**آخر تحديث:** فبراير 2026

---

## المحتويات

- [نظرة عامة](#نظرة-عامة)
- [الخدمات المتاحة](#الخدمات-المتاحة)
- [البنية التقنية](#البنية-التقنية)
- [كيفية التشغيل](#كيفية-التشغيل)
- [المتطلبات](#المتطلبات)
- [المساهمة في المشروع](#المساهمة-في-المشروع)
- [التوثيق](#التوثيق)

---

## نظرة عامة

منصة دالاس فود هي نظام طلبات طعام متكامل يعتمد على بنية الخدمات المصغرة (Microservices) مع أساس مشترك مركزي. يوفر النظام تجربة سلسة للعملاء والمطاعم وموظفي التوصيل والإدارة.

### المميزات الرئيسية

- 🛒 **نظام طلبات متكامل** - من اختيار الطعام حتى التوصيل
- 📱 **تطبيقات متعددة** - ويب، تطبيق عميل، لوحة تحكم، عرض المطبخ
- 🔐 **أمان متقدم** - JWT، تشفير AES-256، تسجيل التدقيق
- 📊 **تحليلات ولوحات تحكم** - مراقبة الأداء والمبيعات
- 🔄 **أحداث في الوقت الفعلي** - WebSocket للتبع الفوري للطلبات

---

## الخدمات المتاحة

### الخدمات الخلفية (Backend Services)

| الخدمة | المنفذ | الغرض | المستودع |
|--------|--------|-------|----------|
| [Auth Service](services/auth/) | 3001 | المصادقة والتفويض | `services/auth/` |
| [Menu Service](services/menu/) | 3002 | إدارة قوائم الطعام | `services/menu/` |
| [Order Service](services/order/) | 3003 | إدارة الطلبات | `services/order/` |
| [Payment Service](services/payments/) | 3004 | معالجة المدفوعات | `services/payments/` |
| [Delivery Service](services/delivery/) | 3005 | إدارة التوصيل | `services/delivery/` |
| [Notification Service](services/notification/) | 3006 | الإشعارات | `services/notification/` |
| [CRM Service](services/crm/) | 3007 | إدارة علاقات العملاء | `services/crm/` |
| [Analytics Service](services/analytics/) | 3008 | التحليلات والتقارير | `services/analytics/` |
| [Reviews Service](services/reviews/) | 3009 | إدارة التقييمات | `services/reviews/` |
| [Staff Service](services/staff/) | 3010 | إدارة الموظفين | `services/staff/` |
| [Inventory Service](services/inventory/) | 3011 | إدارة المخزون | `services/inventory/` |
| [Promotions Service](services/promotions/) | 3012 | العروض والخصومات | `services/promotions/` |

### تطبيقات الواجهة الأمامية (Frontend Apps)

| التطبيق | المنفذ | الغرض |
|---------|--------|-------|
| [Web](apps/web/) | 3000 | الموقع الرئيسي |
| [Customer App](apps/customer-app/) | 3001 | تطبيق الهاتف للعملاء |
| [Admin Dashboard](apps/admin-dashboard/) | 3002 | لوحة تحكم الإدارة |
| [Kitchen Display](apps/kitchen-display/) | 3003 | عرض طلبات المطبخ |

---

## البنية التقنية

```
┌─────────────────────────────────────────────────────────────┐
│                    Dallas Food Platform                      │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐    │
│  │                    Presentation Layer               │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐  │    │
│  │  │   Web    │ │ Customer │ │  Admin   │ │Kitchen │  │    │
│  │  │          │ │   App    │ │Dashboard │ │Display │  │    │
│  │  └──────────┘ └──────────┘ └──────────┘ └────────┘  │    │
│  └─────────────────────────────────────────────────────┘    │
│                            │                                 │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                   API Gateway (Nginx)               │    │
│  └─────────────────────────────────────────────────────┘    │
│                            │                                 │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                   Core Services                     │    │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │    │
│  │  │  Auth   │ │  Menu   │  │  Order  │ │Payment  │   │    │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘   │    │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │    │
│  │  │Delivery │ │  CRM    │ │Analytics│ │Reviews  │   │    │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘   │    │
│  └─────────────────────────────────────────────────────┘    │
│                            │                                 │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Infrastructure Layer                   │    │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │    │
│  │  │Postgres │ │  Redis  │ │RabbitMQ │ │Sentry   │   │    │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘   │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### التقنيات المستخدمة

| الفئة | التقنية |
|-------|---------|
| **اللغة** | TypeScript (Node.js LTS) |
| **إطار العمل الخلفي** | NestJS |
| **إطار العمل الأمامي** | Next.js 14 (App Router) |
| **مدير الحزم** | pnpm 9.x |
| **قاعدة البيانات** | PostgreSQL 15 |
| **التخزين المؤقت** | Redis 7 |
| **الرسائل** | RabbitMQ 3.12 |
| **الحاويات** | Docker, Docker Compose |
| **التصعيد** | Kubernetes-ready |
| **أسلوب API** | REST-first, Event-ready |

---

## كيفية التشغيل

### التشغيل السريع (Windows)

```powershell
# 1. تفعيل Corepack وتحضير pnpm
corepack enable
corepack prepare pnpm@9.15.5 --activate

# 2. تثبيت التبعيات
pnpm install -w

# 3. تشغيل جميع الخدمات
docker compose -f infra/docker-compose.yml up --build

# 4. الوصول للتطبيقات
# - الويب: http://localhost:3000
# - لوحة التحكم: http://localhost:3002
# - تطبيق العميل: http://localhost:3001
```

### التشغيل التفصيلي

```bash
# نسخ ملف المتغيرات
cp .env.example .env

# تعديل المتغيرات حسب الحاجة
# nano .env

# تشغيل خدمات محددة
docker compose -f infra/docker-compose.yml up --build postgres redis menu auth

# مراقبة السجلات
docker compose logs -f

# إيقاف جميع الخدمات
docker compose down
```

### التشغيل بدون Docker

```bash
# تشغيل خدمة واحدة (مثال: Menu Service)
cd services/menu
pnpm install
pnpm start:dev
```

---

## المتطلبات

### المتطلبات الأساسية

| المتطلب | الإصدار المطلوب | ملاحظات |
|---------|-----------------|---------|
| Node.js | LTS (20.x+) | يُنصح بـ 20.x |
| pnpm | 9.x | مدير الحزم الرئيسي |
| Docker | 24.x+ | للحاويات |
| Docker Compose | 2.x+ | لتنسيق الحاويات |
| PostgreSQL | 15.x | قاعدة البيانات الرئيسية |
| Redis | 7.x | التخزين المؤقت |
| RabbitMQ | 3.12 | رسائل الخدمة |

### متغيرات البيئة المطلوبة

```bash
# === قاعدة البيانات ===
DATABASE_URL=postgresql://user:password@localhost:5432/dallas_food

# === Redis ===
REDIS_HOST=localhost
REDIS_PORT=6379

# === RabbitMQ ===
RABBITMQ_URL=amqp://admin:password@localhost:5672

# === المصادقة ===
JWT_SECRET=your-32-char-secret-key
JWT_REFRESH_SECRET=your-32-char-refresh-secret

# === التشفير ===
ENCRYPTION_KEY=your-256-bit-key

# ===_ports ===
PORT=3000
```

---

## المساهمة في المشروع

### إرشادات المساهمة

1. **إنشاء Fork من المستودع**
2. **إنشاء فرع جديد للميزة**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **كتابة الكود مع الالتزام بالمعايير**
4. **إضافة الاختبارات**
5. **إرسال Pull Request**

### معايير الكود

- اتبع تنسيق TypeScript القياسي
- استخدم ESLint و Prettier
- اكتب اختبارات Unit للـ Domain و Application
- وثق التغييرات في CHANGELOG.md

### الالتزام بقرارات التصميم

راجع ملفات ADR في [`docs/DECISIONS/`](docs/DECISIONS/) قبل إجراء تغييرات تؤثر على البنية.

---

## التوثيق

| الملف | الوصف |
|-------|-------|
| [README.md](README.md) | هذا الملف - نظرة عامة |
| [PRODUCTION_READINESS.md](PRODUCTION_READINESS.md) | دليل جاهزية الإنتاج |
| [SECURITY.md](SECURITY.md) | سياسات الأمان |
| [docs/ARCHITECTURE_OVERVIEW.md](docs/ARCHITECTURE_OVERVIEW.md) | نظرة عامة على البنية |
| [docs/SERVICE-BLUEPRINT.md](docs/SERVICE-BLUEPRINT.md) | معايير الخدمات |
| [docs/API-CONTRACTS.md](docs/API-CONTRACTS.md) | عقود API |
| [docs/REFERENCE-ARCHITECTURE.md](docs/REFERENCE-ARCHITECTURE.md) | بنية مرجعية |
| [docs/DOCS-AUDIT.md](docs/DOCS-AUDIT.md) | تدقيق التوثيق |
| [docs/PLATFORM_STATUS_REPORT_AR.md](docs/PLATFORM_STATUS_REPORT_AR.md) | تقرير حالة المنصة الشامل (عربي) |
| [docs/ZIP_CODE_EXPLANATION_AR.md](docs/ZIP_CODE_EXPLANATION_AR.md) | شرح استخدام الأكواد البريدية في المنصة |

---

## التغييرات الأخيرة

### الإصدار 2.0.0 (فبراير 2026)

- ✨ إضافة خدمة Staff Management
- ✨ إضافة خدمة Inventory Management
- ✨ إضافة خدمة Promotions
- 🔐 تحسين أمان JWT مع RS256
- 📊 إضافة لوحة تحكم Analytics
- 🐛 إصلاح مشاكل الأداء في Order Service
- 📚 تحديث جميع ملفات التوثيق

---

## الترخيص

MIT License - راجع [LICENSE](LICENSE) للمزيد من التفاصيل.

---

**للتواصل:** dev@dallasfood.example.com
