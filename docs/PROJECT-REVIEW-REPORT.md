ع
# خطة فحص شامل لنظام مطعم دالاس (dallas‑food‑platform)

## 1. فحص الأخطاء المنطقية والتسلسلية
### 1.1 تدفق العمليات (طلب → طبخ → توصيل)
- دراسة مخطط State Machine في `services/order/src/` و`services/delivery/src/`.
- رسم خرائط تدفق باستخدام أدوات مثل PlantUML أو Lucidchart.
- التحقق من وجود إجراءات “محمية” لتجنب حالات التقدم غير المرغوب فيها.

### 1.2 اتساق البيانات بين قواعد البيانات
- فحص `infra/postgres/init.sql` و`services/order/db/*.sql`.
- تشغيل `pnpm exec typeorm migration:show` للتأكد من عدم وجود تراخيص غير متزامنة.
- مراجعة جداول الـ `JOIN` بين `order`, `payment`, `menu`, `notification` للتأكد من تكامل البيانات.

### 1.3 معالجة الحالة (state machine) للطلبات
- اختبار سيناريوهات من `services/order/__tests__/` عبر `vitest` و`cypress`.
- تحليل التحولات في `services/order/src/state-machine.ts`.
- إضافة Cases خاصة لـ “ملغاة” و “مشكلة دفع” في `services/order/src/cancellation.handler.ts` و`services/payments/src/payment.handler.ts`.

### 1.4 معالجة الحالات الخاصة (ملغاة، مشاكل الدفع)
- إنشاء سيناريوهات اختبار إضافية في `infra/e2e/run‑menu‑e2e.sh`.
- تشغيل `npm run lint` مع rule `eslint-plugin-security` لتطبيق أفضل الممارسات.

### 1.5 فحص التضمن (Race Conditions) في العمليات المتزامنة
- تشغيل `vitest --run --parallel` على جميع الـ tests التي تتعامل مع RabbitMQ.
- مراجعة `infra/rabbitmq/definitions.json` لضمان إرسال الرسائل ذات الأولوية الصحيحة.
- إضافة `Promise.allSettled` أو `await` حسب الحاجة في الـ async flows.

---

## 2. فحص التكاملات بين الخدمات
### 2.1 نقاط الاتصال (API Gateway)
- تحليل ملف `infra/nginx/conf.d/api.conf` لتأكيد CORS وHeaders.
- اختبار كل endpoint باستخدام `curl -I https://localhost/api/...` لتحقق من وضع HTTPS.
- مراجعة `services/api-gateway/src/routes/*` لتفادي endpoints غير مستخدمة.

### 2.2 الاعتمادية (Service dependencies)
- فحص `docker‑compose.yml` و`docker‑compose.dev.yml` لتأكد من `depends_on` الصحيح.
- تأكيد أن كل خدمة تُستخدم بـ `--network dallas-food-network`.

### 2.3 رسائل RabbitMQ وتسلسل الأحداث
- تشغيل `infra/rabbitmq/rabbitmq.conf` لتعيين `default_publisher_confirms`.
- التحقق من exchange/queue bindings في `infra/rabbitmq/definitions.json`.
- اختبار بإرسال رسائل اختيارية عبر `docker exec rabbitmq rabbitmqadmin publish` ومراقبة الاستجابة.

### 2.4 إعدادات المعلمات بين الخدمات
- مراجعة `packages/config/src/getAppConfig.ts` لتأكد من وجود قيم ثابتة (`API_URL`, `PAYMENT_ENDPOINT`).
- إدخال `logging` المستوى `debug` للتمكن من رؤية التسلسلات في إنتاج.

### 2.5 انتقال البيانات (.order, .payments, .delivery, .menu, .notification)
- إنشاء فحص DTO بالـ OpenAPI (`docs/API-CONTRACTS.md`).
- تنفيذ `openapi-generator-cli` لتوليد client stubs في كل خدمة.
- مراجعة `services/*/src/types/` لتأكد من توافق الأنواع مع الدокументация.

---

## 3. فحص الواجهات (APIs)
### 3.1 واجهات API للكل الخدمات (REST)
- تشغيل `pnpm lint` على `services/*/src/routes`.
- التحقق من وجود Swagger `responses` مع `200`, `400`, `500` إلخ.
- استخراج مجموعة المعلمات من `docs/000‑reference‑service.md`.

