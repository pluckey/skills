# Tasks Roundtable Prompt

## Inputs Required

- `[center]` — the center sentence
- `[design-content]` — full design.md content
- `[requirements-content]` — full requirements.md content
- `[whiteboard-content]` — full whiteboard.md content
- `[context-module]` — full context module content (construction + verification patterns)

---

You are conducting an expert roundtable to define the task list for a feature.

PANEL (fixed roster — do not substitute):
- **Robert C. Martin (Uncle Bob)** — SOLID principles, clean architecture, component cohesion
- **Martin Fowler** — refactoring, enterprise patterns, evolutionary design
- **John Carmack** — systems optimization, shipping discipline, first-principles engineering

Each panelist speaks IN CHARACTER with their intellectual framework. Introduce each with credentials before they speak.

You MUST use the sequential-thinking MCP tool. Each expert speaks in turn for AT LEAST 3 rounds. Set nextThoughtNeeded: true until all experts have spoken AND a synthesis has been produced.

QUESTION: "What's the optimal build order, what are the dependency traps, and where will things go wrong?"

CENTER: "[center]" — every task must strengthen this center.

ARCHITECTURAL FRAME — Clean Architecture build order:
Tasks must be ordered inside-out: entities/domain first, then use cases, then adapters, then framework wiring. This isn't just a preference — it's how the Dependency Rule stays enforceable during construction. If you build outer layers first, you'll be tempted to shortcut the boundaries.

CODEBASE GROUNDING: Tasks must reference real file paths from the context module and existing codebase. "Create a service" is not a task. "Create src/domain/foo.ts implementing the FooPort interface from da-{id}" is a task.

INPUT:
- Design: [design-content]
- Requirements: [requirements-content]
- Whiteboard: [whiteboard-content]
- Context module: [context-module]

EMBEDDED CHALLENGE:
- Does the task list cover the ENTIRE design?
- Any task disproportionately large? (split it)
- Dependencies correct?
- Done-when criteria specific enough to verify?
- For each task: how does it strengthen the center?
- Does the build order respect inside-out construction (domain → use cases → adapters → frameworks)?
- Does every task name concrete file paths, not abstract components?

OUTPUT — every task must use this format:

### t-{descriptive-id}: {description} | {tool/skill/method}
> **Center:** {how this task strengthens the center}
> **Traces:** {ac-id, ac-id, ...}
> **Depends:** {t-id, t-id, ... or (none)}
> **Status:** pending

- **Implements**: {design element da-* ID}
- **Done when**: {verifiable criterion}

ORDERING RULES (context module may override):
1. Dependencies before dependents (data → logic → UI)
2. Riskiest/most uncertain tasks early (fail fast)
3. Verification after all construction tasks
4. Integration tasks after the things they integrate

CRITICAL: Do NOT produce a traceability matrix. Traceability is encoded in the Traces: fields.
