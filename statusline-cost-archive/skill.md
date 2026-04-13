---
name: statusline-telemetry-archive
description: "Operational reference for the user's custom Claude Code statusline (~/.claude/statusline-command.sh) and the DuckDB telemetry archive (~/claude-archive/state.duckdb). Use when the user asks how the statusline works, wants to query their Claude interaction history (messages, tokens, cache hits, tool calls, models used, sessions), mentions v_rollups / v_messages / claude-archive / cost-log, asks questions about their usage patterns, wants to add or modify a statusline cell, or is debugging statusline values."
---

# Statusline & Telemetry Archive

Operational guide for the user's personal Claude Code observability stack: a bash statusline script that renders a 3-row dashboard, backed by a DuckDB archive of telemetry from every message Claude has ever exchanged in this user's sessions.

The archive is a queryable history of interactions: message content, token counts, cache hits, tool calls, models used, session metadata, and more. `~/.claude/CLAUDE.md` documents the high-level architecture. **This skill is the operational layer**: how to query the archive, where things live in the script, and what not to break. Defer to `CLAUDE.md` for context, come here for action.

## TL;DR

| Thing | Path |
|---|---|
| Statusline script | `~/.claude/statusline-command.sh` |
| DuckDB archive | `~/claude-archive/state.duckdb` (override: `$CLAUDE_ARCHIVE`) |
| Ingest & query scripts | `~/.claude/cost-log/{backup,analytics,auto-jsonl-backup,snapshot}.sh` |
| Ingest lock | `~/claude-archive/.logs/ingest.lock.d/` |
| Effort override | `$CLAUDE_CODE_EFFORT_LEVEL` env var |

**The single most load-bearing fact:** all queries go through **`v_messages`** (the deduped, latest-version-per-uuid view of the 230K+ row `messages` archive). Never query raw `messages` — you'll double-count versioned rows. Aggregates like `v_rollups`, `v_session_stats`, `v_tool_calls`, and `v_tool_results` all feed off `v_messages`.

## Running queries safely

The DB path resolves to `${CLAUDE_ARCHIVE:-$HOME/claude-archive}/state.duckdb`. Set this in a shell variable first:

```bash
DB="${CLAUDE_ARCHIVE:-$HOME/claude-archive}/state.duckdb"
```

### Read-only safety rules

- **Never INSERT/UPDATE/DELETE on `messages` from a Claude session.** That is `backup.sh refresh`'s exclusive job. Concurrent writes can collide with the mkdir-based ingest lock at `~/claude-archive/.logs/ingest.lock.d/`.
- **Reads are always safe.** DuckDB handles concurrent reads fine.
- **Don't call `backup.sh refresh` to "freshen the data" before a query.** The archive is already kept up to date by `auto-jsonl-backup.sh` (periodic auto-ingest of new JSONL files). The data is live; ad-hoc refreshes are unnecessary.

### Four invocation patterns

```bash
# Pattern 1 — CSV, no header (what the statusline uses internally)
duckdb -csv -noheader "$DB" <<SQL
SELECT cost_24h, cost_7d, cost_30d FROM v_rollups;
SQL

# Pattern 2 — Inline single-statement query
duckdb "$DB" "SELECT * FROM v_messages LIMIT 10;"

# Pattern 3 — Multi-statement heredoc with formatted output
duckdb "$DB" <<SQL
.mode box
SELECT model, COUNT(*) AS msgs
FROM v_messages
WHERE role = 'assistant'
GROUP BY model
ORDER BY msgs DESC;
SQL

# Pattern 4 — Export query result via COPY TO
duckdb "$DB" <<SQL
COPY (
  SELECT raw FROM v_messages
  WHERE session_id = 'abc-123'
  ORDER BY source_file, line_no
) TO '/tmp/session.jsonl' (FORMAT JSON, ARRAY false);
SQL
```

If `$DB` doesn't exist (fresh machine), every command above silently fails. The statusline handles this gracefully (cells render `$0.00`); ad-hoc queries surface a "no such file" error. Bootstrap with `~/.claude/cost-log/backup.sh refresh`.

## Schema cheatsheet

Don't memorize the DDL — fetch it on demand with `duckdb "$DB" ".schema"` or `duckdb "$DB" ".schema messages"`. This table is the mental map.

