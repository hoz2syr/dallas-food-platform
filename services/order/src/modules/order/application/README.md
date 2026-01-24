Order Application Layer
=======================

The application layer implements use cases (application services) that orchestrate domain objects to fulfill business scenarios. It depends on the domain model but contains no framework or persistence code.

This folder contains commands and use-cases. Use-cases should be plain TypeScript classes that accept input (commands), manipulate domain aggregates, and return results or domain events.

No NestJS, repositories, or external integrations are present here to keep the layer testable and decoupled.
