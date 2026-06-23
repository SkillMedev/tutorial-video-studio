# Tutorial & Demo Video Studio

**Make a narrated tutorial or product demo end to end — plan the beats, record a clean screencast, script the voiceover, direct the action, caption it, and render for delivery.** — built in-house by [Skill&nbsp;Me](https://skillme.dev).

A complete, capture-led pipeline for a narrated tutorial or product demo, assembled almost entirely from the catalog's existing video suite plus three new first-party skills that filled the tutorial-specific gaps: Screencast Capture (record clean raw footage), Narration Script (write the spoken voiceover, synced one-instruction-per-action), and Captions From Transcript (accurate, timed SRT/VTT). Read top to bottom it is the whole workflow — storyboard the beats, capture, narrate, direct the cursor and zoom, set type and motion, mix sound, caption, render, and reframe for social. Install when someone wants to produce a how-to video, feature walkthrough, onboarding clip, or release demo and needs the whole pipeline rather than one piece.

⭐ **If this is useful, star the repo** — it's how we gauge what to build next.

## Install

- **From the catalog:** [skillme.dev/pack/tutorial-video-studio](https://skillme.dev/pack/tutorial-video-studio) — install the whole pack into Claude in one step.
- **With the skills CLI:** `npx skills add aouellets/tutorial-video-studio`
- **Manually:** copy any `skills/<slug>/SKILL.md` into your Claude skills directory.

## Skills in this pack

- **[Video Storyboard](skills/video-storyboard/SKILL.md)** — Plan a product demo, feature announcement, or launch video as a beat sheet and shot list BEFORE animating — hook in the first 3s, problem, reveal, proof, CTA — with target duration and pacing per scene type, output as a JSON scene plan that remotion-compose consumes directly.
- **[Screencast Capture](skills/screencast-capture/SKILL.md)** — Capture clean raw screen and camera footage for a tutorial or product demo — choosing the recorder (macOS Screenshot toolbar, QuickTime, OBS, Windows Game Bar), setting resolution / frame-rate / cursor / microphone, prepping a distraction-free stage, and recording in retakeable segments.
- **[Narration Script](skills/narration-script/SKILL.md)** — Write the spoken voiceover for a tutorial or demo — the actual words, phrased for the ear and synced one-instruction-per-action to what is on screen, with a pacing budget and a confident, jargon-checked tone.
- **[Product Demo Director](skills/product-demo-director/SKILL.md)** — Direct the craft of putting a real software UI on screen — cursor choreography, zoom/pan/callout language, screen-recording vs recreated-UI, and making state changes legible with highlights, focus pulls, and slow-downs.
- **[Motion Design Principles](skills/motion-design-principles/SKILL.md)** — The craft layer for motion: pick the right easing (ease-in / ease-out / ease-in-out / spring), get timing and spacing right, build the anticipationâactionâfollow-through arc, and apply Disney's 12 principles to UI and product video.
- **[Kinetic Typography](skills/kinetic-typography/SKILL.md)** — Put text in motion the right way — title cards, animated captions, lower-thirds, callouts, and word-by-word reveals — with a reading-time-per-word budget so copy holds long enough to read, plus enter/exit timing, weight and size transitions, and type hierarchy in motion.
- **[Remotion Setup](skills/remotion-setup/SKILL.md)** — Scaffolds a new Remotion video project wired for Claude Code Agent Skills — Node check, create-video scaffold, skills install, folder conventions, Google Fonts, and a smoke-test render.
- **[Remotion Compose](skills/remotion-compose/SKILL.md)** — Turns a natural-language video brief into a complete Remotion composition (.tsx) — scene plan plus animated React/TypeScript components using useCurrentFrame, interpolate, spring, AbsoluteFill, and Sequence.
- **[Sound and Music Sync](skills/sound-and-music-sync/SKILL.md)** — Score a video like an editor: beat-match cuts to the music, land SFX on transitions, pace the voiceover so it breathes, source royalty-free tracks safely, and duck the music so the VO sits clearly on top.
- **[Captions From Transcript](skills/captions-from-transcript/SKILL.md)** — Produce an accurate, properly timed caption track (SRT or WebVTT) from a video's audio — transcribing or aligning to the voiceover script, timing cues to speech, and enforcing line-length and reading-speed rules so captions are readable and in sync.
- **[Remotion Render](skills/remotion-render/SKILL.md)** — Renders a Remotion composition to MP4 and runs the iterate loop — CLI render command, 1080p/4K/9:16 presets, --concurrency tuning, surgical edit-and-re-render cycles, batch variants from a JSON data file, and Lambda for cloud rendering.
- **[Social Video Formatter](skills/social-video-formatter/SKILL.md)** — Reframe and export a finished video for social platforms — 9:16 ↔ 16:9 cropping, burned-in captions, a platform-native first frame, loop design, and per-platform specs (aspect, length, safe areas) for TikTok, Reels, Shorts, X, and LinkedIn.

## License

MIT — see [LICENSE](LICENSE). Skills are portable `SKILL.md` files; the canonical
copies live in the [Skill&nbsp;Me catalog](https://skillme.dev).