| Object | Purpose | Key columns | Gotchas |
|---|---|---|---|
| `messages` (table) | Append-only JSONL archive | `uuid`, `content_hash`, `ts`, `role`, `model`, `in_tokens`, `out_tokens`, `cache_create_tokens`, `cache_read_tokens`, `raw` JSON | PK is `(uuid, content_hash)` — same uuid + new hash = a new *version*, not an overwrite. **Always query through `v_messages`.** |
| `v_messages` (view) | Deduped, latest version per uuid | All `messages` cols + `parent_uuid`, `is_sidechain`, `cwd`, `git_branch`, `stop_reason`, `service_tier` | Use this for all queries, never raw `messages`. Filtering by `role='assistant'` or `role='user'` to segment Claude vs. user messages. |
| `v_session_stats` (view) | Per-session aggregates | `session_id`, `message_count`, `assistant_turns`, `user_turns`, `total_tokens`, `span_seconds` | Group queries by `session_id` to understand session-level patterns. |
| `v_tool_calls` (view) | Exploded tool_use blocks | `tool_use_id`, `tool_name`, `tool_input`, `block_seq` | Built via `json_each` over `message.content`. Shows every tool call Claude made. |
| `v_tool_results` (view) | Exploded tool_result blocks | `tool_use_id`, `is_error`, `result_content` | Join to `v_tool_calls` on `tool_use_id` to correlate calls with results. |
| `v_message_history` (view) | Version log | `uuid`, `version_num`, `total_versions` | For debugging re-ingestion and understanding message versioning. |
| `sessions` (table) | Statusline UPSERT cache | `session_id`, `cost_usd`, `billing_mode`, `model`, `cwd` | Metadata written once per statusline tick. Used only by `backup.sh status` — not the source of truth for analysis. |
| `model_rates` (table) | Token pricing (for cost only) | `model_id`, `input_per_mtok`, `output_per_mtok`, `cache_create_per_mtok`, `cache_read_per_mtok`, `effective_from`, `effective_to` | Used only if computing costs. Historical rows use historical rates. |
| `v_message_cost` (view) | Per-assistant-turn cost (for billing only) | `cost_usd` (computed) | Filtered to `role = 'assistant'` only. Use if you need cost breakdown; ignore if you don't. |
| `v_rollups` (view) | Rolling-window cost aggregates | `cost_24h`, `cost_7d`, `cost_30d`, `cost_all_time` | Single-row view. Powers the statusline row 3 cost cells. Ignore if not interested in cost. |
| `ingested_files` (table) | Archive provenance | `source_file`, `last_ingest_at`, `still_exists` | Tracks which JSONL files have been backed up. Mostly for maintenance. |

## Query cookbook

Copy-paste-ready. All assume `DB="${CLAUDE_ARCHIVE:-$HOME/claude-archive}/state.duckdb"`. These examples span message history, token usage, caching, tool behavior, models, and sessions.

### 1. Session activity over time

Use when: "what projects have I been working on?" or "show me my session timeline"

```bash
duckdb "$DB" <<SQL
SELECT
  v.ts::DATE AS date,
  COUNT(DISTINCT v.session_id) AS sessions,
  COUNT(*) AS total_messages,
  COUNT(DISTINCT CASE WHEN v.role = 'assistant' THEN v.uuid END) AS claude_responses
FROM v_messages v
WHERE v.ts >= current_timestamp - INTERVAL '30 days'
GROUP BY v.ts::DATE
ORDER BY v.ts::DATE DESC;
SQL
```

### 2. Which projects get the most Claude interaction (last 30 days)

Use when: "which codebases have I been using Claude on most?" or "where am I spending time?"

```bash
duckdb "$DB" <<SQL
SELECT
  substr(v.cwd, 1, 60) AS project,
  COUNT(DISTINCT v.session_id) AS sessions,
  COUNT(*) AS messages,
  SUM(CASE WHEN v.role = 'assistant' THEN 1 ELSE 0 END) AS claude_messages
FROM v_messages v
WHERE v.ts >= current_timestamp - INTERVAL '30 days'
  AND v.cwd IS NOT NULL
GROUP BY project
ORDER BY claude_messages DESC
LIMIT 20;
SQL
```

### 3. Model distribution

Use when: "am I using Opus, Sonnet, or Haiku most?" or "which model is dominant in my workflow?"

```bash
duckdb "$DB" <<SQL
SELECT
  model,
  COUNT(*) AS messages,
  COUNT(DISTINCT session_id) AS sessions,
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 1) AS percent
FROM v_messages
WHERE role = 'assistant' AND model IS NOT NULL
GROUP BY model
ORDER BY messages DESC;
SQL
```

### 4. Cache hit rates by model

Use when: "is prompt caching working for me?" or "which models benefit most from caching?"

```bash
duckdb "$DB" <<SQL
SELECT
  model,
  COUNT(*) AS assistant_msgs,
  SUM(in_tokens + COALESCE(cache_read_tokens, 0)) AS total_input_tokens,
  SUM(cache_read_tokens) AS from_cache,
  COALESCE(ROUND(100.0 * SUM(cache_read_tokens) /
    NULLIF(SUM(in_tokens + COALESCE(cache_read_tokens, 0)), 0), 1), 0) AS cache_hit_rate_pct
FROM v_messages
WHERE role = 'assistant' AND model IS NOT NULL
GROUP BY model
ORDER BY assistant_msgs DESC;
SQL
```

