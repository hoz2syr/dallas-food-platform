
# Reference Architecture: Clean Architecture for Services

This document defines the reference architecture for all backend services in the Dallas Food Platform, using Clean Architecture principles. The `order-service` is the canonical example for structure and best practices.

---

## Clean Architecture Layers

1. **Domain Layer**
	 - Pure business logic, domain models, and rules
	 - No dependencies on frameworks or infrastructure

2. **Application Layer**
	 - Use cases, service interfaces, and orchestration logic
	 - Coordinates domain logic and infrastructure

3. **Infrastructure Layer**
	 - Frameworks, adapters, database access, external APIs, messaging
	 - Implements interfaces defined in the application layer

---

## Rationale

- **Separation of Concerns:** Business logic is isolated from frameworks and infrastructure
- **Testability:** Domain and application logic are easily unit tested
- **Flexibility:** Infrastructure (DB, messaging, APIs) can be swapped with minimal impact

---

## Service Folder Structure Example

```
src/
	domain/
		models.ts
		...
	application/
		use-cases/
		services/
		...
	infrastructure/
		db/
		api/
		...
```

---

## Best Practices

- Keep domain logic pure and framework-agnostic
- Application layer should not depend on infrastructure details
- Infrastructure implements interfaces from the application layer
- Use dependency injection for infrastructure components
- Favor composition over inheritance

---

## Why the Order Service is the Reference

The `services/order` implementation is the canonical example of this structure. It demonstrates:

- Minimal NestJS bootstrap with a thin HTTP controller
- Domain model separated from persistence and HTTP adapters
- Both in-memory and Postgres-backed repository implementations
- Unit tests for domain and application logic

Teams should use the Order Service as a starting point when creating new backend services for the platform.

---

## See Also

- [ARCHITECTURE_OVERVIEW.md](./ARCHITECTURE_OVERVIEW.md)
- [SERVICE-BLUEPRINT.md](./SERVICE-BLUEPRINT.md)
