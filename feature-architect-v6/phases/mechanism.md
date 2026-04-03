# Phase 2: Mechanism Loop

**YOU ARE IN PHASE 2. Complete ONLY this phase. Do NOT proceed to Phase 3. Do NOT read phases/execution.md.**

The mechanism loop translates intent into a buildable plan. This is where system-specific knowledge enters — the context module is fully consumed here.

**Before starting, read these artifacts in full:**
- `.specs/features/{feature-name}/whiteboard.md`
- `.specs/features/{feature-name}/requirements.md`
- The context module (all sections)
- Note the **center** from the frontmatter — every design element and task must strengthen it.

---

## Step 0: Greenfield Bootstrap (if no context module exists)

1. Based on intent + user's stated preferences/constraints, select a tech stack
2. Write a context module conforming to the Context Module Interface (`context-interface.md`)
3. Present the context module to the user at Checkpoint 2 for validation
4. Proceed with design using the new context module

---

## Step 1: Design Roundtable

Produce the system decomposition through expert deliberation.

→ Load `prompts/design.md`

Fill all [bracketed inputs] from the current context. Include the CENTER prominently.

You MUST use the sequential-thinking MCP tool for this roundtable. Do NOT simulate it.

Write the output to `.specs/features/{feature-name}/design.md`.

→ Consult `formats.md § Design` for the frontmatter schema. Center MUST match other spec files.

---

## Step 2: Tasks Roundtable

Produce the ordered task list through expert deliberation.

→ Load `prompts/tasks.md`

Fill all [bracketed inputs]. Include the CENTER.

You MUST use the sequential-thinking MCP tool. Do NOT simulate it.

Write the output to `.specs/features/{feature-name}/tasks.md`.
The tasks roundtable assigns Wave and Files metadata to each task for parallel execution planning in Phase 3.

→ Consult `formats.md § Tasks` for the frontmatter schema. Center MUST match.

**CRITICAL: Do NOT produce a traceability matrix.** Traceability is encoded in the Traces: fields. The linter validates coverage.

---

## Step 3: Lint + Mechanism Loop Self-Check

→ Run `node {skill-dir}/lint-spec.mjs .specs/features/{feature-name}/`

If FAIL violations: fix them before proceeding.
If FLAG violations: note them for the checkpoint.

→ Consult `formats.md § Mechanism Loop` for the self-check template. Produce it with evidence.

If FAIL: run a focused re-evaluation (1-2 experts via sequential-thinking, scoped to the gap). Max 2 iterations.

**Escalation to Intent**: If design reveals a requirement gap or infeasible requirement — re-enter Phase 1 with the specific issue. Run a focused pass (1-2 expert agent, delta only) to amend the requirement using the Amendment Protocol. Then return here. Max 2 escalations total. Third escalation: "I've escalated twice. Something fundamental may be uncertain. Let's talk."

---

## Step 4: Checkpoint 2

Present to the user. Temperature can only go UP from Checkpoint 1, never down.

**Present:**
- The center (as a reminder)
- Task summary (IDs and titles, not full bodies)
- Center_links for each task (scannable)
- The key tradeoff ("I chose X over Y because Z")
- Any FLAG violations from the linter
- Any concerns
- If greenfield: the context module for validation

→ Consult `formats.md § Checkpoint Format` for the response structure.

**If user corrects something:**
- If the correction changes the CENTER → close this spec, open a new one
- Assess severity: does this invalidate design elements or tasks?
- If YES → amend affected elements using the Amendment Protocol, re-run the linter
- If NO → amend the relevant file, note the correction, proceed

**After presenting checkpoint 2:**

```
PHASE 2 COMPLETE. Awaiting user confirmation to proceed to Execution phase.
```

**STOP GENERATING. Do not begin Phase 3. Do not read phases/execution.md.**
