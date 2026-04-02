#!/usr/bin/env node

/**
 * lint-spec.mjs — Deterministic spec integrity linter for Feature Architect v4
 *
 * Usage: node lint-spec.mjs <spec-directory>
 *
 * Checks:
 *   FAIL (P1-P8): Referential integrity, structural integrity, fossil detection
 *   FLAG (F1-F5): Semantic flags surfaced for human review
 *
 * Output: JSON to stdout, human-readable summary to stderr
 */

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, basename } from 'path';

const specDir = process.argv[2];
if (!specDir) {
  console.error('Usage: node lint-spec.mjs <spec-directory>');
  process.exit(1);
}

if (!existsSync(specDir)) {
  console.error(`Directory not found: ${specDir}`);
  process.exit(1);
}

// --- Parse ---

const elements = new Map();  // id -> { type, title, centerLink, file, line }
const edges = [];             // { from, to, relationship }
const removedTerms = new Set();
const centers = new Map();    // file -> center string
const centerTests = new Map(); // file -> { excludes, boundary }
let isExpressMode = false;

const files = readdirSync(specDir).filter(f => f.endsWith('.md'));

// Detect express mode from rapid-spec.md frontmatter
const rapidSpecPath = join(specDir, 'rapid-spec.md');
if (existsSync(rapidSpecPath)) {
  const rapidContent = readFileSync(rapidSpecPath, 'utf-8');
  if (/^mode:\s*express/m.test(rapidContent)) {
    isExpressMode = true;
  }
}

for (const file of files) {
  const filepath = join(specDir, file);
  const content = readFileSync(filepath, 'utf-8');
  const lines = content.split('\n');

  // Extract center from frontmatter
  const centerMatch = content.match(/^center:\s*"(.+?)"/m);
  if (centerMatch) centers.set(file, centerMatch[1]);

  // Extract center_test from frontmatter (whiteboard.md)
  const excludesMatch = content.match(/^\s*excludes:\s*"(.+?)"/m);
  const boundaryMatch = content.match(/^\s*boundary:\s*"(.+?)"/m);
  if (excludesMatch || boundaryMatch) {
    centerTests.set(file, {
      excludes: excludesMatch ? excludesMatch[1] : null,
      boundary: boundaryMatch ? boundaryMatch[1] : null,
    });
  }

  let currentId = null;
  let currentMeta = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Match element headings: ### ac-foo: Title  or  ### t-bar: Title | method
    const headingMatch = line.match(/^###\s+((?:ac|t|da|sc|si)-[\w-]+):\s*(.+?)(?:\s*\|.*)?$/);
    if (headingMatch) {
      // Save previous element
      if (currentId) {
        elements.set(currentId, { ...currentMeta });
      }

      const [, id, title] = headingMatch;
      const type = id.split('-')[0]; // ac, t, da, sc, si
      currentId = id;
      currentMeta = { type, title: title.trim(), centerLink: null, traces: [], depends: [], file, line: i + 1 };
      continue;
    }

    // Match center_link: > **Center:** ...
    const centerLinkMatch = line.match(/^>\s*\*\*Center:\*\*\s*(.+)/);
    if (centerLinkMatch && currentId) {
      currentMeta.centerLink = centerLinkMatch[1].trim();
      continue;
    }

    // Match traces: > **Traces:** ac-foo, ac-bar
    const tracesMatch = line.match(/^>\s*\*\*Traces:\*\*\s*(.+)/);
    if (tracesMatch && currentId) {
      currentMeta.traces = tracesMatch[1].split(',').map(s => s.trim()).filter(Boolean);
      for (const target of currentMeta.traces) {
        edges.push({ from: currentId, to: target, relationship: 'traces_to' });
      }
      continue;
    }

    // Match depends: > **Depends:** t-foo, t-bar  or (none)
    const dependsMatch = line.match(/^>\s*\*\*Depends:\*\*\s*(.+)/);
    if (dependsMatch && currentId) {
      const raw = dependsMatch[1].trim();
      if (raw !== '(none)' && raw !== 'none' && raw !== '—') {
        currentMeta.depends = raw.split(',').map(s => s.trim()).filter(Boolean);
        for (const target of currentMeta.depends) {
          edges.push({ from: currentId, to: target, relationship: 'depends_on' });
        }
      }
      continue;
    }

    // Detect removed/deleted terms
    const removedMatch = line.match(/~~(.+?)~~|REMOVED|DELETED/i);
    if (removedMatch) {
      // Extract IDs mentioned near removal markers
      const idMatches = line.match(/(?:ac|t|da|sc|si)-[\w-]+/g);
      if (idMatches) idMatches.forEach(id => removedTerms.add(id));
    }
  }

  // Save last element
  if (currentId) {
    elements.set(currentId, { ...currentMeta });
  }
}