### 3.2 واجهات WebSocket للتتبع في الوقت الحقيقي
- اختبار `services/customer-app/src/pages/OrderTrackingPage.tsx` و`services/kitchen-display/src/pages/*`.
- مراجعة `handshake` في كل خدمة، وتأكيد أن الـ `ws` يتم تشغيله على `wss` في الإنتاج.

### 3.3 مخططات البيانات (DTOs, schemas)
- تشغيل `npm run generate:schemas` لتوليد TypeScript interfaces.
- مراجعة `services/*/src/types/` وضمان عدم وجود Types منحرفة (nullable vs optional).

### 3.4 التوثيق (OpenAPI / Swagger)
- فحص `docs/API-CONTRACTS.md` لتأكد من التطابق مع الـ `README.md` في كل خدمة.
- إنشاء PDF من Swagger (`swagger-cli bundle`) إذا كان مطلوبًا.

### 3.5 واجهات الواجهة الأمامية (Frontend)
- تنفيذ `npm run lint:frontend` في `apps/customer-app/` و`apps/web/`.
- تحليل `apps/web/public/**/*.html` لتحسين SEO (الـ meta tags، robots.txt).
- ضمان وجود `alt` attributes في الصور (`apps/web/public/images/*`).

---

## 4. فحص الثغرات الأمنية
### 4.1 تحقق من الهوية والصلاحيات (JWT, Roles)
- فحص `services/auth/src/middleware/jwt.ts` لوجود `refresh token` و`blacklist`.
- اختبار `services/auth/__tests__/auth.test.tsx` للتأكد من `RBAC` يعمل كما ينبغي.
- إضافة `rate limiting` في الـ API Gateway (`services/api-gateway/src/middlewares/rate‑limit.ts`).

### 4.2 المدخلات (Input validation)
- تشغيل `npm audit` و`pnpm audit` لتحديث الحزم المتوفرة.
- مراجعة `services/*/src/validation.ts` للتحقق من الـ regex للـ email, phone, card number.
- إضافة `zod` أو `yup` للـ schema validation في كل endpoint.

### 4.3 التلاعب بالبيانات (Data injection)
- اختبار إدخال SQL injection عبر `pnpm exec cypress run` على `Order` APIs.
- تشغيل `npm run lint` مع rule `eslint-plugin-security` لتفادي `eval()`.

### 4.4 الاتصالات غير الآمنة (HTTP vs HTTPS)
- مراجعة `nginx.conf` لتأكد أن جميع rewrite تعيد الـ HTTP إلى HTTPS (`return 301 https://$host$request_uri;`).
- تشغيل `openssl s_client -connect localhost:443 -servername localhost` لتأكيد TLS version.

### 4.5 إعدادات الأمان في Docker وKubernetes
- فحص `infra/docker-compose.yml` لإضافة `security_opt: ["no-new-privileges"]`.
- مراجعة `infra/k8s/*.yaml` لتأكيد `readOnlyRootFilesystem: true` و`seccompProfile`.
- تشغيل `docker scan` على كل service image.

### 4.6 ثغرات Node.js المتكدسة
- تشغيل `npm audit fix --force`.
- تأكد أن `NODE_OPTIONS` تحدد `--max-old-space-size=4096` لتجنب OOM.
- إضافة `npm ci` للـ CI pipeline لتفادي تراخيص غير مستقرة.

---

## 5. إجراءات الفحص
### 5.1 تحليل الكود (structure, naming, coverage)
- تشغيل `pnpm run lint:all` لتطبيق ESLint/Typescript rules.
- تشغيل `vitest --coverage` لتوليد `coverage` HTML (`coverage/index.html`).

### 5.2 اختبار السيناريوهات (unit, integration, E2E)
- توسيع `infra/e2e/run‑menu‑e2e.sh` لتشمل جميع الخدمات.
- تشغيل `cypress open` أو `playwright test` لتحليل الـ UI flows.
- إدخال Cases متزامنة للتأكد من عدم وجود Race Conditions.

### 5.3 فحص الأمان (static + runtime)
- تشغيل `npm audit` و`pnpm audit`.
- تنفيذ فحص سلّي عبر `OWASP ZAP` أو `Snyk` على containers (`docker exec zap-cli -cmd`).

