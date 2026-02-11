# شرح استخدام الأكواد البريدية (ZIP Codes) في منصة دالاس للطعام

## نظرة عامة

الأكواد البريدية (ZIP Codes) هي عنصر أساسي في منصة دالاس للطعام لتحديد مواقع التوصيل وحساب رسوم الشحن وتقديم الخدمات للعملاء في مناطق مختلفة.

## ما هو الكود البريدي؟

الكود البريدي (ZIP Code) هو نظام ترميز بريدي يُستخدم في الولايات المتحدة الأمريكية لتحديد المناطق الجغرافية. في منطقة دالاس، تكساس، تبدأ الأكواد البريدية بالأرقام 75 أو 76.

### أمثلة على أكواد دالاس البريدية:

- **75201** - وسط مدينة دالاس (Downtown Dallas)
- **75202** - منطقة الأعمال المركزية
- **75203** - منطقة East Dallas
- **75204** - منطقة Uptown/Victory Park
- **75205** - منطقة Highland Park
- **75219** - منطقة Turtle Creek
- **75220** - منطقة Northwest Dallas
- **75230** - منطقة North Dallas
- **75240** - منطقة Richardson
- **75248** - منطقة Far North Dallas

## الاستخدام في المنصة

### 1. التحقق من منطقة الخدمة

تستخدم المنصة الأكواد البريدية للتحقق من أن عنوان العميل يقع ضمن منطقة التوصيل المتاحة:

```typescript
// مثال على التحقق من الكود البريدي
function isServiceable(zipCode: string): boolean {
  const dallasZipCodes = ['75201', '75202', '75203', '75204', '75205'];
  return dallasZipCodes.includes(zipCode);
}
```

### 2. حساب رسوم التوصيل

يتم استخدام الكود البريدي لحساب المسافة وتحديد رسوم التوصيل:

```typescript
// مثال على حساب رسوم التوصيل حسب الكود البريدي
function calculateDeliveryFee(zipCode: string): number {
  const distanceZones = {
    zone1: ['75201', '75202', '75203'], // رسوم منخفضة: 5 دولار
    zone2: ['75204', '75205', '75219'], // رسوم متوسطة: 7 دولار
    zone3: ['75220', '75230', '75240']  // رسوم عالية: 10 دولار
  };
  
  if (distanceZones.zone1.includes(zipCode)) return 5;
  if (distanceZones.zone2.includes(zipCode)) return 7;
  if (distanceZones.zone3.includes(zipCode)) return 10;
  return 15; // خارج المناطق المعتادة
}
```

### 3. تخصيص المطاعم المتاحة

تعرض المنصة المطاعم المتاحة بناءً على الكود البريدي للعميل:

```typescript
// مثال على تصفية المطاعم حسب الكود البريدي
function getAvailableRestaurants(zipCode: string) {
  return restaurants.filter(restaurant => {
    return restaurant.serviceZipCodes.includes(zipCode);
  });
}
```

### 4. تقدير وقت التوصيل

يساعد الكود البريدي في تقدير الوقت المتوقع للتوصيل:

```typescript
// مثال على تقدير وقت التوصيل
function estimateDeliveryTime(zipCode: string): number {
  const baseTime = 20; // 20 دقيقة كوقت أساسي
  const distanceMultiplier = calculateDistanceMultiplier(zipCode);
  return baseTime + (distanceMultiplier * 5);
}
```

## البنية التقنية

### نموذج البيانات

```typescript
interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;      // الكود البريدي
  country: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

interface DeliveryZone {
  id: string;
  name: string;
  zipCodes: string[];   // قائمة الأكواد البريدية في هذه المنطقة
  deliveryFee: number;  // رسوم التوصيل
  estimatedTime: number; // الوقت المقدر بالدقائق
}
```

### التحقق من صحة الكود البريدي

```typescript
// دالة للتحقق من صحة الكود البريدي الأمريكي
function validateZipCode(zipCode: string): boolean {
  // الكود البريدي الأمريكي: 5 أرقام أو 5+4 أرقام
  const zipCodeRegex = /^\d{5}(-\d{4})?$/;
  return zipCodeRegex.test(zipCode);
}

// دالة للتحقق من أن الكود البريدي في منطقة دالاس
function isDallasZipCode(zipCode: string): boolean {
  const prefix = zipCode.substring(0, 2);
  return prefix === '75' || prefix === '76';
}
```

## التكامل مع الخدمات

### 1. خدمة التوصيل (Delivery Service)

