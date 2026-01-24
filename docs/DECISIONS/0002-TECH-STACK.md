# ADR 0002: Technology Stack Selection

Status: Accepted

Decision:

- Language: TypeScript
- Runtime: Node.js (LTS)
- Backend framework direction: NestJS
- Package manager: pnpm
- API style: REST-first, event-ready
- Infra baseline: Docker (local-first)

Context:

The platform requires rapid feature development, strong type-safety, good developer experience, and smooth integration with containerized infrastructure and event-driven patterns. The chosen stack aligns with these requirements and the hybrid core + services approach.

Alternatives considered and rejected:

- Python / FastAPI — excellent for quick prototypes and async workloads, but team prefers TypeScript for end-to-end typing and a unified ecosystem.
- Java / Spring — robust and battle-tested for large systems but heavier to iterate and maintain for fast-moving teams.
- Go — high performance and simple runtime but higher development cost for teams focused on rapid feature delivery.

Consequences:

- Positives: strong type-safety across stack, large ecosystem, high developer productivity, easy Docker support, good cloud and serverless integration.
- Trade-offs: Node.js single-threaded nature requires care for CPU-bound work; NestJS introduces an abstraction layer and learning curve; pnpm adoption requires CI/tooling awareness.
