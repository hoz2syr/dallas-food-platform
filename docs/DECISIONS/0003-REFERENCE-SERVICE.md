# ADR 0003 — Order Service as Reference Implementation

Status: accepted

Context
-------

As the platform grows, we need a single, well-understood, and maintained reference implementation that demonstrates the project's architectural and coding standards.

Decision
--------

The `services/order` service is the canonical reference implementation for backend services in this repository. All new backend services MUST follow the folder layout, layering, and rules defined in `docs/SERVICE-BLUEPRINT.md`.

Consequences
------------

- Positive
  - Consistent structure across services improves onboarding, code reviews, and cross-team collaboration.
  - Easier to automate common tasks (linting, building, testing) because services share conventions.

- Constraints
  - All new services must adhere to the blueprint; deviations require a new ADR explaining trade-offs.
  - The reference implementation is documentation-first: changes to the reference must be deliberate and accompanied by an ADR when they alter structure or conventions.
