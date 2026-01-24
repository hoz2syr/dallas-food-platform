Order Domain
============

This folder contains the pure domain model for the Order aggregate.

Aggregate Root
--------------

`Order` is the aggregate root that encapsulates order state and behavior. It exposes behaviors such as `place()` and `cancel()` which mutate in-memory state and (optionally) produce domain events.

Why no persistence or framework code?
----------------------------------

The domain layer is intentionally framework-agnostic: it contains business rules, invariants, and events only. Persistence, messaging, and framework adapters live in the infrastructure layer to keep the domain pure and easily testable.

Error Model
-----------

Domain errors are defined in the `errors` folder and express business-rule violations (for example, `EmptyOrderItemsError` and `InvalidOrderStateError`). Keeping errors in the domain ensures that the domain speaks its own language and that higher layers (application/controllers) can map these errors to appropriate responses or retries.

The application layer should allow domain errors to propagate so they can be handled in a context-aware manner (e.g., translated into HTTP responses or retries by an orchestration layer).

Repository Boundary
-------------------

The `repositories` folder defines interfaces that represent the persistence boundary (for example, `OrderRepository`). These interfaces live in the domain to express the required operations against aggregates without coupling the domain to any storage technology. Implementations of these interfaces belong in the infrastructure layer (adapters) and are intentionally omitted here.