### 5. Tool usage and error rate

Use when: "which tools do I use most?" or "which tools are failing?"

```bash
duckdb "$DB" <<SQL
WITH calls AS (
  SELECT tool_use_id, tool_name FROM v_tool_calls
),
results AS (
  SELECT tool_use_id, is_error FROM v_tool_results
)
SELECT
  c.tool_name,
  COUNT(*) AS calls,
  SUM(CASE WHEN r.is_error THEN 1 ELSE 0 END) AS errors,
  ROUND(100.0 * SUM(CASE WHEN r.is_error THEN 1 ELSE 0 END) / COUNT(*), 1) AS error_rate_pct
FROM calls c
LEFT JOIN results r USING (tool_use_id)
GROUP BY c.tool_name
ORDER BY calls DESC
LIMIT 20;
SQL
```

### 6. Token usage by model (last 30 days)

Use when: "how many tokens am I generating?" or "which model is most token-heavy?"

```bash
duckdb "$DB" <<SQL
SELECT
  model,
  SUM(in_tokens) AS input_tokens,
  SUM(out_tokens) AS output_tokens,
  SUM(in_tokens + out_tokens) AS total_tokens,
  ROUND(AVG(out_tokens), 0) AS avg_output_per_response
FROM v_messages
WHERE role = 'assistant' AND model IS NOT NULL
  AND ts >= current_timestamp - INTERVAL '30 days'
GROUP BY model
ORDER BY total_tokens DESC;
SQL
```

### 7. Top sessions by message count and token usage

Use when: "which sessions were my most active?" or "when did I do the deepest thinking?"

```bash
duckdb "$DB" <<SQL
SELECT
  v.session_id,
  MAX(v.ts)::DATE AS last_active,
  COUNT(*) AS total_messages,
  COUNT(DISTINCT CASE WHEN v.role = 'assistant' THEN v.uuid END) AS claude_responses,
  SUM(v.in_tokens + v.out_tokens) AS total_tokens,
  any_value(substr(v.cwd, 1, 40)) AS project
FROM v_messages v
GROUP BY v.session_id
ORDER BY total_tokens DESC
LIMIT 20;
SQL
```

### 8. Per-session message transcript

Use when: examining a specific session in detail (replace SESSION_ID with an actual uuid)

```bash
SESSION_ID="paste-uuid-here"
duckdb "$DB" <<SQL
SELECT
  v.ts::TIMESTAMP(0) AS time,
  v.role,
  v.model,
  v.in_tokens,
  v.out_tokens,
  COALESCE(v.cache_read_tokens, 0) AS cache_read,
  v.stop_reason,
  substr(raw, 1, 80) AS preview
FROM v_messages v
WHERE v.session_id = '$SESSION_ID'
ORDER BY v.ts;
SQL
```

### 9. Cost rollups (for billing/budgeting only)

Use when: you need to understand API pricing implications

```bash
duckdb "$DB" "SELECT cost_24h, cost_7d, cost_30d, cost_all_time FROM v_rollups;"
```

For more ad-hoc queries and examples see `~/.claude/cost-log/analytics.sh`.

## Statusline anatomy

Map of `~/.claude/statusline-command.sh` so you can jump straight to the right section before editing. Line numbers verified against the current script.

| Behavior | Lines | Notes |
|---|---|---|
| Read JSON payload from stdin | top of file | `input=$(cat)` then everything is `jq` against `$input` |
| Extract `cwd` | 30–40 | `.cwd // .workspace.current_dir // ""` |
| Extract `model` + `[1M]` suffix | 54–61 | Appends `[1M]` when `.exceeds_200k_tokens == true` |
| Effort cell precedence | 68–76 | `$CLAUDE_CODE_EFFORT_LEVEL` → `./.claude/settings.json` → `~/.claude/settings.json` → `medium` |
| Billing-mode detection | 92–102 | `jq -e '.rate_limits'` — present = `sub` (green), absent = `💸api💸` (blinking red) |
| Context-window color tiers | 149–161 | <70% green, 70–89% yellow, ≥90% red |
| Session `cost_usd` extract | 178 | `.cost.total_cost_usd // empty` |
| `COST_DB` path | 212 | `${CLAUDE_ARCHIVE:-$HOME/claude-archive}/state.duckdb` |
| DuckDB UPSERT + rollup SELECT | 228–244 | One `duckdb -csv -noheader` call: writes a `sessions` row, then `SELECT cost_24h, cost_7d, cost_30d FROM v_rollups`. Result parsed by `IFS=',' read -r cost_24h cost_7d cost_30d`. |
| Rate-limit color tiers | 257–274 | <60 green, 60–79 yellow, 80–89 orange, 90–99 red, ≥100 blinking bold red with 💀 skulls |
| Wide-emoji width correction | 292–309 | `visible_len()` strips ANSI then adds +1 per occurrence of each wide emoji in the hardcoded list |
| Column padding | 311–320 | `pad_right()` aligns all 3 rows by computing the max visible width per column index |

