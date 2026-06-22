# Tutorial & Demo Video Studio

A first-party [Skill Me](https://skillme.dev) pack: a complete, end-to-end
pipeline for making a **narrated tutorial or product demo** — from beat sheet to
captioned export. It is assembled almost entirely from skills already in the
catalog, with **three new first-party skills** filling the tutorial-specific gaps
the existing (marketing-demo-flavored) suite didn't cover.

Each skill is a `SKILL.md` file: YAML frontmatter (`name` + a trigger-precise
`description`) followed by an imperative Markdown body. Skill Me ingests these
into its catalog; a pack is a curated, ordered bundle of them.

## The 12-skill pipeline

Install the pack and you get the workflow top to bottom. **core** = the spine of
any narrated tutorial; **optional** = pulled in for animated / recreated-UI
segments or social delivery.

| # | Skill | slug | Tier | Role in pipeline |
|---|-------|------|------|------------------|
| 1 | Video Storyboard | `video-storyboard` | core | Plan beats → JSON scene plan |
| 2 | Screencast Capture | `screencast-capture` | core | **(new)** Record clean raw footage |
| 3 | Narration Script | `narration-script` | core | **(new)** Write the spoken VO, synced to actions |
| 4 | Product Demo Director | `product-demo-director` | core | Direct cursor / zoom / callouts |
| 5 | Motion Design Principles | `motion-design-principles` | optional | Easing/timing craft for animated bits |
| 6 | Kinetic Typography | `kinetic-typography` | core | On-screen labels, lower-thirds, callouts |
| 7 | Remotion Setup | `remotion-setup` | optional | Scaffold a Remotion project (intros / recreated UI) |
| 8 | Remotion Compose | `remotion-compose` | optional | Author animated compositions |
| 9 | Sound and Music Sync | `sound-and-music-sync` | core | Mix VO, duck music, land SFX |
| 10 | Captions From Transcript | `captions-from-transcript` | core | **(new)** Accurate, timed SRT/VTT |
| 11 | Remotion Render | `remotion-render` | optional | Export MP4 / iterate / batch |
| 12 | Social Video Formatter | `social-video-formatter` | optional | Reframe + burn-in captions per platform |

> `motion-color-and-light` exists in the catalog but its ID did not surface via
> search. The pack manifest and migration resolve members **by slug**, so it can
> be added as an optional 13th member without blocking anything — it is left
> commented out in both [`pack.yaml`](pack.yaml) and the migration.

## The three new skills

The existing video suite is excellent but was built for **marketing / launch
videos** (storyboard → Remotion → motion craft → social reframe). A *tutorial*
has three needs that suite didn't cover. These three live in this repo, under
[`skills/`](skills/):

1. **[Screencast Capture](skills/screencast-capture/SKILL.md)** — the actual
   *act* of recording clean footage (recorder choice, fps/cursor/mic, a
   distraction-free stage, retakeable segments). `product-demo-director` directs
   what's on screen but assumes you already have footage; capture is the biggest
   hole for tutorials.
2. **[Narration Script](skills/narration-script/SKILL.md)** — writes the *words*
   of the voiceover, synced one-instruction-per-action and paced to a budget.
   `sound-and-music-sync` mixes and paces audio but doesn't write the script.
3. **[Captions From Transcript](skills/captions-from-transcript/SKILL.md)** —
   generates an *accurate, timed* caption track (SRT/VTT) from audio.
   `social-video-formatter` burns in and styles captions but presumes a track
   already exists.

All three use non-overlapping trigger language with explicit `Do NOT use when…`
cross-references, matching the suite's existing discipline so there is no
ambiguity at invocation time.

## Install (via the Skill Me MCP server)

Skill Me is claude.ai-native: you install skills and packs by talking to its
**MCP server**, and they load into your session as agent context.

1. **Connect the Skill Me MCP server** in claude.ai (Settings → Connectors). The
   catalog and connection details live at [skillme.dev](https://skillme.dev).
2. **Install the pack.** Ask Claude to install it, or call the
   **`install_pack`** tool with this pack's slug, `tutorial-video-studio`. To
   add a single member instead, use **`install_skill`** with that skill's slug.
3. **Load it into the session.** **`get_active_skills`** runs at the start of a
   session and loads everything you've installed so the skills apply for the
   whole conversation. (Browse first with **`browse_packs`** / **`browse_skills`**,
   review your library with **`list_installed`**, and remove with
   **`uninstall_skill`**.)

This repo is **catalog content only** — `SKILL.md` files, a pack manifest, and a
seed migration. It does not import from or modify the live MCP server or its tool
signatures.

## Repository layout

```
tutorial-video-studio/
├── README.md
├── LICENSE                         # MIT
├── pack.yaml                       # pack manifest (slug-keyed, ordered, tiered)
├── skills/
│   ├── screencast-capture/SKILL.md
│   ├── narration-script/SKILL.md
│   └── captions-from-transcript/SKILL.md
├── migrations/
│   └── 0001_tutorial_video_studio_pack.sql   # slug-resolved, idempotent seed
├── CONTRIBUTING.md                 # how to add/modify a skill; the trigger-precision bar
├── scripts/
│   └── validate-skills.mjs         # structural validator (gray-matter only)
└── .github/workflows/validate.yml  # runs the validator on push / PR
```

## Validate

```bash
npm install      # installs gray-matter, the only dependency
npm run validate # node scripts/validate-skills.mjs
```

The validator hard-fails on missing `name`/`description`, an empty body, a
missing H1, placeholder tokens, or a directory name that doesn't match the
kebab-case of the skill's `name`. It warns (without failing) when a description
is under 12 words or lacks a trigger cue. CI runs it on every push and PR.

## Open questions (for wiring into ingest)

`pack.yaml` and the migration encode best-effort assumptions; confirm these
against Skill Me's real ingest before wiring them in:

1. **Pack-ingest manifest schema** — what fields/format does the catalog expect
   for a pack? `pack.yaml` carries only `name`, `slug`, `category`,
   `description`, and an ordered `skills: [{slug, tier}]` list, plus a
   schema-confirmation comment.
2. **Skill body storage** — does ingest read `SKILL.md` from the repo at ingest
   time, or expect the body in a DB column? This decides whether the migration
   needs a body payload.
3. **Real Supabase table/column names** for `packs` / `skills` / the pack–skill
   join, so the migration's assumed DDL header can be made exact.
4. **One pack or two** — ship this single broad pack (core/optional tiers) now,
   or split a capture-led *Tutorial* pack from a Remotion-led *Product Video
   Studio*. Default is the single broad pack; see the tradeoff section in the
   pack spec.

## License

[MIT](LICENSE) © 2026 Skill Me / Alexander.