```typescript
// services/delivery/src/domain/zip-code.service.ts
export class ZipCodeService {
  async getDeliveryOptions(zipCode: string) {
    // التحقق من صحة الكود البريدي
    if (!this.validateZipCode(zipCode)) {
      throw new InvalidZipCodeError('Invalid ZIP code format');
    }
    
    // التحقق من منطقة الخدمة
    const zone = await this.findZone(zipCode);
    if (!zone) {
      throw new ServiceUnavailableError('Service not available in this area');
    }
    
    return {
      deliveryFee: zone.deliveryFee,
      estimatedTime: zone.estimatedTime,
      availableSlots: await this.getAvailableTimeSlots(zone)
    };
  }
}
```

### 2. خدمة القوائم (Menu Service)

```typescript
// services/menu/src/application/restaurant.service.ts
export class RestaurantService {
  async getRestaurantsByZipCode(zipCode: string) {
    // البحث عن المطاعم التي تخدم هذا الكود البريدي
    return await this.restaurantRepository.findByServiceArea(zipCode);
  }
}
```

### 3. خدمة الطلبات (Order Service)

```typescript
// services/order/src/domain/order.entity.ts
export class Order {
  // ...
  deliveryAddress: {
    street: string;
    zipCode: string;
    // ...
  };
  
  async calculateTotalWithDelivery() {
    const deliveryFee = await deliveryService.getFee(
      this.deliveryAddress.zipCode
    );
    return this.subtotal + deliveryFee;
  }
}
```

## أفضل الممارسات

### 1. التخزين المؤقت (Caching)

```typescript
// استخدام Redis للتخزين المؤقت لبيانات الأكواد البريدية
import { Injectable } from '@nestjs/common';
import { RedisService } from './redis.service';

@Injectable()
export class ZipCodeCacheService {
  constructor(private redis: RedisService) {}
  
  async getZoneInfo(zipCode: string) {
    const cacheKey = `zipcode:${zipCode}`;
    const cached = await this.redis.get(cacheKey);
    
    if (cached) {
      return JSON.parse(cached);
    }
    
    const zoneInfo = await this.fetchZoneInfo(zipCode);
    await this.redis.setex(cacheKey, 3600, JSON.stringify(zoneInfo));
    
    return zoneInfo;
  }
}
```

### 2. معالجة الأخطاء

```typescript
// تعريف أخطاء مخصصة للأكواد البريدية
export class InvalidZipCodeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidZipCodeError';
  }
}

export class ServiceUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ServiceUnavailableError';
  }
}
```

### 3. التسجيل والمراقبة

```typescript
// تسجيل استعلامات الأكواد البريدية للتحليل
@Injectable()
export class ZipCodeAnalytics {
  async logZipCodeQuery(zipCode: string, result: 'success' | 'unavailable') {
    await this.analyticsService.track({
      event: 'zip_code_query',
      properties: {
        zipCode,
        result,
        timestamp: new Date()
      }
    });
  }
}
```

## API Endpoints

### الحصول على معلومات منطقة التوصيل

```http
GET /api/delivery/zones/{zipCode}

Response:
{
  "zipCode": "75201",
  "serviceable": true,
  "zone": {
    "id": "zone-downtown",
    "name": "Downtown Dallas",
    "deliveryFee": 5.00,
    "estimatedTime": 25,
    "currency": "USD"
  },
  "restaurants": 45
}
```

### التحقق من توفر الخدمة

```http
POST /api/delivery/check-availability

Request:
{
  "zipCode": "75201"
}

Response:
{
  "available": true,
  "message": "Service available in your area",
  "nextAvailableSlot": "2026-02-11T18:00:00Z"
}
```

## قاعدة البيانات

### جدول مناطق التوصيل

```sql
CREATE TABLE delivery_zones (
  id UUID PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  zip_codes TEXT[] NOT NULL,  -- مصفوفة من الأكواد البريدية
  delivery_fee DECIMAL(10, 2) NOT NULL,
  estimated_time_minutes INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- فهرس للبحث السريع في الأكواد البريدية
CREATE INDEX idx_delivery_zones_zip_codes ON delivery_zones USING GIN(zip_codes);
```

### جدول تاريخ الطلبات حسب الكود البريدي

