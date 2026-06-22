-- migrations/0001_tutorial_video_studio_pack.sql
-- ASSUMES: packs(id uuid pk default gen_random_uuid(), slug text unique, name text,
--          description text, category text, created_at timestamptz default now())
--          skills(id uuid pk, slug text unique, ...)
--          pack_skills(pack_id uuid fk, skill_id uuid fk, position int, tier text,
--                      primary key (pack_id, skill_id))
-- Adjust names to the live schema before applying.

begin;

-- 1. The three new skills must be inserted first (full SKILL.md bodies go in the
--    body/content column per your ingest decision — DB column vs parse-at-ingest).
--    Insert them via your normal skill-ingest path, then this pack migration links them.
--    Slugs expected: screencast-capture, narration-script, captions-from-transcript

-- 2. Upsert the pack
insert into packs (slug, name, description, category)
values (
  'tutorial-video-studio',
  'Tutorial & Demo Video Studio',
  'Make a narrated tutorial or product demo end to end — plan beats, record a clean screencast, script and pace the voiceover, direct the on-screen action, apply motion and labels, mix audio, caption accurately, and render and reframe for delivery.',
  'design'
)
on conflict (slug) do update
  set name = excluded.name,
      description = excluded.description,
      category = excluded.category;

-- 3. Link members by slug, in order, with tier. Skips any slug not yet in skills.
with pack as (
  select id from packs where slug = 'tutorial-video-studio'
),
members (slug, position, tier) as (
  values
    ('video-storyboard',          1, 'core'),
    ('screencast-capture',        2, 'core'),
    ('narration-script',          3, 'core'),
    ('product-demo-director',     4, 'core'),
    ('motion-design-principles',  5, 'optional'),
    ('kinetic-typography',        6, 'core'),
    ('remotion-setup',            7, 'optional'),
    ('remotion-compose',          8, 'optional'),
    ('sound-and-music-sync',      9, 'core'),
    ('captions-from-transcript', 10, 'core'),
    ('remotion-render',          11, 'optional'),
    ('social-video-formatter',   12, 'optional')
    -- ('motion-color-and-light', 13, 'optional')  -- uncomment if you want it in
)
insert into pack_skills (pack_id, skill_id, position, tier)
select pack.id, s.id, m.position, m.tier
from members m
join skills s on s.slug = m.slug
cross join pack
on conflict (pack_id, skill_id) do update
  set position = excluded.position,
      tier = excluded.tier;

commit;

-- Sanity check:
-- select s.slug, ps.position, ps.tier
-- from pack_skills ps
-- join packs p on p.id = ps.pack_id
-- join skills s on s.id = ps.skill_id
-- where p.slug = 'tutorial-video-studio'
-- order by ps.position;
