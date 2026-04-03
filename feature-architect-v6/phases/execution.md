# Phase 3: Execution Loop

**YOU ARE IN PHASE 3. Execute the task list from tasks.md.**

**Before starting, read these artifacts in full:**
- `.specs/features/{feature-name}/tasks.md`
- `.specs/features/{feature-name}/design.md`
- The context module (construction patterns, verification patterns)
- Note the **center** from the frontmatter.

Keep whiteboard.md and requirements.md available for backward reference.

---

## Execution Mode Selection

Read the `execution_mode` field from tasks.md frontmatter:
- `parallel` → Wave-based execution (below)
- `sequential` → Sequential Build-Verify-Amend loop (§ Sequential Fallback)
- If field is missing → default to sequential

Read the Execution Waves table from tasks.md. If no wave summary exists, fall back to sequential.

---

## Wave Planning

Before executing any task, parse all Wave assignments from tasks.md and present the execution plan to the user:

→ Consult `formats.md § Wave Plan Display Format`

Present the wave plan and wait for user confirmation before proceeding.

**Express mode**: Express intensity specs always use sequential execution. Skip wave planning.

---

## Wave-Based Execution

For each wave in order (wave 1, wave 2, ...):

### Pre-Wave Gate
1. Confirm all tasks in prior waves have status `complete`.
2. If any prior-wave task is not complete, STOP — do not start this wave.

### Dispatch
For each task in the current wave:

**If the wave contains a single task** → execute using the Sequential Build-Verify-Amend loop (below). No wave boundary gate. This is v5 behavior exactly.

**If the wave contains multiple tasks** → dispatch each task as a parallel sub-agent via the Agent tool. Each agent receives a self-contained brief:

**Agent Brief Template:**

```
You are executing a single build task from a feature spec.

CENTER: "{center from frontmatter}"

YOUR TASK:
{full task element from tasks.md, including all metadata}

DESIGN CONTEXT:
{the da-* element(s) referenced by this task's Implements field, extracted from design.md}

CONSTRUCTION PATTERNS:
{relevant construction patterns from the context module}

VERIFICATION PATTERNS:
{relevant verification patterns from the context module}

FILE SCOPE:
You MUST only create or modify these files: {Files field from task}
If you need to modify a file not in this list, STOP and report the issue.

DONE WHEN:
{Done when criterion from the task}

AFTER COMPLETION:
1. Self-verify: run verification patterns on the files you changed. Fix any errors detectable in isolation (syntax, type errors, broken imports) before reporting.
2. Report: COMPLETE with a one-line summary, or BLOCKED with the issue description and severity (Minor/Moderate/Critical).
```

### Self-Verification (per task)
Each task — whether executed directly or via sub-agent — must self-verify before reporting completion. Self-verification catches errors detectable without reference to other tasks' work:
- Syntax errors
- Type errors
- Broken imports
- Failing tests within the task's file scope

Errors detectable in isolation are fixed immediately. Only errors that require cross-task context escalate to the wave boundary gate.

### Wave Boundary Gate (multi-task waves only)

After all tasks in a multi-task wave report back:

1. **Collect results** from all agents.
2. **If any agent reports BLOCKED with Critical severity** → Circuit breaker. Stop all execution. Present the issue to the user. Do NOT proceed to the next wave.
3. **If any agent reports BLOCKED with Moderate severity** → Run a focused re-evaluation (1 expert via sequential-thinking) scoped to that task. Retry once. If still blocked → escalate to Critical.
4. **If any agent reports BLOCKED with Minor severity** → Fix directly, mark complete.
5. **Integration check**: Run the context module's full verification suite (build, lint, type check) on the cumulative codebase state.
6. **Architectural review**: Invoke `/wwubd` on the files modified in this wave. This reviews the combined changes for Clean Architecture violations.
7. **Failure attribution**: For each error or violation found:
   - Identify containing file(s)
   - Map files to tasks using the Files metadata from tasks.md
   - Classify:
     - **Isolated**: error contained within one task's file set → fix immediately, log, continue
     - **Emergent**: error spans files from multiple tasks → present to user with full attribution before proceeding
8. → Run `node {skill-dir}/lint-spec.mjs .specs/features/{feature-name}/` — ensure spec consistency.
9. Mark all completed tasks in tasks.md (update Status fields one at a time — never bulk sed).
10. Append wave completion to log.md.

