# Shared Package (packages/shared)

## Purpose
تجميع الأدوات والأنواع والمكتبات المشتركة بين الخدمات لتقليل التكرار وتعزيز الاتساق.

## Structure
- `auth/` — أدوات الحماية والمصادقة (مثل ApiKeyGuard)
- `errors/` — أنواع وأدوات معالجة الأخطاء الموحدة
- `types/` — أنواع TypeScript مشتركة

## Example Usage
```ts
import { ApiKeyGuard } from '@dallas/shared/auth/api-key.guard';
import { makeApiError } from '@dallas/shared/errors/api-error';
```

## Extending
- أضف أدوات أو أنواع متكررة الاستخدام هنا مع توثيق واضح.
