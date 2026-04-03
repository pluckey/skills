---
name: feature-architect-v6
description: "Describe what you want built. I'll think it through and build it." Takes a natural language description through nested deliberation loops (Intent, Mechanism, Execution) with agent-isolated roundtables, a semantic coherence center, structural linting, archive-informed analogical search, Jacobi inversion gate, evidence-based round targets, and wave-based parallel execution with architectural quality gates. System-agnostic via pluggable context modules.
---

# Feature Architect v6

## Known Failure Mode

Claude will attempt to compress deliberation rounds, skip roundtables, simulate expert panels without using sequential-thinking, or generate past phase boundaries. This ALWAYS produces worse outcomes. The deliberation IS the value. When you feel the urge to skip ahead: STOP. Complete only the current phase.

## Protocol Files

| File | Category | Purpose |
|------|----------|---------|
| skill.md | Imperative | Protocol identity, triage, orchestration, amendment |
| spec-model.md | Declarative | Center definition, center_test, element format, ID conventions |
| formats.md | Declarative | Output formats, frontmatter schemas, operational parameters |
| archive-protocol.md | Declarative | Archive search method, archetype vocabulary, tagging rules |
| phases/intent.md | Imperative | Produce whiteboard.md and requirements.md |
| phases/mechanism.md | Imperative | Produce design.md and tasks.md |
| phases/execution.md | Imperative | Build from the task list (wave-parallel or sequential) |
| prompts/whiteboard.md | Template | Whiteboard roundtable agent prompt |
| prompts/requirements.md | Template | Requirements roundtable agent prompt |
| prompts/design.md | Template | Design roundtable agent prompt |
| prompts/tasks.md | Template | Tasks roundtable agent prompt |
| prompts/jacobi-gate.md | Template | Jacobi inversion gate evaluation prompt |
| lint-spec.mjs | Verification | Structural integrity checks (P1-P11, F1-F6) |
| context-interface.md | Declarative | Context module specification |
| OBSERVATIONS.md | Wisdom | Learnings from prior executions |

**Reference convention:**
- `→ Load` — read the file in full, use as agent prompt or instruction set
- `→ Consult` — read the file, find the relevant section by heading
- `→ Run` — execute this command

## Spec Model

→ Load `spec-model.md` for the full structural model (center, center_test, element format, ID conventions, traceability rules).

In brief: every spec is built around a **center** — one immutable sentence defining what the feature IS. Every element carries a **center_link** justifying its existence. The linter validates structural integrity.

## Before You Begin

1. Look for a context module: check `context.md` in project root, `.claude/`, or `.specs/`. If none exists and this is an existing codebase: "I don't have a context module for this system. I can interview you as we go, or we can write one first." If greenfield, the protocol writes one during mechanism.
2. Read this skill's `OBSERVATIONS.md` (if it exists) for learnings from prior executions.
3. Check if `.specs/features/{feature-name}/` already exists — if so, read all spec files, check task status, and present: "Feature '{name}': {n}/{total} tasks complete. Resume from {next incomplete}?"

## Triage

**Parse**: Read the user's description. Identify: what they want, constraints/preferences, greenfield or existing.

**Discover**: If a context module exists, run its Discovery Protocol. If greenfield, note it.

**Assess intensity**:

→ Consult `formats.md § Intensity Table`

**Configure**: Express = execution only. Focused = intent (1 pass) + execution. Standard = all loops. Deep = all loops, expanded panels.

**Confirm**: "I found [discovery]. This looks like [intensity] — [rationale]. I'll [what protocol will do]. Sound right?" User may override.

## Orchestration Procedure

After triage, execute phases by loading their instruction files:

1. **LOAD**: Read the next phase file from `phases/`. Do NOT read subsequent phase files.
2. **EXECUTE**: Follow the phase file instructions completely.
3. **LINT**: → Run `node {skill-dir}/lint-spec.mjs .specs/features/{feature-name}/`. If FAIL violations exist, fix before proceeding. If FLAG violations exist, include in checkpoint.
4. **VERIFY**: Produce the contract output specified at the end of the phase file.
5. **GATE**: Present the checkpoint. STOP generating. Wait for user confirmation.
6. **PROCEED**: After user confirms, return to step 1 with the next phase.

If the user says "good enough, build it" at any checkpoint, note what would have been deliberated further and proceed to the next phase immediately.

**Intensity routing**:
- Express → `phases/intent.md` Express Flow (center sprint + Jacobi gate + rapid spec) → `phases/execution.md`
- Focused → `phases/intent.md` (requirements only, skip whiteboard) → `phases/execution.md`
- Standard → `phases/intent.md` → `phases/mechanism.md` → `phases/execution.md`
- Deep → same as Standard with expanded panels (4+ experts per roundtable)

**Research gate**: The research verification step (Step 0 in `phases/intent.md`) runs only when BOTH conditions are met: (1) intensity is Standard or Deep, AND (2) the feature description references research claims or learning science. Purely technical features skip it.

## Amendment Protocol

When the user corrects something at a checkpoint:

1. **Identify affected elements** by stable ID.
2. **Assess scope**: Does this change the CENTER? If yes — close this spec, open a new one. If no — continue.
3. **Assess reframe impact**: Does this amendment add or remove an AC? If yes — check whether any whiteboard reframe is invalidated by the change. If a reframe assumed something the amendment contradicts, flag it at the checkpoint. The whiteboard is a deliberation record (not amended), but invalidated reframes must be noted so downstream phases don't build on stale reasoning.
4. **Produce REPLACEMENT elements** (complete new versions, not patches). The correction roundtable receives: current file content + specific changes + instruction to produce only affected elements.
5. **Apply replacements**: Find each element by its stable ID in the file, swap the entire section (heading through next heading or EOF).
6. **Run linter** on the result. Fix any violations introduced by the amendment.
7. **Present clean state** at the next checkpoint.

Amendments are REPLACEMENTS, not patches. The file always reflects current state. Git tracks the history.
