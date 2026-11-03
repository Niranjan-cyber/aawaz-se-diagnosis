# B04 — Re-teach in three modalities

Build step B04 of **Aawaz se Diagnosis** (Prototype). Paste this into Claude Code / Codex / Cursor at the repo root. Do only this step.

## Read first
- `docs/build-plan/BUILD-PLAN.md` (section B04) and `docs/build-plan/plan.json`
- `AGENTS.md`, `SKILL-PLAYBOOK.md`, `SKILLS.md`

## The goal (the only goal of this step)
After a diagnosis, the student picks Story, Number line or Real-life analogy and sees a Hindi re-teach for that misconception, which they can hear through Bulbul.

**Why now:** Second half of the core loop (diagnose, then fix), and it shows off Bulbul.

## Slice
- Use cases: UC-02
- Screens: S-02
- Components: backend, frontend, Sarvam-105B, Bulbul
- Stack: frontend: Next.js 15 (App Router, Tailwind) on Vercel; backend: FastAPI + SQLite on Render (free web service); ai: Saaras v3 (speech-to-text, hi-IN), Sarvam-105B (misconception classification and re-teaching), Bulbul v3 (text-to-speech)

## In scope
- POST /reteach {misconception_id, modality} generates Hindi text with 105B, cached per pair in SQLite
- POST /tts calls Bulbul and returns base64 audio
- Number line is a React SVG component that plots the two fractions from the diagnosis
- Tabs for the 3 modalities and a Listen button
- Echo-back: Bulbul first repeats the student's reasoning kindly ('Tumne socha ki...')

## Out of scope for this step
- Drills
- Streaming audio

## Acceptance criteria
- [ ] Each of the 3 modalities renders Hindi content for M1 within 8 s, and the second view is instant from cache
- [ ] The number line shows 1/3 and 1/2 at the correct positions
- [ ] If Bulbul fails, the text still shows and Listen shows 'audio unavailable, retry'
- [ ] Content is never blank: a failed generation shows an error, not an empty card

## Page states to render
- S-02: loading, success, failed

## Tests to write in this step (before calling it done)
- unit: the cache returns the stored text on the second call without calling the model
- unit: number line position maths (a/b to x coordinate)
- integration: POST /tts returns base64 audio that decodes to a non-empty WAV

## Suggested tasks
- Per-modality prompts (short, child-friendly Hindi, 4 sentences max)
- Cache table reteach_cache
- Audio player with loading and failed states
- Number line component driven by two fractions from the diagnosis

## Skills — use in this order
No installed skill fits; work directly.

## Browser check (on the deployed URL, with screenshots)
Run with Playwright MCP (screenshots reviewed by the agent). Save screenshots to `docs/build-plan/evidence/B04/` and look at each one before calling the step done. Also re-run the earlier steps' browser checks for the golden path.
1. From the diagnosed state, click each tab and take screenshots b04-story.png, b04-numberline.png, b04-analogy.png
2. Force a Bulbul failure and take screenshot b04-audio-failed.png

## Done when (check on the deployed app, not locally)
Build, lint and type-check passing is not evidence that this step works.
1. Open <FRONTEND_URL>/speak, diagnose the sample, open all 3 tabs, and play Listen
2. The browser check passes and its screenshots are reviewed

## If it goes wrong
RETEACH_MODE=fixture serves hand-written Hindi text for M1, and audio is pre-generated.

## When finished
1. Make sure everything above is deployed (frontend, backend) and the done-check passes on the public URL.
2. Set `"status": "done"` for B04 in `docs/build-plan/plan.json`, then run `python ~/.claude/skills/prototype-build-planner/scripts/build_plan.py render docs/build-plan/plan.json`.
3. Commit as `B04: Re-teach in three modalities`.
4. Report what changed, the test output, the browser-check screenshots and the done-check result, then stop. Don't start the next step without being asked.
5. If you found a bug you didn't fix, add it to `bugs` in `plan.json` with a severity (P0 correctness/safety, P1 trust/core loop, P2 polish). An open P0/P1 blocks the next feature step.

## Notes
Keep prompts under about 60 words to save tokens.

