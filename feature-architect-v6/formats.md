# Formats

Single source of truth for all output formats and operational parameters. Phase files reference sections here via `→ Consult formats.md § {Section Name}`.

## Contents

- [Frontmatter Schemas](#frontmatter-schemas)
- [Self-Check Templates](#self-check-templates)
- [Checkpoint Format](#checkpoint-format)
- [Log Format](#log-format)
- [Intensity Table](#intensity-table)
- [Wave Plan Display Format](#wave-plan-display-format)

---

## Frontmatter Schemas

### Whiteboard

```yaml
---
feature: {feature-name}
center: "{the center sentence}"
center_test:
  excludes: "{good feature idea that doesn't serve this center}"
  boundary: "{near-miss case that almost qualifies but shouldn't}"
stage: whiteboard
intensity: {from triage}
loop_iterations: 1
last_modified: {ISO timestamp}
---
```

### Requirements

```yaml
---
feature: {feature-name}
center: "{the center sentence — MUST match whiteboard.md}"
stage: requirements
intensity: {from triage}
loop_iterations: 1
last_modified: {ISO timestamp}
---
```

### Design

```yaml
---
feature: {feature-name}
center: "{the center sentence — MUST match other spec files}"
stage: design
intensity: {from triage}
loop_iterations: 1
last_modified: {ISO timestamp}
---
```

### Tasks

```yaml
---
feature: {feature-name}
center: "{the center sentence — MUST match other spec files}"
stage: tasks
intensity: {from triage}
execution_mode: {parallel | sequential}
loop_iterations: 1
last_modified: {ISO timestamp}
---
```

Task elements include two additional fields for wave-based execution:

```markdown
> **Files:** {comma-separated list of file paths this task creates or modifies}
> **Wave:** {positive integer — execution order group}
```

- `Files` is a scope contract: the task commits to only modifying declared files.
- `Wave` is a positive integer. Tasks in the same wave execute in parallel.
- Both fields are required when `execution_mode: parallel`. Omitted when `execution_mode: sequential` or in Express mode.

### Log

```yaml
---
feature: {feature-name}
stage: log
---
```

---

## Self-Check Templates

### Intent Loop

```
SELF-CHECK: Intent Loop
- Center present and identical across all spec files? [YES/NO — evidence]
- center_test present in whiteboard.md frontmatter? [YES/NO]
- Every AC has a stable semantic ID? [YES/NO — evidence]
- Every AC has a center_link? [YES/NO — evidence]
- Requirements stable (no new ACs emerging)? [YES/NO — evidence]
- Whiteboard comprehensive (no unexplored territory)? [YES/NO — evidence]
- Requirements trace to stated intent (no gold-plating)? [YES/NO — evidence]
- Stage purity (no system-specific terms in either artifact)? [YES/NO — evidence]
- Linter: {N} FAIL, {M} FLAG violations
RESULT: [PASS/FAIL]
```

### Mechanism Loop

```
SELF-CHECK: Mechanism Loop
- Center identical across all spec files? [YES/NO]
- Tasks cover entire design? [YES/NO — list any uncovered design elements]
- Design traces to every requirement? [YES/NO — list any orphan design elements]
- No orphan tasks (task with no AC)? [YES/NO — list any]
- No orphan ACs (AC with no task)? [YES/NO — list any]
- No circular dependencies? [YES/NO]
- Linter: {N} FAIL, {M} FLAG violations
RESULT: [PASS/FAIL]
```

---

## Checkpoint Format

```markdown
## Checkpoint {N} Response [{timestamp}]
- **Temperature**: {cool|warm|hot}
- **Presented**: {what was shown}
- **Open questions from prior phase**: {resolved: Q→A | deferred: Q (reason) | none}
- **User said**: {verbatim or close paraphrase}
- **Action taken**: {amended X | proceeded | re-looped}
```

Temperature guide:

| Temperature | When | Pattern |
|---|---|---|
| Cool | High confidence, familiar | "[3-sentence summary]. I'm assuming [key assumptions]. Looks right?" |
| Warm | Specific uncertainty | "[Summary]. I'm unsure about [X]. What do you think?" |
| Hot | Contradiction or blocker | "I found [issue]. We need to resolve this before continuing." |

---

## Log Format

```markdown
## Execution Log

- [{timestamp}] TRIAGE: {intensity} — {rationale}
- [{timestamp}] INTENT: complete — {summary}
- [{timestamp}] CHECKPOINT 1: {temperature} — user {approved|corrected|overrode}
- [{timestamp}] MECHANISM: complete — {summary}
- [{timestamp}] CHECKPOINT 2: {temperature} — user {approved|corrected|overrode}
- [{timestamp}] t-{id}: complete — {what was produced}
- [{timestamp}] t-{id}: DISCOVERY (moderate) — {what happened, how resolved}
- [{timestamp}] COMPLETE: {summary}
```

---

## Intensity Table

|  | LOW NOVELTY | HIGH NOVELTY |
|---|---|---|
| **SMALL SCOPE** (1-2 atoms) | Express | Focused |
| **LARGE SCOPE** (3+ atoms) | Standard | Deep |

| Intensity | Phases | Panel Size | Round Target | Notes |
|-----------|--------|------------|--------------|-------|
| Express | Rapid spec (center sprint + direct write) → Execution | — | — | 1 checkpoint at center. Archive search detects candidacy (2+ analogues + small scope). |
| Focused | Intent (requirements only, skip whiteboard) → Execution | 3 | 7 | |
| Standard | Intent → Mechanism → Execution | 3 | 7 | With research step if applicable |
| Deep | Intent → Mechanism → Execution | 4+ | 10 | Expanded panels |

---

## Rapid Spec Format

Used by Express intensity only. Single file replaces whiteboard + requirements + design + tasks.

```yaml
---
feature: {feature-name}
center: "{one sentence}"
center_test:
  excludes: "{good feature idea that doesn't serve this center}"
  boundary: "{near-miss case that almost qualifies but shouldn't}"
mode: express
analogues: [{archive-spec-1}, {archive-spec-2}]
---
```

```markdown
## Acceptance Criteria

### ac-{descriptive-id}: {short title}
{testable criterion — plain English, no center_link needed at this scale}

## Tasks

### t-{descriptive-id}: {description}
> **Traces:** {ac-id, ac-id}
> **Status:** pending

- **Done when**: {verifiable criterion}
```

Properties:
- ACs use ac-* IDs but do NOT require center_links (F1/F2/F5 relaxed)
- Tasks use t-* IDs with traces but do NOT require depends/implements metadata
- Linter P1-P9 all apply (broken refs, orphans, center consistency, center_test)
- Single file: `.specs/features/{feature-name}/rapid-spec.md`

---

## Wave Plan Display Format

Displayed to the user before execution begins. Not a persisted artifact.

```
EXECUTION PLAN:
Wave {N} ({parallel|sequential}): {t-id, t-id, ...}
  Files: {comma-separated file paths across all tasks in wave}
Wave {N+1} ({parallel|sequential}): {t-id, t-id, ...}
  Files: {comma-separated file paths}
...
```

A wave is labeled `parallel` if it contains 2+ tasks, `sequential` if it contains exactly 1 task. The user confirms this plan before execution begins.
