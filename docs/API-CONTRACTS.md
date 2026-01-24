# API Contracts & Examples

This file documents the stable API contracts for the platform services.

## Common

- Required header: `x-api-key` (value provided via `API_KEY` environment variable)
- Error format for unauthorized requests:

```json
{ "error": "UNAUTHORIZED", "message": "Invalid API key" }
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
