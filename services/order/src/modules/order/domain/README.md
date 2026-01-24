Order Domain
============

This folder contains the pure domain model for the Order aggregate.

Aggregate Root
--------------

`Order` is the aggregate root that encapsulates order state and behavior. It exposes behaviors such as `place()` and `cancel()` which mutate in-memory state and (optionally) produce domain events.

Why no persistence or framework code?
----------------------------------

The domain layer is intentionally framework-agnostic: it contains business rules, invariants, and events only. Persistence, messaging, and framework adapters live in the infrastructure layer to keep the domain pure and easily testable.
