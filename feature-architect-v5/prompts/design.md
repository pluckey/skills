# Design Roundtable Prompt

## Inputs Required

- `[center]` — the center sentence
- `[requirements-content]` — full requirements.md content
- `[whiteboard-content]` — full whiteboard.md content
- `[context-module]` — full context module content, or "greenfield"
- `[constraints]` — user's stated constraints/preferences

---

You are conducting an expert roundtable to design the system decomposition for a feature.

PANEL (fixed roster — do not substitute):
- **Robert C. Martin (Uncle Bob)** — SOLID principles, clean architecture, component cohesion
- **Martin Fowler** — refactoring, enterprise patterns, evolutionary design
- **Kent Beck** — extreme programming, simple design, test-driven development

Each panelist speaks IN CHARACTER with their intellectual framework. Introduce each with credentials before they speak.

You MUST use the sequential-thinking MCP tool. Each expert speaks in turn for AT LEAST 3 rounds. Set nextThoughtNeeded: true until all experts have spoken AND a synthesis has been produced.

QUESTION: "Given these requirements, what's the cleanest decomposition, and what could go wrong architecturally?"

CENTER: "[center]" — every design element must strengthen this center.

ARCHITECTURAL ALIGNMENT — Clean Architecture:
All design decisions must respect the Dependency Rule: source code dependencies point INWARD. Specifically:
- **Entities** (domain models, business rules) depend on nothing
- **Use cases** (application logic) depend only on entities
- **Interface adapters** (controllers, presenters, gateways) depend on use cases
- **Frameworks/infrastructure** (DB, UI, external services) are outermost — the system depends on abstractions, not on them
- Boundaries are crossed via dependency inversion (interfaces defined by the inner layer, implemented by the outer)
- If a design element violates the Dependency Rule, the panel must flag it and propose the inversion

CODEBASE GROUNDING:
Before deliberating, the panel must study the context module AND the actual codebase to understand existing boundaries, module structure, and naming conventions. Design atoms must align with the project's existing architectural grain — extend it, don't fight it. If the existing structure violates Clean Architecture, flag it but don't refactor it as part of this spec.

INPUT:
- Requirements: [requirements-content]
- Whiteboard: [whiteboard-content]
- Context module: [context-module]
- Constraints: [constraints]

EMBEDDED CHALLENGE (experts must address during deliberation):
- Does every design element trace to a requirement?
- Anything gold-plated? (design element with no AC)
- Any requirement already satisfied by platform/framework defaults?
- Any requirement infeasible? Flag for user.
- For each design element: how does it strengthen the center? If the connection is indirect, flag for scope review.
- Does the decomposition respect the Dependency Rule? Are boundaries crossed cleanly?
- Would Uncle Bob sign off on the dependency graph?

OUTPUT — produce ALL of the following sections:

**System Decomposition**: Atoms to create/modify, using context module's decomposition patterns. Table format:

| ID | Name | Type | Action | Key Attributes | Traces to ACs |
|----|------|------|--------|---------------|---------------|
| da-{id} | {name} | {type} | {Create/Modify/Preserve} | {key attributes} | {ac-id, ac-id} |

**Relationship Map**: How atoms connect. Embed da-* IDs.
**Behavior Plan**: Custom behavior beyond defaults. Trace each to a specific ac-* ID.
**UI Plan**: What the user sees (if applicable).
**Data Plan**: Seed data, migrations, schemas (if applicable).
**Integration Plan**: External services, APIs (if applicable).
**Verification Strategy**: Map each ac-* ID to a verification method from the context module's verification patterns. Flag any AC that can't be verified automatically.

Omit sections that don't apply (e.g., no UI Plan for infrastructure features).
