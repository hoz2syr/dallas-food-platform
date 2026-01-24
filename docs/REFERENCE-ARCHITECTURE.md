# Dallas Food Platform — Reference Architecture

Purpose
-------

The Dallas Food Platform is a hybrid, service-based system that composes small backend services to provide ordering, inventory, user management, and related capabilities. The platform emphasizes clear separation of concerns, testability, and the ability to run services independently in development and production.

High-level system architecture
------------------------------

- Hybrid, service-based: each backend capability is implemented as an independent service (microservice-style) that can be developed, tested, deployed, and scaled independently.
- Services communicate over well-defined APIs (HTTP/REST for synchronous flows) and may emit domain events for asynchronous processing.
- Infrastructure (datastores, message brokers) is composed per-environment; services should remain platform-agnostic and interact with infrastructure through adapters.

Clean Architecture layers
-------------------------

This repository follows the Clean Architecture approach. Services are organized into three primary layers:

- Domain: business entities, value objects, domain events, and domain-specific rules. No external dependencies.
- Application: use-cases, commands, and orchestration logic that implement application workflows. Coordinates domain and infrastructure boundaries via well-defined interfaces.
- Infrastructure: framework and platform-specific code — controllers, repositories, external API clients, database implementations, and DI wiring. Maps domain errors to transport-level responses.

Why the Order Service is the reference
-------------------------------------

The `services/order` implementation is the canonical example of the above structure in this workspace. It demonstrates:

- A minimal NestJS bootstrap with a thin HTTP controller.
- A domain model separated from persistence and HTTP adapters.
- Both an in-memory repository and a Postgres-backed repository implementation.
- A small set of unit tests exercising domain and application logic.

Teams should use the Order Service as the starting point (reference) when creating new backend services for the platform.
