# Phase 3: Execution Loop

**YOU ARE IN PHASE 3. Execute the task list from tasks.md.**

**Before starting, read these artifacts in full:**
- `.specs/features/{feature-name}/tasks.md`
- `.specs/features/{feature-name}/design.md`
- The context module (construction patterns, verification patterns)
- Note the **center** from the frontmatter.

Keep whiteboard.md and requirements.md available for backward reference.

---

## Build-Verify-Amend Loop

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

### Story Sync (if `e2e/stories.yaml` exists)
After completing a task that traces to a user-facing AC, check `e2e/stories.yaml`. If the task added, removed, or changed user-facing behavior, update the corresponding story entries.

### Agent Test Gate (if `npm run test:journeys` exists)
After all build tasks are complete (before the completion presentation):
1. Run `npm run test:journeys`
2. Read the terminal summary
3. If all stories pass → proceed to completion
4. If application failures → read `e2e/reports/latest.json`, fix the regression, re-run
5. If environmental failures → note them and proceed

### Amend
If verification fails, classify:

| Severity | Signal | Action |
|---|---|---|
| Minor | Implementation bug, typo, missing import | Fix immediately, log, continue |
| Moderate | Task needs a different approach | Focused re-evaluation (1 expert via sequential-thinking), amend task, retry |
| Critical | Design element is wrong, or AC unmet by entire approach | **Circuit breaker** — stop execution. Present the issue to the user. Do NOT re-enter Mechanism automatically. |

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
