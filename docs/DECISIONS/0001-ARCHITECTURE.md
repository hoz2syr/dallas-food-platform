# ADR 0001: Architecture Decision — Hybrid model

Status: Accepted

Decision: Adopt the "Hybrid core + services" architecture.

Context:
- We need to balance platform-wide concerns (security, observability) with rapid service development.

Decision and Justification:
- Use a small central core for shared policy and tooling plus autonomous services for domain logic.
- This reduces duplicated effort, enforces standards, and keeps services small and independently deployable.

Consequences:
- Faster iteration for teams owning services.
- Need clear interfaces and governance for the core APIs.

Related:
- See original architecture document: docs/ARCHITECTURE_OVERVIEW.md