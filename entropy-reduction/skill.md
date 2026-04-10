---
name: entropy-reduction
description: "Reduce ambiguity fast. Adaptive Q&A that makes the largest cut to the remaining possibility space per question." Use when resolving ambiguous requirements, aligning on design decisions, diagnosing unclear bugs, eliciting preferences, or any situation where multiple interpretations exist and you need to converge on the right one in the fewest exchanges. Invoke with /entropy-reduction or when the user asks to "reduce entropy", "disambiguate", or "figure out what I mean."
---

# Entropy Reduction Engine

A domain-agnostic adaptive questioning protocol that identifies an unknown target in the fewest questions possible using information-theoretic principles.

## Core Strategy — Coarse Reduction

Each question makes the LARGEST CUT to the remaining possibility space. The goal is maximum information gain per question.

Before generating each question:

1. **ELIMINATE** — list what has been ruled out by prior answers
2. **HYPOTHESIZE** — maintain 4-8 remaining hypotheses for what the target could be
3. **DISTINGUISH** — identify the single question that best separates the remaining hypotheses
4. **DESIGN** — create options so each hypothesis maps to a distinct option
5. **VERIFY** — every option must be compatible with ALL prior answers. If an option contradicts a previous answer, discard it and generate a different one

This 5-step loop runs before EVERY question. The reasoning is logged but not shown to the user.

## Question Ordering

Prefer CONTEXTUAL dimensions over ATTRIBUTE dimensions. Context constrains the hypothesis space for ALL subsequent questions.

Establish WHAT something IS before asking what it LOOKS LIKE, FEELS LIKE, or HOW it WORKS.

This naturally produces a progressive arc: broad context -> pointed attributes -> zeroing-in details. The arc emerges from the strategy — don't force it artificially.

## Question Design

- **4-5 options per question**
- **ATOMIC OPTIONS**: each option asserts exactly ONE new fact. Never bundle two claims into one option. Test: could the user agree with part but not all? If yes, split it.
- **DISTINCT OPTIONS**: each option should imply a fundamentally different target. If two options would lead to the same follow-up questions, they're not different enough.
- **EQUIPROBABLE**: options should be roughly equally likely given current hypotheses
- **ESCAPE HATCH**: last option is always "None of these"
- **MULTISELECT**: when the target has layered or compound qualities, allow multiple selections

## Silent Inference

After each answer, identify attributes you can INFER from correlations without asking:

- Known attribute A + known attribute B often co-occur with attribute C
- If confidence > 70%, do NOT ask about C — infer it silently
- Track inferences separately from explicit answers
- Inferred attributes become "impossible details" — things the user never mentioned that the system somehow got right

This reduces question count AND creates a sense of perceptiveness.

## Adaptation Protocol

The system adapts its questioning strategy based on user feedback patterns:

**Single rejection** ("None of these"):
Switch to a BINARY question that divides the remaining possibility space in half based on a single observable attribute. Binary questions are more constrained but guarantee information gain.

**Two consecutive rejections**:
Continue binary questioning until the system can re-anchor on a confirmed attribute, then return to multiple choice.

**Three or more consecutive rejections**:
The reasoning chain likely contains a WRONG ASSUMPTION from an earlier answer. Stop asking new questions. Instead:
1. Identify which earlier answer most likely contains a compound claim where the user agreed with one part but not the other
2. Present a correction question: "Let me make sure I understood — [restate the suspect claim]. Is that right, or is it more like..."
3. Offer 3-4 alternative interpretations
4. This resets the reasoning cascade without starting over

## Working Memory — Mindmap

The system maintains a mermaid mindmap as external memory, returned with every response and fed back on the next turn.

Rules:
- Root node represents the system
- First-level branches are the major dimensions of the problem space (domain-specific)
- Answered dimensions get concrete leaf nodes
- INFERRED dimensions get leaf nodes marked with *italic*
- UNKNOWN dimensions get leaf nodes marked with ???
- The ??? markers show where to aim next — target the thinnest branch or the most critical gap
- The mindmap helps the system SEE its own knowledge gaps and prioritize accordingly

The mindmap serves dual purpose:
1. **For the system**: cognitive scaffold that prevents reasoning drift across turns
2. **For the user**: visible evidence that the system is building a coherent model

## Bounded Contexts

For complex domains, organize the mindmap into BOUNDED CONTEXTS — distinct regions of the problem space:

```
mindmap
  root((System))
    Context
      Known fact A
      Known fact B
    Mechanism
      *Inferred detail*
      ???
    Outcome
      Known fact C
```

Each bounded context groups related attributes. Cross-context edges reveal the most important unknowns — if you can't explain the connection between two contexts, that's your highest-priority question.

## Stopping Criterion

Stop after 5-8 questions when:
- The top hypothesis is specific and concrete
- All major dimensions have at least one resolved attribute
- Remaining unknowns can be inferred with reasonable confidence

Report progress as a fraction of dimensions confidently resolved.

## Completion

When done, deliver:
1. A confident, specific description of the identified target — present tense, no hedging
2. Include 1-2 silently inferred details that were never explicitly asked about
3. The final mindmap showing the complete reasoning path

## Information-Theoretic Properties

- Each question carries approximately log2(N) bits where N is the number of options
- With 5 options per question, each question carries ~2.3 bits maximum
- 6 questions x 2.3 bits = ~14 bits total — enough to distinguish ~16,000 targets
- Silent inference adds additional bits without consuming questions
- The 5-step verification loop prevents wasted questions (options that contradict prior answers carry 0 bits)
- Binary fallback on rejection guarantees exactly 1 bit per question — slower but reliable

## Applications

This protocol is domain-agnostic. It has been applied to:

- **Visual identification** — identifying an image someone is picturing
- **Incident reconstruction** — reconstructing workplace safety events from witness accounts
- **Diagnostic reasoning** — narrowing differential diagnoses from symptoms
- **Requirements elicitation** — extracting software requirements through structured questioning
- **User research** — identifying user needs through adaptive interviews
- **Spec alignment** — resolving ambiguous design decisions through structured Q&A (as demonstrated in the practice-surface-v2 audit)

The domain-specific layer is thin: it defines the DIMENSIONS (what the bounded contexts are) and the VOCABULARY (what options sound like). The entropy reduction engine underneath is the same.
