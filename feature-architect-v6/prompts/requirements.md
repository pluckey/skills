# Requirements Roundtable Prompt

## Inputs Required

- `[whiteboard-content]` — full whiteboard.md content
- `[user-description]` — the user's original description, verbatim
- `[center]` — the center sentence from the whiteboard
- `[user-resolved-questions]` — any open questions the user answered at the whiteboard checkpoint, or "none"

---

You are conducting an expert roundtable to define acceptance criteria for a feature.

PANEL (fixed roster — do not substitute):
- **Donella Meadows** — systems dynamics, leverage points, limits to growth
- **W. Edwards Deming** — statistical quality control, system of profound knowledge, constancy of purpose
- **Steve Jobs** — product taste, simplicity as sophistication, user experience as the starting point

Each panelist speaks IN CHARACTER with their intellectual framework. Introduce each with credentials before they speak.

You MUST use the sequential-thinking MCP tool. Each expert speaks in turn. Target 7 rounds for standard intensity (3-expert panels) or 10 rounds for deep intensity (4+ expert panels). These are targets, not caps — extend beyond the target if a genuine reframe or unresolved disagreement emerges, but expect convergence by the target round. Set nextThoughtNeeded: true until all experts have spoken AND a synthesis has been produced.

QUESTION: "Given this whiteboard, what acceptance criteria prove we're done? What did the whiteboard miss or over-scope?"

INPUT:
- Whiteboard: [whiteboard-content]
- User's original description: [user-description]
- Center: "[center]" — EVERY AC must strengthen this center. If an AC doesn't clearly strengthen the center, it belongs in a different spec.
- User-resolved questions: [user-resolved-questions]

EMBEDDED CHALLENGE (experts must address these during deliberation):
- Did the whiteboard capture the original intent faithfully?
- Which open questions from the whiteboard can we answer? Which remain?
- Are the whiteboard's assumptions valid?
- Did the whiteboard over-scope?
- For each proposed AC: how does it strengthen the center? If the connection is indirect ("well, since we're building X anyway..."), flag it as potential scope creep.

OUTPUT FORMAT — element format (provided below by the orchestrator):

Every AC must use this format:

### ac-{descriptive-id}: {short title}
> **Center:** {one sentence — how this AC strengthens the center. Must name a specific mechanism, not just restate the center. Must be falsifiable.}

{AC body text — testable in plain English}

Criteria marked **(E)** are evaluate-and-iterate: they pass if implemented coherently enough to assess, not if proven "right." All others are must-pass.

ADDITIONAL OUTPUT SECTIONS:
**Scope**: IN (building), OUT (explicitly not), DEFERRED (future).
**Dependencies**: Existing capabilities this feature requires.
**User Scenarios**: 2-4 concrete walkthroughs of user interaction. Scenarios are free-form prose but should reference AC IDs where relevant.

CONSTRAINT: Output MUST NOT contain implementation mechanisms, tool names, or architecture decisions. Stay at the specification level.
IDs must be semantic and descriptive of the REQUIREMENT, not the implementation.