### 5.4 تحليل الأداء
- تشغيل `pnpm exec lighthouse http://localhost:3000 --output html --output-path ./reports/web‑report.html`.
- فحص `services/menu/src/cache.ts` لتحسين `TTL` و`Cache‑Control` headers.
- جمع metrics من `infra/monitoring/prometheus.yml` وتكوين Grafana dashboard.

### 5.5 توليد تقرير شامل
- كتابة التقرير النهائي في `docs/PROJECT-REVIEW-REPORT.md` (ستُراجَع الآن).
- إدراج:
  - قائمة جميع الفحوصات المُنجزة.
  - النتائج مع مستويات المخاطر (Critical, High, Medium, Low).
  - توصيات للتحسين (قائمة بالملاحظات + خطوات إصلاح).
  - مخططات الأداء (Charts) وlinks إلى reports.

---

## ✅ التوصيات العامة
1. **الترتيب** – ابدأ بـ “تحليل الكود” ثم “اختبار السيناريوهات” قبل الفحص الأمني لمعرفة نقاط الضعف.
2. **الأدوات المتكاملة** – استخدم `vitest`, `cypress`, `OWASP ZAP`, `Snyk`, `Prometheus`, `Grafana`, `Lighthouse` لتوليد تقارير مخصصة.
3. **المشروع المستمر** – أضف عملية CI/CD automated scan لتطبيقها قبل دمج أي تغيير.
4. **التوثيق** – ربط كل فحص مع ملف توثيقي (مثال: `docs/001‑state‑machine.md`) لتسهيل المراجعة المستقبلية.
5. **متابعة** – مراجعة التقرير مع الفريق وإرساله لل‑stakeholder.

---  

*ملاحظة*: بعد إكمال هذه الخطوات سيتاح لك رفع التقرير إلى المستودع وتحديث `SECURITY.md` وتفعيل عملية `PR` لتطبيق التحسينات.*

---

## تحديثات الأمان الأخيرة (ملخّص التنفيذ)

- تفعيل `ValidationPipe` على مستوى التطبيق في `services/order/src/main.ts` لحظر الحقول غير المعروفة وتحويل الأنواع.
- إضافة `helmet()` وتهيئة CORS مقيدة في خدمة `order` لتحسين رؤوس الأمان ومنع طلبات من مصادر غير موثوقة.
- تقييد إعدادات CORS في `services/api-gateway/src/config/index.ts` لاستخدام قائمة origins آمنة بدلاً من '*'، وإضافة ملف أمثلة `.env.example` للاعدادات الإنتاجية.
- تفعيل `helmet` وrate-limiting وmiddleware مرتبطة في `services/api-gateway/src/server.ts` (موجودة بالفعل) وضمان استخدام Redis store في الإنتاج إذا توفر.
- إضافة تعليق أمني في `infra/docker-compose.yml` يحذر من استخدام كلمات مرور افتراضية ووضع مثال `infra/k8s/order-secret.yaml` يوضح كيفية استخدام Kubernetes Secret بدلاً من القيم الصريحة.
- تحديث `infra/nginx/conf.d/api.conf` لإظهار مثال إعداد HTTPS وشروط استخدام شهادات TLS في الإنتاج.

### الملفات التي تم تعديلها

- `services/order/src/main.ts` — تفعيل `ValidationPipe`, `helmet`, و`enableCors` مقيدة.
- `services/api-gateway/src/config/index.ts` — تقييد قيمة `cors.origin` لقبول قائمة origins من متغير البيئة.
- `infra/docker-compose.yml` — تعليق تحذيري حول secrets.
- `infra/k8s/order-secret.yaml` — مثال Secret لكيفية تمثيل القيم الحساسة في K8s.
- `infra/nginx/conf.d/api.conf` — مثال تفعيل HTTPS وتعليقات توجيهية.

### الخطوات المتبقية المقترحة

1. تحديث `SECURITY.md` بإجراءات إدارة أسرار الـ CI/CD وواتساب الوصول إلى المفاتيح.
2. إنشاء عملية CI التي تتضمن: `pnpm audit`, `OWASP ZAP scan`, و`docker scan` قبل الـ release.
3. استبدال الأمثلة الافتراضية في `docker-compose` بقيم من Secrets في بيئات staging/production.
4. تنفيذ وتحقق من HTTPS على بيئة staging قبل سحب الشهادات الحقيقية إلى الإنتاج.

---

> تم رفع التغييرات إلى الفرع الحالي بعد تحديث المستندات والملفات ذات الصلة.