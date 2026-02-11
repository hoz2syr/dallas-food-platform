# ZIP Code Usage in Dallas Food Platform

## Overview

ZIP Codes are a fundamental component of the Dallas Food Platform for determining delivery locations, calculating shipping fees, and providing services to customers in different areas.

## What is a ZIP Code?

A ZIP Code (Zone Improvement Plan Code) is a postal code system used in the United States to identify geographical areas. In Dallas, Texas, ZIP codes typically start with 75 or 76.

### Examples of Dallas ZIP Codes:

- **75201** - Downtown Dallas
- **75202** - Central Business District
- **75203** - East Dallas
- **75204** - Uptown/Victory Park
- **75205** - Highland Park
- **75219** - Turtle Creek
- **75220** - Northwest Dallas
- **75230** - North Dallas
- **75240** - Richardson
- **75248** - Far North Dallas

## Platform Usage

### 1. Service Area Verification

The platform uses ZIP codes to verify that a customer's address falls within the available delivery area:

```typescript
// Example ZIP code verification
function isServiceable(zipCode: string): boolean {
  const dallasZipCodes = ['75201', '75202', '75203', '75204', '75205'];
  return dallasZipCodes.includes(zipCode);
}
```

### 2. Delivery Fee Calculation

ZIP codes are used to calculate distance and determine delivery fees:

```typescript
// Example delivery fee calculation based on ZIP code
function calculateDeliveryFee(zipCode: string): number {
  const distanceZones = {
    zone1: ['75201', '75202', '75203'], // Low fee: $5
    zone2: ['75204', '75205', '75219'], // Medium fee: $7
    zone3: ['75220', '75230', '75240']  // High fee: $10
  };
  
  if (distanceZones.zone1.includes(zipCode)) return 5;
  if (distanceZones.zone2.includes(zipCode)) return 7;
  if (distanceZones.zone3.includes(zipCode)) return 10;
  return 15; // Outside usual zones
}
```

### 3. Restaurant Availability Customization

The platform displays available restaurants based on the customer's ZIP code:

```typescript
// Example restaurant filtering by ZIP code
function getAvailableRestaurants(zipCode: string) {
  return restaurants.filter(restaurant => {
    return restaurant.serviceZipCodes.includes(zipCode);
  });
}
```

### 4. Delivery Time Estimation

ZIP codes help estimate expected delivery times:

```typescript
// Example delivery time estimation
function estimateDeliveryTime(zipCode: string): number {
  const baseTime = 20; // 20 minutes base time
  const distanceMultiplier = calculateDistanceMultiplier(zipCode);
  return baseTime + (distanceMultiplier * 5);
}
```

## Technical Architecture

### Data Models

```typescript
interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;      // ZIP Code
  country: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

interface DeliveryZone {
  id: string;
  name: string;
  zipCodes: string[];   // List of ZIP codes in this zone
  deliveryFee: number;  // Delivery fee
  estimatedTime: number; // Estimated time in minutes
}
```

### ZIP Code Validation

```typescript
// Function to validate US ZIP code format
function validateZipCode(zipCode: string): boolean {
  // US ZIP code: 5 digits or 5+4 digits
  const zipCodeRegex = /^\d{5}(-\d{4})?$/;
  return zipCodeRegex.test(zipCode);
}

// Function to verify ZIP code is in Dallas area
function isDallasZipCode(zipCode: string): boolean {
  const prefix = zipCode.substring(0, 2);
  return prefix === '75' || prefix === '76';
}
```

## Service Integration

### 1. Delivery Service

```typescript
// services/delivery/src/domain/zip-code.service.ts
export class ZipCodeService {
  async getDeliveryOptions(zipCode: string) {
    // Validate ZIP code format
    if (!this.validateZipCode(zipCode)) {
      throw new InvalidZipCodeError('Invalid ZIP code format');
    }
    
    // Check service area
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

### 2. Menu Service

```typescript
// services/menu/src/application/restaurant.service.ts
export class RestaurantService {
  async getRestaurantsByZipCode(zipCode: string) {
    // Find restaurants serving this ZIP code
    return await this.restaurantRepository.findByServiceArea(zipCode);
  }
}
```

### 3. Order Service

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

## Best Practices

### 1. Caching

```typescript
// Use Redis for ZIP code data caching
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

### 2. Error Handling

```typescript
// Define custom errors for ZIP codes
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

### 3. Logging and Monitoring

```typescript
// Log ZIP code queries for analysis
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

### Get Delivery Zone Information

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

### Check Service Availability

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

## Database

### Delivery Zones Table

```sql
CREATE TABLE delivery_zones (
  id UUID PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  zip_codes TEXT[] NOT NULL,  -- Array of ZIP codes
  delivery_fee DECIMAL(10, 2) NOT NULL,
  estimated_time_minutes INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for fast ZIP code searches
CREATE INDEX idx_delivery_zones_zip_codes ON delivery_zones USING GIN(zip_codes);
```

### Order History by ZIP Code Table

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

## Testing

### Unit Tests

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

### Integration Tests

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

## Future Enhancements

### 1. Google Maps API Integration

```typescript
// Use Google Maps Geocoding API for accurate information
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

### 2. Smart Delivery

```typescript
// Intelligent algorithm to optimize delivery routes based on ZIP codes
class SmartDeliveryRouter {
  async optimizeRoute(orders: Order[]) {
    // Group orders by ZIP code
    const groupedByZip = this.groupByZipCode(orders);
    
    // Optimize route using nearest neighbor algorithm
    return this.nearestNeighborOptimization(groupedByZip);
  }
}
```

### 3. Demand Prediction

```typescript
// Predict demand in different areas based on ZIP codes
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

## Summary

ZIP codes are a critical component in the Dallas Food Platform, used for:

1. ✅ Determining available service areas
2. ✅ Calculating delivery fees
3. ✅ Estimating delivery times
4. ✅ Customizing available restaurants
5. ✅ Optimizing delivery routes
6. ✅ Market and demand analysis

Through proper implementation of a ZIP code system, the platform provides a seamless and reliable experience for customers throughout the Dallas area.

## Additional References

- [USPS ZIP Code Lookup](https://tools.usps.com/zip-code-lookup.htm)
- [Dallas ZIP Codes Map](https://www.unitedstateszipcodes.org/tx/#zips-list)
- [Google Maps Platform Documentation](https://developers.google.com/maps/documentation)
- [PostgreSQL Array Functions](https://www.postgresql.org/docs/current/functions-array.html)

---

**Last Updated:** February 2026  
**Version:** 1.0.0
