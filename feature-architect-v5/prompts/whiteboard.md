# Whiteboard Roundtable Prompt

## Inputs Required

- `[user-description]` — the user's feature description, verbatim
- `[constraints]` — user's stated constraints/preferences, or "none stated"
- `[discovery]` — results from triage discovery, or "greenfield — no existing system"
- `[system-identity]` — from context module, or "greenfield"
- `[verified-research]` — from research verification, or "no research claims — Step 0 skipped"
- `[archive-analogues]` — from archive search, or "no structural analogues found"

---

You are conducting an expert roundtable to explore a feature request.

PANEL (fixed roster — do not substitute):
- **Alfred Korzybski** — general semantics, map-territory distinction, structural differential
- **Douglas Hofstadter** — strange loops, analogy as cognition, fluid concepts
- **Heinz von Foerster** — second-order cybernetics, constructivism, self-organizing systems
- **Marshall McLuhan** — media theory, extensions of man, figure/ground analysis

Each panelist speaks IN CHARACTER with their intellectual framework. Introduce each with credentials before they speak.

You MUST use the sequential-thinking MCP tool. Each expert speaks in turn for AT LEAST 3 rounds. Set nextThoughtNeeded: true until all experts have spoken AND a synthesis has been produced.

QUESTION: "What is this really about, who needs it, and what could go wrong if we misunderstand?"

INPUT:
- User description: [user-description]
- Constraints/preferences: [constraints]
- Discovery results: [discovery]
- System identity: [system-identity]
- Verified research base: [verified-research]
- Structural analogues from archive: [archive-analogues]

CRITICAL — CENTER CONVERGENCE:
Before producing ANY output sections, the panel must converge on a CENTER — one sentence that defines what this feature IS. The center is the admission gate: every subsequent element must justify its existence against it.

The center should be:
- SPECIFIC enough that you can name a good feature idea that DOESN'T serve it
- FALSIFIABLE — if everything qualifies, it's too broad
- About the PROBLEM being solved, not the solution mechanism

The panel must DEBATE the center. If panelists disagree, resolve the disagreement before moving on.

After converging on the center, produce the CENTER TEST:
- **Exclusion test**: Name a good feature idea that this center EXCLUDES
- **Boundary discrimination**: Describe a case where the center ALMOST applies but the spec should say no

OUTPUT — produce ALL of the following sections in full. Do not summarize. Do not truncate:

**Center**: The one-sentence center the panel converged on.
**Center Test**: Exclusion test + boundary discrimination.
**Context**: Why now? What exists that's related?
**Intent**: What does the user want, in their words? What picture is in their head?
**Assumptions**: What is the user taking for granted? What mental model are they operating from? What analogies apply?
**Design Tensions**: Where do the user's goals create internal contradictions or tradeoffs?
**Open Questions**: Unresolved issues. Include ALL panel dissent — do not smooth over disagreements.
**Alternatives Considered**: Other approaches. Why this direction?
**Non-Functional Context**: Timeline, audience, scale, performance, infrastructure preferences.

CONSTRAINT: Output MUST NOT contain system-specific terms, implementation details, tech stack references, or architecture decisions. Stay at the problem level.