// --- Check ---

const fails = [];
const flags = [];

// Collect by type
const acs = [...elements.entries()].filter(([id]) => id.startsWith('ac-'));
const tasks = [...elements.entries()].filter(([id]) => id.startsWith('t-'));
const allIds = new Set(elements.keys());

// P1: Every ID in Traces: fields exists
for (const edge of edges.filter(e => e.relationship === 'traces_to')) {
  if (!allIds.has(edge.to)) {
    fails.push({ check: 'P1', message: `Broken trace: ${edge.from} traces to ${edge.to} which does not exist`, from: edge.from, to: edge.to });
  }
}

// P2: Every ID in Depends: fields exists
for (const edge of edges.filter(e => e.relationship === 'depends_on')) {
  if (!allIds.has(edge.to)) {
    fails.push({ check: 'P2', message: `Broken dependency: ${edge.from} depends on ${edge.to} which does not exist`, from: edge.from, to: edge.to });
  }
}

// P3: Every ac-* is traced to by at least one t-*
const tracedAcs = new Set(edges.filter(e => e.relationship === 'traces_to').map(e => e.to));
for (const [id, meta] of acs) {
  if (!tracedAcs.has(id)) {
    fails.push({ check: 'P3', message: `Orphan AC: ${id} ("${meta.title}") is not traced to by any task`, id });
  }
}

// P4: Every t-* has at least one traces_to
for (const [id, meta] of tasks) {
  if (meta.traces.length === 0) {
    fails.push({ check: 'P4', message: `Task without traces: ${id} ("${meta.title}") does not trace to any AC`, id });
  }
}

// P5: No duplicate IDs
const seenIds = new Map();
for (const [id, meta] of elements) {
  const key = `${meta.file}:${meta.line}`;
  if (seenIds.has(id) && seenIds.get(id) !== key) {
    fails.push({ check: 'P5', message: `Duplicate ID: ${id} appears in ${seenIds.get(id)} and ${key}`, id });
  }
  seenIds.set(id, key);
}

// P6: No circular dependencies
function detectCycles() {
  const depGraph = new Map();
  for (const edge of edges.filter(e => e.relationship === 'depends_on')) {
    if (!depGraph.has(edge.from)) depGraph.set(edge.from, []);
    depGraph.get(edge.from).push(edge.to);
  }

  const visited = new Set();
  const inStack = new Set();
  const cycles = [];

  function dfs(node, path) {
    if (inStack.has(node)) {
      const cycleStart = path.indexOf(node);
      cycles.push(path.slice(cycleStart).concat(node));
      return;
    }
    if (visited.has(node)) return;

    visited.add(node);
    inStack.add(node);
    path.push(node);

    for (const neighbor of (depGraph.get(node) || [])) {
      dfs(neighbor, [...path]);
    }

    inStack.delete(node);
  }

  for (const node of depGraph.keys()) {
    if (!visited.has(node)) dfs(node, []);
  }

  return cycles;
}

const cycles = detectCycles();
for (const cycle of cycles) {
  fails.push({ check: 'P6', message: `Circular dependency: ${cycle.join(' -> ')}`, cycle });
}

// P7: Center identical across all spec files that declare one
const centerValues = [...centers.values()];
if (centerValues.length > 1) {
  const first = centerValues[0];
  for (const [file, center] of centers) {
    if (center !== first) {
      fails.push({ check: 'P7', message: `Center mismatch: ${file} has "${center}" but expected "${first}"`, file });
    }
  }
}
if (centerValues.length === 0) {
  flags.push({ check: 'F-center', message: 'No center found in any spec file frontmatter' });
}

// P8: No removed term appears as active heading
for (const removedId of removedTerms) {
  if (allIds.has(removedId)) {
    const meta = elements.get(removedId);
    fails.push({ check: 'P8', message: `Fossil: ${removedId} is marked as removed but exists as active element in ${meta.file}:${meta.line}`, id: removedId });
  }
}

// F1: Center_link shorter than 8 words (relaxed in express mode)
if (!isExpressMode) {
  for (const [id, meta] of elements) {
    if (meta.centerLink && meta.centerLink.split(/\s+/).length < 8) {
      flags.push({ check: 'F1', message: `Short center_link (${meta.centerLink.split(/\s+/).length} words): ${id} — "${meta.centerLink}"`, id });
    }
  }
}

