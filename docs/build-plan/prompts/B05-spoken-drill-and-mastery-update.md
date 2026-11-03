# B05 — Spoken drill and mastery update

Build step B05 of **Aawaz se Diagnosis** (Prototype — 🏁 prototype exit). Paste this into Claude Code / Codex / Cursor at the repo root. Do only this step.

## Read first
- `docs/build-plan/BUILD-PLAN.md` (section B05) and `docs/build-plan/plan.json`
- `AGENTS.md`, `SKILL-PLAYBOOK.md`, `SKILLS.md`

## The goal (the only goal of this step)
The student hears a Bulbul-spoken drill, answers aloud, gets feedback, and sees the skill's mastery graph move on the Mastery screen.

**Why now:** Closes the loop (diagnose, teach, practise, track) and delivers the prototype exit.

## Slice
- Use cases: UC-03
- Screens: S-03, S-04
- Components: backend, frontend, Saaras, Sarvam-105B, Bulbul
- Stack: frontend: Next.js 15 (App Router, Tailwind) on Vercel; backend: FastAPI + SQLite on Render (free web service); ai: Saaras v3 (speech-to-text, hi-IN), Sarvam-105B (misconception classification and re-teaching), Bulbul v3 (text-to-speech)

## In scope
- POST /drill generates 3 targeted questions for the skill, with Bulbul audio each
- POST /answer: Saaras transcribes, a simple check or 105B marks it, and the mastery score updates (+0.15 right, -0.05 wrong)
- Mastery 'constellation' SVG: skills as nodes, brightness equals score, animating on change
- Tap-to-answer fallback buttons for noisy rooms

## Out of scope for this step
- Auth, multiple students, adaptive difficulty

## Acceptance criteria
- [ ] A correct spoken answer raises the targeted skill's score and the graph visibly updates
- [ ] An unintelligible answer is not marked wrong: it shows 'say that again' and the score is unchanged
- [ ] The mastery score survives a page reload, because it is read from the API
- [ ] If drill generation fails, the screen shows an error with Retry and the mastery screen still loads

## Page states to render
- S-03: loading, running, success, failed
- S-04: success, failed

## Tests to write in this step (before calling it done)
- unit: the answer normaliser maps 'ek tihai' and '1/3' to the same value
- unit: the mastery update rule clamps to 0..1
- integration: POST /answer with a correct clip raises mastery; with an empty file returns 422 and leaves mastery unchanged

## Suggested tasks
- Drill prompt returns JSON [{q_hi, answer}]
- Answer check normalises Hindi numerals and fractions
- Wire mastery POST to the existing B02 route
- Mastery graph animation

## Skills — use in this order
No installed skill fits; work directly.

## Browser check (on the deployed URL, with screenshots)
Run with Playwright MCP (screenshots reviewed by the agent). Save screenshots to `docs/build-plan/evidence/B05/` and look at each one before calling the step done. Also re-run the earlier steps' browser checks for the golden path.
1. Run the full golden path on <FRONTEND_URL>: Play sample, diagnose, re-teach, drill, answer. Take screenshots b05-1..b05-5.png
2. Reload the Mastery screen and take b05-persisted.png
3. Force an API failure on the drill and take b05-failed.png

## Done when (check on the deployed app, not locally)
Build, lint and type-check passing is not evidence that this step works.
1. On <FRONTEND_URL>, walk the whole golden path in under 90 s with no sample badges
2. The mastery graph for fraction comparison changes after a correct answer and still shows the change after a reload
3. The browser check passes and its screenshots are reviewed

## If it goes wrong
Tap-to-answer buttons count as the answer if the mic or Saaras is flaky.

## When finished
1. Make sure everything above is deployed (frontend, backend) and the done-check passes on the public URL.
2. Set `"status": "done"` for B05 in `docs/build-plan/plan.json`, then run `python ~/.claude/skills/prototype-build-planner/scripts/build_plan.py render docs/build-plan/plan.json`.
3. Commit as `B05: Spoken drill and mastery update`.
4. Report what changed, the test output, the browser-check screenshots and the done-check result, then stop. Don't start the next step without being asked.
5. If you found a bug you didn't fix, add it to `bugs` in `plan.json` with a severity (P0 correctness/safety, P1 trust/core loop, P2 polish). An open P0/P1 blocks the next feature step.

## Notes
Freeze after this step. Remaining time goes to the demo run-through and a keep-warm ping on Render.