```sql
CREATE TABLE order_zip_code_stats (
  zip_code VARCHAR(10) PRIMARY KEY,
  total_orders INTEGER DEFAULT 0,
  total_revenue DECIMAL(15, 2) DEFAULT 0,
  average_delivery_time INTEGER,
  last_order_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## الاختبارات

### اختبارات الوحدة

```typescript
// tests/unit/zip-code.service.spec.ts
describe('ZipCodeService', () => {
  let service: ZipCodeService;
  
  beforeEach(() => {
    service = new ZipCodeService();
  });
  
  describe('validateZipCode', () => {
    it('should accept valid 5-digit ZIP codes', () => {
      expect(service.validateZipCode('75201')).toBe(true);
    });
    
    it('should accept valid ZIP+4 codes', () => {
      expect(service.validateZipCode('75201-4567')).toBe(true);
    });
    
    it('should reject invalid ZIP codes', () => {
      expect(service.validateZipCode('1234')).toBe(false);
      expect(service.validateZipCode('abcde')).toBe(false);
    });
  });
  
  describe('isDallasZipCode', () => {
    it('should identify Dallas ZIP codes', () => {
      expect(service.isDallasZipCode('75201')).toBe(true);
      expect(service.isDallasZipCode('76001')).toBe(true);
    });
    
    it('should reject non-Dallas ZIP codes', () => {
      expect(service.isDallasZipCode('90210')).toBe(false);
    });
  });
});
```

### اختبارات التكامل

```typescript
// tests/integration/delivery-zone.spec.ts
describe('Delivery Zone API', () => {
  it('should return zone info for valid ZIP code', async () => {
    const response = await request(app)
      .get('/api/delivery/zones/75201')
      .expect(200);
    
    expect(response.body).toHaveProperty('serviceable', true);
    expect(response.body.zone).toHaveProperty('deliveryFee');
  });
  
  it('should return unavailable for unsupported ZIP code', async () => {
    const response = await request(app)
      .get('/api/delivery/zones/99999')
      .expect(200);
    
    expect(response.body).toHaveProperty('serviceable', false);
  });
});
```

## التوسع المستقبلي

### 1. التكامل مع Google Maps API

```typescript
// استخدام Google Maps Geocoding API للحصول على معلومات دقيقة
async function enrichZipCodeData(zipCode: string) {
  const response = await googleMapsClient.geocode({
    params: {
      address: zipCode,
      key: process.env.GOOGLE_MAPS_API_KEY
    }
  });
  
  return {
    zipCode,
    location: response.data.results[0].geometry.location,
    formattedAddress: response.data.results[0].formatted_address
  };
}
```

### 2. التوصيل الذكي

```typescript
// خوارزمية ذكية لتحسين مسارات التوصيل بناءً على الأكواد البريدية
class SmartDeliveryRouter {
  async optimizeRoute(orders: Order[]) {
    // تجميع الطلبات حسب الكود البريدي
    const groupedByZip = this.groupByZipCode(orders);
    
    // تحسين المسار باستخدام خوارزمية الجار الأقرب
    return this.nearestNeighborOptimization(groupedByZip);
  }
}
```

### 3. التنبؤ بالطلب

```typescript
// التنبؤ بالطلب في مناطق مختلفة بناءً على الأكواد البريدية
class DemandPrediction {
  async predictDemand(zipCode: string, datetime: Date) {
    const historicalData = await this.getHistoricalOrders(zipCode);
    const weatherData = await this.getWeatherForecast(zipCode, datetime);
    
    return this.mlModel.predict({
      zipCode,
      datetime,
      historicalData,
      weatherData
    });
  }
}
```

## الخلاصة

الأكواد البريدية هي عنصر حاسم في منصة دالاس للطعام، حيث تُستخدم في:

1. ✅ تحديد مناطق الخدمة المتاحة
2. ✅ حساب رسوم التوصيل
3. ✅ تقدير أوقات التوصيل
4. ✅ تخصيص المطاعم المتاحة
5. ✅ تحسين مسارات التوصيل
6. ✅ تحليل السوق والطلب

من خلال التنفيذ السليم لنظام الأكواد البريدية، توفر المنصة تجربة سلسة وموثوقة للعملاء في جميع أنحاء منطقة دالاس.

## مراجع إضافية

- [USPS ZIP Code Lookup](https://tools.usps.com/zip-code-lookup.htm)
- [Dallas ZIP Codes Map](https://www.unitedstateszipcodes.org/tx/#zips-list)
- [Google Maps Platform Documentation](https://developers.google.com/maps/documentation)
- [PostgreSQL Array Functions](https://www.postgresql.org/docs/current/functions-array.html)

---

**آخر تحديث:** فبراير 2026  
**الإصدار:** 1.0.0
