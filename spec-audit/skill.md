---
name: spec-audit
description: "Adversarial end-to-end audit of a Feature Architect spec. Reads the full spec directory and runs a multi-pass roundtable (Korzybski, Feynman, Taleb, Hofstadter) to find structural flaws, semantic drift, hidden fragility, and tangled hierarchies. Works on any .specs/features/{name}/ directory."
---

# Spec Audit

## Purpose

Independent adversarial review of a completed (or in-progress) spec. This skill is NOT part of Feature Architect — it exists to catch what the authoring process missed. The panel has no loyalty to the spec. Their job is to break it.

## Known Failure Mode

Claude will attempt to be constructive, soften findings, or suggest improvements. This skill is NOT constructive. It is destructive. The panel finds flaws. They do not fix them. They do not suggest alternatives unless the flaw is structural enough that the direction of repair matters. When you feel the urge to be helpful: STOP. Be brutal instead.

## Invocation

The user invokes this skill on a spec directory. Auto-detect if unambiguous:

1. If user names a feature: look for `.specs/features/{feature-name}/`
2. If only one feature exists in `.specs/features/`: use it
3. Otherwise: ask which spec to audit

## Procedure

### Step 1 — Ingest

Read ALL spec files in the feature directory:
- `whiteboard.md`
- `requirements.md`
- `design.md`
- `tasks.md`
- `rapid-spec.md` (if Express intensity was used)
- `log.md` (if it exists — execution history is audit evidence)

Also read:
- The project's context module (`.specs/context.md` or `.claude/context.md`)
- The linter output: `node {fa-v5-skill-dir}/lint-spec.mjs .specs/features/{feature-name}/`

If any core spec file is missing, note it as a finding (incomplete spec) but audit what exists.

### Step 2 — Audit Roundtable

Load `prompts/audit.md` as the roundtable prompt. Substitute all input variables.

Run the roundtable using the `sequential-thinking` MCP tool. This is non-negotiable — do NOT simulate the roundtable inline.

The roundtable runs **4 passes** (see prompt for details). Each pass produces findings.

### Step 3 — Verdict

After the roundtable completes, produce the audit report directly in the conversation (do NOT write a file). Format:

```markdown
# Spec Audit: {feature-name}

## Verdict: {SOUND | FRAGILE | UNSOUND}

{1-2 sentence summary}

## Critical Findings
{findings with severity CRITICAL — these block execution}

## Warnings
{findings with severity WARNING — these should be addressed}

## Notes
{findings with severity NOTE — observations for consideration}

## Pass Summaries
### Pass 1: First Read
{what each panelist noticed from their framework}
### Pass 2: Cross-Examination
{collisions, amplifications, disagreements between panelists}
### Pass 3: Stress Test
{focused destruction of the weakest points}
### Pass 4: Verdict
{each panelist's single most important finding}
```

**Verdict criteria:**
- **SOUND** — no critical findings, warnings are minor. Ship it.
- **FRAGILE** — no critical findings, but warnings suggest the spec will produce rework. Fix before executing.
- **UNSOUND** — critical findings exist. The spec has structural flaws that will propagate into code. Do not execute.

### Step 4 — Wait

Present the audit report. STOP. The user decides what to do with the findings. Do not offer to fix anything unless asked.
