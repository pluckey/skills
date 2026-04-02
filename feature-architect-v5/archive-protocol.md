# Archive Protocol

How to search and tag the spec archive for structural analogues. This file is independently removable — deleting it and one step in phases/intent.md removes the entire Analogical Index feature.

## Archive Search

Before the whiteboard roundtable, search the archive for structurally similar features:

1. Glob `.specs/archive/*/` to find all archived specs
2. For each archived spec, read its frontmatter (center, archetype tags if present) and skim the whiteboard summary
3. Assess structural similarity based on the FORCES the feature resolves — not domain, not keywords
4. Collect 0-3 candidates ranked by structural relevance
5. For each candidate, extract: center, key insights from whiteboard, any relevant observations from log.md
6. Pass candidates to the whiteboard roundtable as additional input

If no archive exists or no matches are found, proceed without analogues. The archive search is enrichment, not a gate.

## Archetype Vocabulary

Archetype tags describe the FORCES a spec resolves — structural patterns, not domain categories. Tags are additive: a spec can carry multiple tags.

Initial vocabulary:

| Tag | Description | Example |
|-----|-------------|---------|
| `separation-of-concerns` | Disentangling responsibilities across boundaries | codebase-remediation, pipeline-separation |
| `pipeline-decomposition` | Breaking a monolithic flow into composable stages | pipeline-refactor, pipeline-separation |
| `state-machine-evolution` | Adding/changing states, transitions, or lifecycle | practice-surface-v2, conversation-persistence |
| `evaluation-infrastructure` | Building measurement, scoring, or quality assessment | mcq-quality-metrics, modality-quality-parity |
| `modality-addition` | Adding a new interaction type or output format | mcq-strategy-pattern, feedback-format-ab |
| `surface-redesign` | Changing what users see without changing underlying logic | ux-polish-enhancements, design-remediation |
| `integration-wiring` | Connecting existing components or external services | real-llm-integration, wire-engine-primary |
| `schema-evolution` | Adding/changing data models, migrations, persistence | codebase-remediation |
| `quality-gate` | Adding validation, linting, or enforcement mechanisms | architectural-guardrails, lint-remediation |
| `knowledge-representation` | Changing how concepts, relationships, or mastery are modeled | bidirectional-recall, cross-domain-transfer-engine |

The vocabulary grows organically. New tags are added when an existing tag doesn't capture the forces at play. Tags are never domain-specific (no `learning-science`, `mcq`, or `ui` tags — those are domains, not forces).

## Tagging Rules

- **On encounter**: When the archive search reads a spec that lacks archetype tags, assign tags based on the whiteboard content and write them back to the spec's frontmatter as `archetypes: [tag1, tag2]`
- **On completion**: When a new spec is archived (during the archive protocol in execution.md), assign archetype tags to the archived spec's frontmatter
- **No bulk retroactive tagging**: The archive is tagged incrementally, on encounter. No separate tagging effort is required.
- **Tags are metadata, not quality judgments**: Every archived spec gets tags regardless of its age or quality. Early specs and late specs are equally taggable.
