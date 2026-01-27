# 0001 - Hybrid Core + Independent Services Architecture

Status: proposed

Context
-------
We need an architecture that balances operational consistency for critical domains and autonomy for specialized services. A hybrid model provides a central core for critical data and cross-cutting concerns while allowing independent services to iterate quickly.

Decision
--------
Adopt a hybrid architecture: a central core (orders, core customer data, core products/pricing) with independent specialized services (delivery, kitchen, notifications, analytics). Services communicate via well-defined APIs and events. Use centralized governance for security, observability, and deployment standards.

Consequences
------------
- Pros: consistency for critical flows, faster iteration for specialist teams, easier cross-cutting policy enforcement.
- Cons: added operational complexity, need for robust integration testing and messaging infrastructure.