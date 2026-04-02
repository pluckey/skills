# Claude Code Skills

A collection of [Claude Code](https://docs.anthropic.com/en/docs/claude-code) skills — reusable protocol files that extend Claude's capabilities for software engineering tasks.

## Skills

### [Feature Architect v5](./feature-architect-v5/)

A multi-loop deliberation protocol that turns natural language descriptions into working software through structured expert roundtables, structural linting, and adversarial quality gates.

## Installation

Copy a skill directory into your project's `.claude/skills/` or your global `~/.claude/skills/`:

```bash
# Project-local (recommended)
cp -r feature-architect-v5 /path/to/your/project/.claude/skills/feature-architect-v5

# Global (available in all projects)
cp -r feature-architect-v5 ~/.claude/skills/feature-architect-v5
```

## License

MIT
