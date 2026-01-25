# API Contracts & Examples

This file documents the stable API contracts for the platform services.

## Common

- Required header: `x-api-key` (value provided via `API_KEY` environment variable)
- Error format for unauthorized requests:

### Standard Error Response

All error responses follow a consistent JSON shape:

```json
{
  "code": "<ERROR_CODE>",
  "message": "Human readable message",
  "details": { /* optional extra information */ }
}
```

The `code` is a short machine-friendly identifier (e.g. `EmptyOrderItemsError`, `InvalidMenuNameError`, or `INTERNAL_ERROR`).

Examples:

- Bad request due to empty order items:

```json
{ "code": "EmptyOrderItemsError", "message": "Order must contain at least one item" }
```

- Internal error fallback:

```json
{ "code": "INTERNAL_ERROR", "message": "An internal error occurred" }
```

- Unauthorized (missing or invalid API key):

```json
{ "code": "UNAUTHORIZED", "message": "Invalid API key" }
```

---

## Order Service

- Base URL (local): http://localhost:3000
- Endpoints:

### POST /orders

- Description: Place a new order
- Request headers:
  - `x-api-key: <key>`
- Request body example:

```json
{ "orderId": "o1", "items": ["p1", "p2"] }
```
- Successful response (200) example:

```json
{ "id": "o1", "status": "PENDING", "createdAt": "2026-01-01T00:00:00.000Z" }
```

---

## Menu Service

- Base URL (local): http://localhost:3001
- Endpoints:

### POST /menus

- Description: Create a new menu
- Request headers:
  - `x-api-key: <key>`
- Request body example:

```json
{ "menuId": "m1", "name": "Lunch", "items": [{ "id": "i1", "name": "Burger", "price": 5 }] }
```
- Successful response (200) example:

```json
{ "id": "m1", "name": "Lunch", "createdAt": "2026-01-01T00:00:00.000Z" }
```
