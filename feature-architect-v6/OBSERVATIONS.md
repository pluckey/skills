# Feature Architect v5 — Observations

<!-- Protocol-level observations from executions. Append new entries at the bottom. -->

### Inherited from v4

The following observations from v4 remain valid and inform v5 behavior:

- **Pipeline patterns collapse validation tasks**: When a subsequent pipeline uses the same proven pattern, combine validation tasks into one.
- **Schema relaxation is predictable**: Any pipeline schema with array/enum fields should use permissive schemas from the start.
- **Error recovery scope is consistently overestimated**: Check what infrastructure already handles before estimating error recovery tasks.
- **User reframes at checkpoint 1 should trigger roundtable reconvene**: When user feedback changes the FRAME (not details), re-launch the whiteboard agent with the new frame rather than patching ACs.
- **Explicit JSON format strings eliminate schema failures**: All LLM prompts must include explicit Format lines matching Zod schemas.
- **Research verification before roundtables**: Verify all cited research via web search before the whiteboard roundtable. Hallucinated citations and conflated findings produce specs built on false premises.
- **Whiteboard checkpoint before requirements roundtable**: Present whiteboard reframes to the user before the requirements roundtable consumes them. User answers to open questions feed into requirements as resolved inputs.
- **Mid-execution architecture audit catches structural bugs**: For specs touching >5 files or involving state machine changes, run an inversion-style audit after build phases complete.
- **Bulk sed on task statuses destroys tracking**: Never use regex-based bulk updates on task statuses. Update one at a time by task ID.
- **Deferred open questions become real gaps**: At Checkpoint 2, explicitly review ALL deferred/open questions from the whiteboard.
- **Empirical audit is the highest-value phase**: Theoretical quality dimensions predict categories of failure but not distribution. The audit discovers where the actual severity lies.
- **User-resolved open questions that reframe should be flagged**: When a user resolves an open question with a reframe (not just an answer), flag it prominently — reframes change the solution SPACE.

### From book-data-normalization (2026-03-30)

- **Express specs benefit from a pre-execution assessment roundtable**: The rapid-spec was structurally sound but had three moderate gaps (temporal query pattern, migration ordering, hidden interface redesign) that would have caused mid-execution pivots. A focused assessment roundtable (4 experts, 5 rounds) caught all three before a single line of code was written. Consider making this standard for Express specs that touch >3 files.
- **Expand-contract migrations need an explicit cleanup task**: Express specs that involve schema normalization should always include a separate phase-2 cleanup task from the start. The original spec embedded column drops in the creation tasks — a dangerous pattern that was caught only during the assessment roundtable.
- **Trigger.dev tasks bypass the repository layer**: When a Trigger.dev task uses raw Supabase client for DB writes, schema migrations require updating both the repository layer AND the raw SQL in the task. Specs should call this out explicitly in the task that modifies the pipeline.

### From interaction-quality-audit (2026-03-31)

- **Zod schemas are the youngest fossil**: When the spec's center is about removing deterministic intermediaries between LLM calls, the output schemas are themselves intermediaries. The spec identified this pattern 3 times (Principle Engine, verdict, mastery engine) but didn't see the 4th instance (the feedback schema) until post-execution testing revealed observations being distorted to fit slots. Future specs that delete deterministic code should audit whether the replacement schemas are reintroducing the same constraint.
- **Holistic review panels catch what implementation misses**: A post-whiteboard holistic review with domain-external thinkers (epistemologists, media theorists, cyberneticists) caught 5 structural issues that the engineering-focused roundtables missed — including the schema paradox, reversal risk, and missing contestation surface. Consider making holistic review standard for deep-intensity specs.
- **Rate limiting kills test agents**: Playwright-based agent tests that simulate full learning sessions need 10+ API calls per interaction cycle. Default rate limits (2/min authenticated) cause agents to spend their entire budget on "Try again" loops. Test agent runs need explicit rate limit overrides.
- **Live quality validation > automated tests for LLM output**: The 3 manual Playwright samples caught more quality issues (reversal risk, schema distortion, connection repetitiveness) than any automated test could. For features where LLM output quality is the primary concern, budget time for live validation with real responses rather than relying on schema validation alone.

### From signal-field center audit (2026-04-05)

- **Aspirational centers bias toward subtraction**: A center that describes a user effect ("shifts activity from X to Y") biases construction toward reducing X rather than enhancing Y. These are different strategies. The signal-field center ("shifts from configuring to composing") led to minimized editing capability rather than enhanced composition capability. Future specs should prefer mechanism centers ("is X") over aspiration centers ("shifts toward X") — mechanism centers are falsifiable at every construction step. Aspiration centers are only falsifiable via user testing after shipping.
- **Center_test exclusions must be qualified**: An unqualified exclusion ("enriches internal editing") was interpreted as a blanket prohibition. Exclusions should specify the CONDITION under which the excluded feature is harmful (e.g., "as the primary deliverable, displacing composition"), not just name the excluded feature.
