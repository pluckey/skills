# Spec Model

Reference specification for the structure of Feature Architect specs. No procedure — just definitions.

## The Center

Every spec is built around a **center** — one sentence defining what the feature IS.

- Set during the whiteboard phase. The panel MUST converge on it before producing anything.
- **Immutable** for the spec's lifetime. If the center needs to change, close this spec and open a new one.
- Appears in the frontmatter of EVERY spec file (redundant but visible).
- Must be **falsifiable** — you should be able to name a good feature idea that DOESN'T serve it. If everything qualifies, it's too broad.
- About the PROBLEM being solved, not the solution mechanism.

## Center Test

The center includes a `center_test` in the whiteboard frontmatter that operationalizes falsifiability:

```yaml
center_test:
  excludes: "A good feature idea that does NOT serve this center"
  boundary: "A case where the center ALMOST applies but the spec should say no"
```

- **Exclusion test**: Name something good this center excludes. If you can't, it's too broad.
- **Boundary discrimination**: Describe a near-miss — something that almost qualifies but shouldn't. This tests the center's edge, not just its core. The boundary must be stated at the PROBLEM level (what the feature addresses), not the SOLUTION level (how it's implemented). A solution-level boundary tests the design, not the center.

Both are produced by the whiteboard panel during center convergence. The linter validates their presence (P9) and flags components shorter than 10 words (F6).

**Example**:
```yaml
center: "The practice session must end with a structured reflection that connects this session's performance to the learner's trajectory across sessions."
center_test:
  excludes: "A new interaction modality — good, but doesn't connect performance across sessions"
  boundary: "A per-question feedback improvement — relates to performance but doesn't connect across sessions"
```

## Element Format

ACs and tasks use structured headings with visible metadata:

```markdown
### ac-question-persists: Question persists during feedback
> **Center:** Prevents context loss — the foundational spatial contiguity fix

When a learner submits an answer, the question remains visible on screen
while feedback is displayed.
```

```markdown
### t-reducer-simplification: Reducer + scorecard + active state separation
> **Center:** Enables question persistence by separating active state from feedback state
> **Traces:** ac-question-persists, ac-selected-distinguished, ac-scorecard-interval
> **Depends:** (none)
> **Status:** pending

State additions: activeInteraction, activeFeedback, activeResponse...
```

Key properties:
- **IDs are semantic and stable.** `ac-question-persists`, not `AC-1`. Inserting a new element never renumbers existing ones.
- **Center_links are visible.** Blockquote format — the justification is the first thing you read, not hidden metadata.
- **Edges use IDs.** `Traces: ac-question-persists` — references are to stable identifiers, not sequential numbers.
- **Forgiving during drafting, strict at validation.** Agents write freely during roundtables. The linter catches missing metadata before the checkpoint.
- **FAILS-when tests behavior, not just structure.** A FAILS-when clause that only checks for the presence of fields or artifacts can pass even when the analytical method is hollow. Where an AC specifies a method (e.g., "applies inversion thinking"), the FAILS-when clause should include: "The output shows no evidence of applying the specified method." Structure-only testing catches missing pieces; behavior testing catches empty shells.
- **Prompt-producing tasks need behavioral done-when.** When a task produces a prompt template, structural done-when ("prompt contains X fields") is necessary but insufficient. Add: "Test invocation or manual review confirms the prompt produces the intended analytical behavior, not just the intended output structure." Prompt quality is only verifiable by running the prompt.

## ID Conventions

| Prefix | Element type | File |
|--------|-------------|------|
| `ac-` | Acceptance criteria | requirements.md |
| `t-` | Tasks | tasks.md |
| `da-` | Design atoms | design.md (atoms table) |
| `sc-` | Scenarios | requirements.md (free-form prose) |

IDs are kebab-case, descriptive of the REQUIREMENT not the implementation: `ac-question-persists` (what it requires) not `ac-frozen-renderer` (how it's implemented).

## What Uses the Element Format

- **requirements.md**: All ACs use the element format (id, center_link, body)
- **tasks.md**: All tasks use the element format (id, center_link, traces, depends, status, body)
- **design.md**: Atoms table uses element IDs. Relationship maps embed IDs. Behavior/UI/data plans are structured prose (not element format).
- **whiteboard.md**: No element format. It's a deliberation record. Only the center and center_test in frontmatter.

## Traceability

There is NO maintained traceability matrix. Traceability is encoded in the `Traces:` and `Depends:` fields of task elements. The linter validates coverage. A traceability report can be generated on demand by querying the edges, but it is NEVER stored as a maintained artifact. Maintained copies ALWAYS drift.