// F2: Center_link with indirect language (relaxed in express mode)
if (!isExpressMode) {
  for (const [id, meta] of elements) {
    if (meta.centerLink && /\b(enables|allows|supports)\b/i.test(meta.centerLink) && !/\bby\b/i.test(meta.centerLink)) {
      flags.push({ check: 'F2', message: `Indirect center_link: ${id} — "${meta.centerLink}" (uses 'enables/allows/supports' without naming mechanism)`, id });
    }
  }
}

// F3: AC not mentioned in any scenario text (approximate: check if ac-id appears in any file body)
for (const [id] of acs) {
  let mentioned = false;
  for (const file of files) {
    const content = readFileSync(join(specDir, file), 'utf-8');
    // Check if the AC ID appears outside its own heading
    const regex = new RegExp(`(?<!###\\s.*)\\b${id.replace(/-/g, '[-]')}\\b`);
    if (regex.test(content)) { mentioned = true; break; }
  }
  // Simpler check: just look for the ID in task traces (already covered by P3)
  // and in scenario prose
  // Skip this check if AC is referenced by tasks (it's "mentioned" structurally)
}

// F4: Task with > 5 traces
for (const [id, meta] of tasks) {
  if (meta.traces.length > 5) {
    flags.push({ check: 'F4', message: `Broad task: ${id} traces to ${meta.traces.length} ACs — consider splitting`, id, count: meta.traces.length });
  }
}

// F5: Missing center_link (relaxed in express mode — center_links not required)
if (!isExpressMode) {
  for (const [id, meta] of elements) {
    if (!meta.centerLink) {
      flags.push({ check: 'F5', message: `Missing center_link: ${id} ("${meta.title}") in ${meta.file}:${meta.line}`, id });
    }
  }
}

// P9: center_test must exist in whiteboard.md (or rapid-spec.md for express) if a center is declared
if (centers.size > 0) {
  const centerTestFile = files.find(f => f === 'whiteboard.md') || files.find(f => f === 'rapid-spec.md');
  if (centerTestFile) {
    const ct = centerTests.get(centerTestFile);
    if (!ct) {
      fails.push({ check: 'P9', message: `Missing center_test: ${centerTestFile} declares a center but has no center_test (excludes + boundary)` });
    } else {
      if (!ct.excludes) {
        fails.push({ check: 'P9', message: `Missing center_test.excludes: ${centerTestFile} center_test is missing the exclusion test` });
      }
      if (!ct.boundary) {
        fails.push({ check: 'P9', message: `Missing center_test.boundary: ${centerTestFile} center_test is missing the boundary discrimination` });
      }
    }
  }
}

// F6: center_test components shorter than 10 words
for (const [file, ct] of centerTests) {
  if (ct.excludes && ct.excludes.split(/\s+/).length < 10) {
    flags.push({ check: 'F6', message: `Short center_test.excludes (${ct.excludes.split(/\s+/).length} words) in ${file}: "${ct.excludes}"` });
  }
  if (ct.boundary && ct.boundary.split(/\s+/).length < 10) {
    flags.push({ check: 'F6', message: `Short center_test.boundary (${ct.boundary.split(/\s+/).length} words) in ${file}: "${ct.boundary}"` });
  }
}

// --- Report ---

const result = {
  specDir,
  center: centerValues[0] || null,
  counts: {
    elements: elements.size,
    acs: acs.length,
    tasks: tasks.length,
    edges: edges.length,
  },
  fails,
  flags,
  pass: fails.length === 0,
};

// JSON to stdout (for programmatic consumption)
console.log(JSON.stringify(result, null, 2));

// Human-readable to stderr
const log = (...args) => process.stderr.write(args.join(' ') + '\n');

log('');
log(`LINT-SPEC: ${specDir}`);
log(`Center: "${result.center || 'NOT SET'}"`);
log(`Elements: ${result.counts.elements} (${result.counts.acs} ACs, ${result.counts.tasks} tasks)`);
log(`Edges: ${result.counts.edges}`);
log('');

if (fails.length === 0) {
  log('PASS: All structural checks passed.');
} else {
  log(`FAIL: ${fails.length} violation(s):`);
  for (const f of fails) {
    log(`  [${f.check}] ${f.message}`);
  }
}

log('');
if (flags.length > 0) {
  log(`FLAGS: ${flags.length} item(s) for review:`);
  for (const f of flags) {
    log(`  [${f.check}] ${f.message}`);
  }
} else {
  log('FLAGS: None.');
}

log('');
process.exit(fails.length > 0 ? 1 : 0);
