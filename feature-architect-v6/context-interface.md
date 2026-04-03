# Context Module Interface v1

A context module is a markdown file that teaches the Feature Architect protocol about a specific system. The protocol contains ZERO system-specific knowledge — everything it needs to know about your tech stack, patterns, tools, and conventions comes from this file.

## When to write one

- Before using the protocol on an existing codebase for the first time
- The protocol will write one FOR YOU when bootstrapping a greenfield system (during the mechanism loop)
- Update it when your system's patterns change significantly

## Composability

A context module degrades gracefully. Only **System Identity** and **Discovery Protocol** are required. Every other section is optional — the protocol compensates for missing sections by asking more questions at checkpoints and making more conservative design decisions.

| Sections present | Protocol behavior |
|---|---|
| All 7 | Full autonomy — protocol makes confident decisions |
| 4-6 | Moderate autonomy — protocol flags uncertainty at checkpoints |
| 2-3 | Guided mode — protocol asks targeted questions before each loop |
| 1 (System Identity only) | Interview mode — protocol asks the user to fill gaps as they arise |

---

## Required Sections

### 1. System Identity

One paragraph. What is this system, what tech stack, what's its purpose? This orients the protocol's reasoning for every subsequent decision.

```markdown
## System Identity

[App name] is a [type of application] built with [primary tech stack].
It serves [who] by [doing what]. The codebase lives at [path/repo].
Current state: [greenfield | early | mature | legacy].
```

### 2. Discovery Protocol

How does the agent learn what already exists? List commands, file patterns, or exploration strategies the agent should run during triage to understand the current system state.

```markdown
## Discovery Protocol

- Read [file] for [what it reveals]
- Glob for [pattern] to find [what]
- Run [command] to discover [what]
- Check [location] for [what]
```

The protocol runs these during triage, BEFORE any deliberation begins. The results inform the complexity assessment and feed into the intent loop as context.

---

## Optional Sections

### 3. Decomposition Patterns

How does this system break features into parts? What are the fundamental building blocks ("atoms")? When the protocol encounters a feature request, these heuristics guide how it decomposes the feature into buildable units.

```markdown
## Decomposition Patterns

### Atoms
The fundamental units of this system are:
- [atom type]: [what it is, when to create one]
- [atom type]: [what it is, when to create one]

### Decision Heuristics
| Signal in the requirement | Result |
|---|---|
| [signal] | [what to build] |
| [signal] | [what to build] |
| [signal] | [DON'T build — use existing X instead] |
```

Include "DON'T build" heuristics — knowing what NOT to create is as valuable as knowing what to create.

### 4. Construction Patterns

How are parts built? List available skills, generators, CLI tools, or manual processes. Each entry describes a tool the protocol can invoke during the execution loop.

```markdown
## Construction Patterns

| Tool/Skill | Produces | When to use | Invocation |
|---|---|---|---|
| [name] | [what it creates] | [conditions] | [how to run it] |
```

For codebases with Claude Code skills, list each skill. For other systems, list generators (`rails generate`, `nx generate`, `prisma migrate`), CLI tools, or describe the manual file-creation process.

### 5. Verification Patterns

How do you confirm something works? Build commands, test frameworks, linters, type checkers, manual checks. The protocol runs these during the execution loop's verify step.

```markdown
## Verification Patterns

### Build
- [command]: [what it verifies]

### Test
- [command/framework]: [what it tests]

### Lint/Type Check
- [command]: [what it catches]

### Manual Verification
- [description of what to check manually, if applicable]
```

The protocol maps acceptance criteria to verification methods. If an AC can be verified automatically, it will be. If not, it flags the AC for manual verification at completion.

### 6. Conventions

Naming patterns, file structure, architectural constraints, style rules. The protocol consults these during the mechanism loop to ensure designs conform to existing patterns.

```markdown
## Conventions

### Naming
- [scope]: [pattern] (e.g., "Files: kebab-case", "Components: PascalCase")

### File Structure
- [description of where things go]

### Architectural Rules
- [constraint]: [why]
```

### 7. Known Traps

Things that commonly go wrong. Failure modes the agent should watch for. This section grows over time as the reflection protocol appends discoveries.

```markdown
## Known Traps

- [trap]: [what goes wrong, how to avoid it]
```

---

## Lifecycle

The context module is a **living document**. The protocol's reflection step (after execution) may propose updates:

- **New known trap discovered** → appended to Known Traps
- **Convention violation found** → checked against Conventions, added if missing
- **New construction pattern used** → added to Construction Patterns

Protocol-level observations (about the Feature Architect process itself) go to the protocol's own reflection log, NOT to the context module. The context module only contains system-specific knowledge.
