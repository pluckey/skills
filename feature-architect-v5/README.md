# Feature Architect v5

A multi-loop deliberation protocol for Claude Code that turns natural language feature descriptions into working software through nested deliberation loops (Intent, Mechanism, Execution) with agent-isolated roundtables, a semantic coherence center, structural linting, archive-informed analogical search, and adversarial quality gates.

## How it works

1. **Triage** — Assess scope and novelty, configure intensity (Express/Focused/Standard/Deep)
2. **Intent Loop** — Whiteboard roundtable explores the problem, requirements roundtable defines acceptance criteria, Destroyer gate catches structural flaws
3. **Mechanism Loop** — Design roundtable decomposes the system, tasks roundtable orders the build
4. **Execution Loop** — Build-verify-amend cycle with backward reference to specs

Every element traces back to a **center** — one immutable sentence defining what the feature IS. A structural linter validates referential integrity, traceability coverage, and center consistency across all spec files.

## File structure

```
feature-architect-v5/
  skill.md                  # Entry point — triage, orchestration, amendment protocol
  spec-model.md             # Center, center_test, element format, ID conventions
  formats.md                # Frontmatter schemas, self-check templates, intensity table
  archive-protocol.md       # Spec archive search and archetype tagging
  context-interface.md      # Context module specification (system-specific knowledge)
  lint-spec.mjs             # Deterministic structural linter (P1-P9, F1-F6)
  phases/
    intent.md               # Phase 1: whiteboard + destroyer + requirements
    mechanism.md            # Phase 2: design + tasks
    execution.md            # Phase 3: build-verify-amend loop
  prompts/
    whiteboard.md           # Whiteboard roundtable agent prompt
    requirements.md         # Requirements roundtable agent prompt
    design.md               # Design roundtable agent prompt
    tasks.md                # Tasks roundtable agent prompt
    destroyer.md            # Adversarial destroyer gate prompt
```

## Installation

```bash
cp -r feature-architect-v5 /path/to/your/project/.claude/skills/feature-architect-v5
```

## Usage

In Claude Code:

```
/feature-architect-v5 Build a prompt versioning tool with Supabase and Vercel
```

Or just describe what you want to build — Claude will invoke the skill if it matches.

## Requirements

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code)
- The `sequential-thinking` MCP server (roundtables use it for multi-expert deliberation)

## Key concepts

**Center** — One sentence defining what the feature IS. Immutable for the spec's lifetime. Every element must justify its existence against it.

**Center test** — Operationalizes falsifiability: an exclusion test (what good idea does this center reject?) and a boundary discrimination (what near-miss should the spec say no to?).

**Agent-isolated roundtables** — Each roundtable launches a separate agent with a specific expert panel. The orchestrator never writes spec content directly — agents do.

**Destroyer gate** — An adversarial agent that tries to find the ONE structural flaw that will kill the feature. Can only block on five categories: center incoherence, missing precondition, inverted causality, scope impossibility, self-defeating logic.

**Structural linter** — Deterministic checks (not LLM-based) that validate referential integrity, traceability coverage, center consistency, and fossil detection across all spec files.

**Intensity routing** — Express (rapid spec, 1 checkpoint), Focused (requirements + execution), Standard (all loops), Deep (expanded panels). Archive search can detect Express candidacy automatically.