Proceed to the next wave only after the gate passes.

---

## Sequential Fallback

For sequential execution mode or single-task waves, use the v5 Build-Verify-Amend loop:

For each task in order:

### Build
1. **State intention**: One sentence — what you're about to do and why.
2. Execute using the context module's construction patterns.
3. Mark task status as `complete` in tasks.md (update the `> **Status:** pending` line to `> **Status:** complete`).
4. Append to `.specs/features/{feature-name}/log.md`.

### Verify
After each task (or batch of related tasks):
1. Run the context module's verification patterns.
2. Check: does the output match the design element this task implements?
3. → Run `node {skill-dir}/lint-spec.mjs .specs/features/{feature-name}/` — ensure spec files are still consistent.

### Amend
If verification fails, classify:

| Severity | Signal | Action |
|---|---|---|
| Minor | Implementation bug, typo, missing import | Fix immediately, log, continue |
| Moderate | Task needs a different approach | Focused re-evaluation (1 expert via sequential-thinking), amend task, retry |
| Critical | Design element is wrong, or AC unmet by entire approach | **Circuit breaker** — stop execution. Present the issue to the user. Do NOT re-enter Mechanism automatically. |

---

### Story Sync (if `e2e/stories.yaml` exists)
After completing a task that traces to a user-facing AC, check `e2e/stories.yaml`. If the task added, removed, or changed user-facing behavior, update the corresponding story entries.

### Agent Test Gate (if `npm run test:journeys` exists)
After all build tasks are complete (before the completion presentation):
1. Run `npm run test:journeys`
2. Read the terminal summary
3. If all stories pass → proceed to completion
4. If application failures → read `e2e/reports/latest.json`, fix the regression, re-run
5. If environmental failures → note them and proceed

---

## Backward Reference

At any point during execution, trace the chain:
- **tasks.md**: Am I on the right task? (find by stable ID)
- **design.md**: Does my output match the blueprint? (find by da-* ID)
- **requirements.md**: Is this actually required? (find by ac-* ID)
- **whiteboard.md**: Does this serve the original intent and the CENTER?

Use backward reference when uncertain. If tracing reveals a mismatch, classify it using the severity table above.

---

## Completion

After all tasks pass verification:

1. Run full verification suite (all verification patterns from context module).
2. → Run `node {skill-dir}/lint-spec.mjs .specs/features/{feature-name}/` — final validation. All FAIL checks must pass.
3. Fix any remaining issues.
4. Present to user:
   - What was built (summary, not exhaustive list)
   - The center, and whether it was faithfully served
   - Any discoveries made during execution
   - Any deferred items
   - Any known limitations

---

## Archive Protocol

After completion presentation and before reflection:

1. **Archive the spec folder:**
   - Copy `.specs/features/{feature-name}/` to `.specs/archive/{feature-name}/`

2. **Tag the archived spec:**
   - Assign archetype tags based on the forces this spec resolved
   - → Consult `archive-protocol.md § Archetype Vocabulary` for the tag vocabulary
   - Write tags to the archived spec's whiteboard.md frontmatter as `archetypes: [tag1, tag2]`

3. **Save the conversation log:**
   - Find the current session's JSONL file in `~/.claude/projects/` (most recently modified `.jsonl` matching the project path)
   - Copy it to `.specs/archive/{feature-name}/session-raw.jsonl`

4. **Confirm to the user:**
   - "Spec archived to `.specs/archive/{feature-name}/` with conversation log."

---

## Reflection Protocol

After execution completes, review what happened and classify learnings:

### Protocol-Level Observations (go to OBSERVATIONS.md)

Insights about the Feature Architect PROCESS itself. These are universal.

```markdown
### [{date}] {type: process-insight | process-failure}
- **What happened**: {description}
- **Evidence**: {what you observed}
- **Proposed change**: {how the protocol should adapt}
```

Append to this skill's `OBSERVATIONS.md`.

### Context-Level Observations (go to context module)

Insights about the SPECIFIC SYSTEM. Propose updates to the context module:
- New known trap → append automatically
- Convention or pattern change → propose to user

### What NOT to Observe
- One-off bugs (just fix them)
- User preferences already in spec files
- Anything that doesn't generalize beyond this single feature
