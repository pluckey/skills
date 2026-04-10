# Phase 1: Intent Loop

**YOU ARE IN PHASE 1. Complete ONLY this phase. Do NOT proceed to Phase 2. Do NOT read phases/mechanism.md.**

The intent loop produces two artifacts: whiteboard.md (WHY) and requirements.md (WHAT). Both must be system-agnostic — no implementation language, no tech-stack terms, no tool names.

---

## Step 0: Research Verification (Conditional)

**Gate**: Run this step ONLY when BOTH conditions are met:
1. Intensity is Standard or Deep
2. The feature description references research claims, learning science, effect sizes, pedagogical decisions, or UX research findings

**Skip** this step entirely for purely technical features. When skipping, proceed directly to Step 1.

**Procedure**:

1. Collect every research claim from the user's description and any existing spec files. For each: attributed source, specific finding, numbers cited.
2. Verify each claim via web search. Confirm findings, note caveats, flag conflations between different papers, mark unverifiable claims.
3. Search for 2-3 additional relevant papers (prioritize meta-analyses).
4. Produce the Verified Research Base with per-paper entries: author, title, venue, URL, verified finding, caveats, relevance.
5. Flag dropped citations as UNVERIFIABLE with what was searched and any replacement.
6. Append verified references to `research/references.md` (create if needed).
7. Present brief summary to user.

The verified research base feeds into the whiteboard roundtable as additional input.

---

## Step 1: Archive Search

Search the spec archive for structural analogues.

→ Load `archive-protocol.md`

Follow the search method. Collect 0-3 candidates. If no archive exists or no matches found, proceed without analogues. This step is enrichment, not a gate.

**Express detection**: If 2+ strong structural analogues are found AND scope is small (1-3 atoms), the feature is a candidate for Express mode. Note this for the triage confirmation if intensity hasn't been locked yet.

**If Express intensity**: proceed to the Express Flow (below). Skip Steps 2-6.

---

## Express Flow

For Express intensity only. Produces a rapid spec in one pass with one checkpoint.

### E1: Center Sprint

The executor (not an agent) proposes a center and center_test based on the user's description and archive analogues.

Present to the user:
- The proposed center
- The center_test (excludes + boundary)
- Structural analogues found ("Similar to: {spec-1}, {spec-2}")
- "Express or deeper?"

**This is the ONLY checkpoint.** If the user approves, proceed. If the user corrects the center, iterate. If the user says "deeper", upgrade to Focused/Standard/Deep — the archive search results carry forward.

### E2: Rapid Spec

The executor writes `.specs/features/{feature-name}/rapid-spec.md` directly. No agent launch, no roundtable.

→ Consult `formats.md § Rapid Spec` for the format.

Contents: center, center_test, analogues in frontmatter. ACs with ac-* IDs (no center_links — unnecessary at this scale). Tasks with t-* IDs and traces (no depends/implements metadata).

→ Run `node {skill-dir}/lint-spec.mjs .specs/features/{feature-name}/`

### E3: Begin Execution

```
EXPRESS SPEC COMPLETE. Proceeding directly to Execution phase.
```

→ Load `phases/execution.md` and execute from rapid-spec.md.

**Upgrade hatch**: At any point during execution, if the feature proves more complex than expected, the executor or user can upgrade to Standard. The rapid-spec.md becomes input to a Standard whiteboard roundtable. Work already done is preserved as the first draft.

---

## Step 2: Whiteboard Roundtable (Agent-Isolated)

Launch an Agent with the whiteboard prompt. Do NOT write whiteboard.md yourself — the agent's output IS the whiteboard content.

→ Load `prompts/whiteboard.md`

Fill all [bracketed inputs] from the current execution context. Include archive analogues from Step 1 (or "no structural analogues found").

After the agent returns, write its output to `.specs/features/{feature-name}/whiteboard.md`.

→ Consult `formats.md § Whiteboard` for the frontmatter schema. Include center_test from the roundtable output.

---

## Step 3: Whiteboard Checkpoint

Present the whiteboard to the user before the requirements roundtable consumes it.

**Present**:
- **The center** — prominently. "The panel converged on this center: '{center}'. Does this capture what the feature is about?"
- **The center_test** — exclusion test and boundary discrimination
- Key reframes (what changed from the user's original description)
- Open questions the panel could not resolve
- Assumptions challenged

→ Consult `formats.md § Checkpoint Format` for the checkpoint response structure.

**If user approves the center**: proceed. Feed any user answers to open questions into the requirements roundtable.
**If user rejects the center**: re-launch the whiteboard agent with the corrected orientation.
**If user answers open questions**: include them in the requirements input as resolved questions.

---

## Step 4: Requirements Roundtable (Agent-Isolated)

Launch a SECOND Agent (different from the whiteboard agent).

→ Load `prompts/requirements.md`

Fill all [bracketed inputs]. Include user-resolved questions from the whiteboard checkpoint.

After the agent returns, write its output to `.specs/features/{feature-name}/requirements.md`.

→ Consult `formats.md § Requirements` for the frontmatter schema. Center MUST match whiteboard.md.

---

## Step 5: Lint + Intent Loop Self-Check

→ Run `node {skill-dir}/lint-spec.mjs .specs/features/{feature-name}/`

If FAIL violations: fix them before proceeding.
If FLAG violations: note them for the checkpoint.

→ Consult `formats.md § Intent Loop` for the self-check template. Produce it with evidence.

If FAIL: launch a focused agent (1-2 experts, scoped to the delta). Max 3 iterations.

---

## Step 6: Checkpoint 1

Present to the user.

**Present:**
- The center (as a reminder)
- The center_test
- AC summary with center_links visible
- Any FLAG violations from the linter
- Any remaining open questions

→ Consult `formats.md § Checkpoint Format` for the response structure.

**If user corrects something:**
- If the correction changes the CENTER → close this spec, open a new one with the new center
- If the correction changes the FRAME → re-launch the whiteboard agent, then re-launch requirements
- If the correction changes a DETAIL → use the Amendment Protocol (skill.md): find affected elements by ID, produce replacements, apply, re-lint

**After presenting checkpoint 1:**

```
PHASE 1 COMPLETE. Awaiting user confirmation to proceed to Mechanism phase.
```

**STOP GENERATING. Do not begin Phase 2. Do not read phases/mechanism.md.**
