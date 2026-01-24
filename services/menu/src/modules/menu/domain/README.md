# Menu Domain
Notes
- This is a structural skeleton — behavior (methods, use-cases) will be added later in subsequent steps.
- No persistence, framework, or transport-specific code should be added here.

Error model
-----------

Domain errors live alongside entities and value objects. They express business rule violations in a technology-agnostic way so the application and infrastructure layers can react appropriately (map to HTTP responses, retries, etc.).

Current domain errors:
- `InvalidMenuNameError` — thrown when a menu's name is invalid (empty).
- `EmptyMenuItemsError` — thrown when a menu has no items.

The application layer is expected to let these errors propagate or handle them explicitly where necessary; infrastructure code is responsible for translating domain errors to transport-level responses.

Repository boundary
-------------------

The repository interface is defined in the domain layer as a pure TypeScript interface. It represents the persistence boundary: domain logic depends on the abstraction, not on any specific database or ORM. Implementations live in the infrastructure layer and are wired at composition time.

Why in domain?
- Keeping the repository contract in the domain enforces the dependency inversion principle: higher-level domain logic depends on abstractions it defines, not on concrete implementations.

Why no implementation yet?
- This service scaffold introduces the boundary now; concrete persistence implementations (in-memory, SQL, or other) will be added in later steps in the infrastructure layer.

```