### Dry-running the statusline

```bash
echo '{"session_id":"test","cwd":"'"$PWD"'","model":{"display_name":"Opus 4.6"},"cost":{"total_cost_usd":0,"total_duration_ms":0,"total_lines_added":0,"total_lines_removed":0},"workspace":{"current_dir":"'"$PWD"'"},"rate_limits":{"five_hour":{"used_percentage":1},"seven_day":{"used_percentage":1}}}' \
  | ~/.claude/statusline-command.sh
```

To simulate API-fallback mode, drop the `rate_limits` key from the payload — billing cell should turn into the blinking `💸api💸`.

## Modifying the statusline / archive — invariants

Things that will silently break the system if violated. These are the load-bearing assumptions.

- **Adding a new wide emoji to the statusline output** → must also add it to the wide-emoji list inside `visible_len()` (lines 292–309). Otherwise that row's columns will drift left of the others by one cell per occurrence.

- **Adding a new statusline cell** → re-think column layout (3 rows × N cols, all aligned). Use semantic colors only (`$GREEN`, `$YELLOW`, `$RED`, `$ORANGE`, `$RESET` — no raw ANSI). Test with the dry-run snippet above.

- **Removing or renaming the DuckDB UPSERT** (lines 228–237) → breaks `backup.sh status`'s per-session display. The UPSERT and the rollup SELECT happen in one `duckdb` invocation; you can't drop one without rewriting both.

- **Adding a new model** → seed a row in `model_rates` with `effective_from` set to its first-seen date and `effective_to = NULL`. Without it, cost queries will compute `cost_usd = NULL` for that model (LEFT JOIN miss).

- **Adding a hot-field column to `messages`** (e.g. tracking a new usage field) → this is a 4-place change: (1) the `CREATE TABLE messages` DDL, (2) `backup.sh refresh`'s INSERT column list and value extraction, (3) `v_messages`'s SELECT list, (4) any downstream view that needs to surface it. Skipping any one of these silently breaks backfill.

- **Modifying `v_messages` deduplication logic** → this is the linchpin. All downstream queries depend on it returning exactly one row per `(uuid, content_hash)` pair. If the logic breaks (e.g. `NOT EXISTS` condition becomes inverted), aggregate views like `v_tool_calls`, `v_session_stats`, and cost rollups will double-count.

- **Bootstrap on a fresh machine** → no DB → statusline cells render empty and the `duckdb` shell-out exits silently. Run `~/.claude/cost-log/backup.sh refresh` once to create the schema and ingest existing JSONL files. The statusline starts working on the next tick.

- **Effort cell drift** → mid-session `/effort max` does NOT persist to settings.json on Opus 4.6, so the cell won't update unless the session was launched with `CLAUDE_CODE_EFFORT_LEVEL=max` in the environment. Don't try to "fix" this in the statusline script — fix the launch env instead.

## Quick verification

After any change to the statusline or schema:

```bash
# 1. Statusline still parses + renders
echo '{"session_id":"verify","cwd":"'"$PWD"'","model":{"display_name":"Opus 4.6"},"cost":{"total_cost_usd":0,"total_duration_ms":0,"total_lines_added":0,"total_lines_removed":0},"workspace":{"current_dir":"'"$PWD"'"},"rate_limits":{"five_hour":{"used_percentage":1},"seven_day":{"used_percentage":1}}}' \
  | ~/.claude/statusline-command.sh

# 2. Core views are still queryable
duckdb "${CLAUDE_ARCHIVE:-$HOME/claude-archive}/state.duckdb" \
  "SELECT COUNT(*) AS messages FROM v_messages; SELECT COUNT(*) AS calls FROM v_tool_calls;"

# 3. Schema integrity check
duckdb "${CLAUDE_ARCHIVE:-$HOME/claude-archive}/state.duckdb" ".schema" | head -50

# 4. Ingest pipeline still works
~/.claude/cost-log/backup.sh status
```

If the statusline renders, `v_messages` and `v_tool_calls` return row counts, schema is intact, and `backup.sh status` shows metadata, the archive is healthy.
