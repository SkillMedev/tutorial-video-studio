# Contributing

This repo is reference-standard catalog content for [Skill Me](https://skillme.dev).
Clone it, imitate it. The bar is high on purpose: a skill's `description` is what
decides whether it fires at the right moment and stays quiet otherwise.

## What a skill is

One skill is a single `SKILL.md` file living in its own directory under
[`skills/`](skills/):

```
skills/<kebab-case-name>/SKILL.md
```

The file is YAML frontmatter followed by an imperative Markdown body:

```markdown
---
name: Screencast Capture
description: <trigger-precise, see below>
---

# Screencast Capture

<imperative body — tell the agent what to do, in order>
```

## Frontmatter rules

- **`name`** — Title Case, human-readable (e.g. `Screencast Capture`). Required,
  non-empty.
- **`description`** — required, non-empty, and **trigger-precise** (see the bar
  below). This is the single most important field.
- The **directory name must be the kebab-case of `name`** —
  `Screencast Capture` → `screencast-capture`. The validator enforces this:
  lowercase, every run of non-alphanumerics collapses to one hyphen, leading and
  trailing hyphens trimmed.

## Body rules

- Start with an **H1** (`# Skill Name`).
- Imperative voice: tell the agent what to do, in the order it should do it.
- **No placeholder content.** `TODO`, `TKTK`, `lorem`, `<placeholder>`, and
  `[fill…` are rejected by the validator. Ship production-quality prose or don't
  ship the skill.
- Author the body as final content. Don't summarize or stub.

## The trigger-precision bar

A description has to do two jobs: pull the skill in when it's the right tool, and
keep it out of the way when it isn't. Earn both.

- **Say when to use it, concretely.** Include a `Use when…` clause and quote the
  phrases a user actually says — a "when someone says …" list of literal triggers
  (`"record my screen"`, `"export an SRT or VTT"`). This is how the matcher and
  the model both decide relevance.
- **Say when *not* to use it.** Add explicit `Do NOT use …` cross-references that
  hand off to the neighbouring skill by name. Non-overlapping boundaries are what
  keep a pack of related skills from fighting each other at invocation time.
- **Make it long enough to disambiguate.** Descriptions under 12 words almost
  never carry enough signal; the validator warns below that threshold.

Read the three skills in this repo as worked examples — each names its siblings
in both the `description` and a closing `## Don't` section.

## Adding or modifying a skill

1. Create `skills/<kebab-name>/SKILL.md` (or edit an existing one).
2. If it's a new **pack member**, add it to [`pack.yaml`](pack.yaml) in pipeline
   order with a `tier` (`core` or `optional`), and add a corresponding row to the
   migration's `members` CTE in
   [`migrations/0001_tutorial_video_studio_pack.sql`](migrations/0001_tutorial_video_studio_pack.sql).
   Both resolve members **by slug**.
3. Run the validator and make it pass with no errors:

   ```bash
   npm install
   npm run validate
   ```

4. Open a PR. CI runs the same validator on every push and pull request.

## What the validator checks

Hard failures (non-zero exit, blocks merge):

- frontmatter parses and has non-empty `name` and `description`
- body is non-empty, has an H1, and contains no placeholder tokens
- the directory name matches the kebab-case of `name`

Soft warnings (printed, don't block):

- `description` under 12 words
- `description` missing a trigger cue (`use when`, `do not use`, or a
  "when someone says" phrase)

## Scope

This repo is **catalog content only**. Nothing here imports from or modifies the
live Skill Me MCP server or its tool signatures (`install_pack`, `install_skill`,
`get_active_skills`, and the rest). The `pack.yaml` shape and the migration's DDL
are best-effort and carry schema-confirmation notes — confirm them against Skill
Me's real ingest before wiring this pack into the live catalog.
