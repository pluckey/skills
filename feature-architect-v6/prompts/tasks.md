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
- **Valentino Braitenberg** — synthetic psychology, vehicles framework — checks whether the build order creates the simplest testable wiring first, so emergent behavior can be observed early rather than only after all components exist. Flags task sequences that defer wiring to late waves, leaving integration risk until the end.
- **John Gall** — systemantics, Gall's Law — checks whether each wave produces a working system, not just working parts. Flags task plans where nothing functions until the final wave. Asks "after wave N completes, what can the user actually do?" If the answer is "nothing yet," the wave order is wrong.
- **Carl Gustav Jacob Jacobi** (The Inverter) — "man muss immer umkehren" (invert, always invert). For every task and dependency chain, Jacobi inverts: "What if this build order masks a missing precondition?" or "What if completing this task makes the next one harder, not easier?" He checks for center incoherence, missing preconditions, inverted causality, scope impossibility, and self-defeating logic. He speaks last in each round.

Each panelist speaks IN CHARACTER with their intellectual framework. Introduce each with credentials before they speak.

You MUST use the sequential-thinking MCP tool. Each expert speaks in turn. Target 7 rounds for standard intensity (3-expert panels) or 10 rounds for deep intensity (4+ expert panels). These are targets, not caps — extend beyond the target if a genuine reframe or unresolved disagreement emerges, but expect convergence by the target round. Set nextThoughtNeeded: true until all experts have spoken AND a synthesis has been produced.

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
- Are there task groups that can execute in parallel? (same wave = no mutual dependency + no shared output files)
- Does each wave respect inside-out ordering? (wave 1 should be domain, not UI)

OUTPUT — every task must use this format:

### t-{descriptive-id}: {description} | {tool/skill/method}
> **Center:** {how this task strengthens the center}
> **Traces:** {ac-id, ac-id, ...}
> **Depends:** {t-id, t-id, ... or (none)}
> **Files:** {file paths this task creates or modifies — concrete paths, not abstract}
> **Wave:** {positive integer — execution order group}
> **Status:** pending

- **Implements**: {design element da-* ID}
- **Done when**: {verifiable criterion}

After the task list, produce:

## Execution Waves

| Wave | Tasks | Depends on waves | Shared file risks |
|------|-------|-------------------|-------------------|
| 1 | t-id, t-id | (none) | (none) |
| 2 | t-id, t-id | 1 | (none or list) |
| ... | ... | ... | ... |

ORDERING RULES (context module may override):
1. Dependencies before dependents (data → logic → UI)
2. Riskiest/most uncertain tasks early (fail fast)
3. Verification after all construction tasks
4. Integration tasks after the things they integrate
5. Tasks with no mutual dependencies AND no shared output files may share a wave
6. Tasks sharing output files MUST be in different waves

CRITICAL: Do NOT produce a traceability matrix. Traceability is encoded in the Traces: fields.
