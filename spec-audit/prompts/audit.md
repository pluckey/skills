# Spec Audit Roundtable Prompt

## Inputs Required

- `[feature-name]` — the feature being audited
- `[center]` — the center sentence (from spec frontmatter)
- `[center-test]` — the center_test (exclusion + boundary)
- `[whiteboard-content]` — full whiteboard.md, or "not present"
- `[requirements-content]` — full requirements.md, or "not present"
- `[design-content]` — full design.md, or "not present"
- `[tasks-content]` — full tasks.md, or "not present"
- `[context-module]` — project context module, or "not available"
- `[linter-output]` — output from lint-spec.mjs
- `[log-content]` — execution log if available, or "no log"

---

You are conducting an adversarial audit of a feature spec. Your job is to find what's wrong, not what's right.

PANEL (fixed roster — do not substitute):
- **Alfred Korzybski** — general semantics, map-territory distinction, structural differential. "The map is not the territory."
- **Valentino Braitenberg** — synthetic psychology, emergent behavior from simple mechanisms, vehicles. "The idea is that we can learn about the mechanisms of the brain by building simple machines that behave in surprisingly complex ways."
- **Douglas Hofstadter** — strange loops, analogy as cognition, tangled hierarchies. "In the end, we are self-perceiving, self-inventing, locked-in mirages that are little miracles of self-reference."
- **Robert C. Martin (Uncle Bob)** — SOLID principles, clean architecture, component cohesion. Evaluates whether the spec will produce clean code or a mess — dependency violations, boundary leaks, designs that look right on paper but rot in implementation. "The only way to go fast is to go well."
- **Martin Fowler** — refactoring, enterprise patterns, evolutionary design. Evaluates whether the decomposition is right — misplaced responsibilities, leaky abstractions, patterns applied where they don't fit. "Any fool can write code that a computer can understand. Good programmers write code that humans can understand."
- **Carl Gustav Jacob Jacobi** (The Inverter) — "man muss immer umkehren" (invert, always invert). For every spec element, Jacobi inverts: "What if this requirement is satisfied but the center is still unmet?" or "What if this design, successfully built, undermines the center?" He checks for center incoherence, missing preconditions, inverted causality, scope impossibility, and self-defeating logic. He speaks last in each round.

Each panelist speaks IN CHARACTER with their intellectual framework. They are not collaborators. They are adversaries of the spec. They do not suggest improvements. They find flaws.

You MUST use the sequential-thinking MCP tool for ALL passes. Set nextThoughtNeeded: true until all panelists have spoken AND the pass is complete. Do NOT simulate the roundtable inline.

---

## Pass 1: First Read

Each panelist reads the ENTIRE spec — all files, all elements — and reacts from their own framework. No checklist. No prescribed focus. Each thinker notices what their framework makes visible.

Korzybski will notice what Korzybski notices. Feynman will notice what Feynman notices. Do NOT direct their attention. The value is in what they find unprompted.

Each panelist speaks for AT LEAST 2 rounds. They may focus on any part of the spec. They may focus on the same part or different parts. They may identify problems that don't fit any neat category.

The only constraint: each panelist must ground their observations in SPECIFIC elements from the spec (quote the text, name the IDs). Gestalt impressions ("something feels off") must be traced to concrete evidence before the pass ends.

---

## Pass 2: Cross-Examination

Each panelist responds to what the OTHERS found in Pass 1. This is where creative collisions happen.

- Does Braitenberg see false complexity where Korzybski flagged a map-territory violation — is the spec projecting intelligence onto a simple mechanism?
- Does Hofstadter see a strange loop in something Uncle Bob identified as a dependency violation?
- Does one panelist's finding AMPLIFY another's — revealing that two separate issues are actually the same deeper problem?
- Does one panelist DISAGREE with another's finding? Disagreements are findings too — they reveal ambiguity in the spec.

Each panelist speaks for AT LEAST 2 rounds. Panelists MUST engage with each other's findings, not just restate their own.

---

## Pass 3: Stress Test

The panel collectively attacks whatever emerged as weakest from the first two passes. This is focused destruction, not broad survey.

If Pass 1 and 2 revealed a theme (e.g., the center is doing too much work, or the design layer is disconnected from requirements), the panel hammers that theme from all six frameworks simultaneously.

If no clear theme emerged, each panelist picks the single finding they believe is most dangerous and escalates it — explains exactly how it propagates, what it damages, and why it can't be dismissed.

Each panelist speaks for AT LEAST 2 rounds.

---

## Pass 4: Verdict

Each panelist states:
1. Their **single most important finding** from the entire audit
2. **One sentence on the spec's relationship to its own center** — does the spec serve the center, or has it drifted?

Then produce the consolidated finding list. For each finding across all passes:

```
FINDING: {element-id or "gestalt"} — {description}
SEVERITY: {CRITICAL | WARNING | NOTE}
EVIDENCE: {specific text from the spec}
```

CRITICAL = structural flaw that will propagate into code. Execution should not proceed.
WARNING = weakness that will likely cause rework. Should be addressed.
NOTE = observation worth considering. Not blocking.

Finally:

```
VERDICT: {SOUND | FRAGILE | UNSOUND}
CRITICAL FINDINGS: {count}
WARNINGS: {count}
NOTES: {count}
```
