# B02 — Backend on Render, mastery persisted

Build step B02 of **Aawaz se Diagnosis** (Prototype). Paste this into Claude Code / Codex / Cursor at the repo root. Do only this step.

## Read first
- `docs/build-plan/BUILD-PLAN.md` (section B02) and `docs/build-plan/plan.json`
- `AGENTS.md`, `SKILL-PLAYBOOK.md`, `SKILLS.md`

## The goal (the only goal of this step)
The Mastery screen shows real per-skill scores read from the Render API's SQLite database, replacing the sample data.

**Why now:** Proves the frontend-to-backend contract, CORS and env vars, and starts the Render cold start early.

## Slice
- Use cases: UC-03
- Screens: S-04
- Components: backend
- Stack: frontend: Next.js 15 (App Router, Tailwind) on Vercel; backend: FastAPI + SQLite on Render (free web service); ai: Saaras v3 (speech-to-text, hi-IN), Sarvam-105B (misconception classification and re-teaching), Bulbul v3 (text-to-speech)

## In scope
- FastAPI with GET /health, GET /mastery/{student}, POST /mastery
- SQLite table mastery(student, skill, score, updated_at)
- CORS allowing the Vercel origin
- Render deploy from render.yaml
- Frontend NEXT_PUBLIC_API_URL

## Out of scope for this step
- Sarvam calls

## Acceptance criteria
- [ ] The Mastery screen shows 4 skills with scores from the API, with no sample badge
- [ ] While the API is cold, the screen shows 'waking up the server' rather than an empty chart
- [ ] If the API is down, the screen shows an error with Retry, never zeros
- [ ] A POST to /mastery changes the score returned by the next GET

## Page states to render
- S-04: loading, success, failed

## Tests to write in this step (before calling it done)
- unit: score update clamps to 0..1
- integration: POST then GET /mastery returns the updated score; an unknown student is created with defaults

## Suggested tasks
- main.py with 3 routes
- Seed 4 fraction skills at 0.3
- render.yaml (python, uvicorn)
- Wire the Mastery screen to fetch, with a 'waking up server' state

## Skills — use in this order
No installed skill fits; work directly.

## Browser check (on the deployed URL, with screenshots)
Run with Playwright MCP (screenshots reviewed by the agent). Save screenshots to `docs/build-plan/evidence/B02/` and look at each one before calling the step done. Also re-run the earlier steps' browser checks for the golden path.
1. Open <FRONTEND_URL>/mastery and take screenshot b02-success.png
2. Block the API host and reload, then take screenshot b02-failed.png showing Retry

## Done when (check on the deployed app, not locally)
Build, lint and type-check passing is not evidence that this step works.
1. Open <FRONTEND_URL>/mastery and confirm the scores come from <BACKEND_URL>/mastery/demo
2. The browser check passes and its screenshots are reviewed

## If it goes wrong
If Render is slow to provision, keep localStorage mastery behind a flag.

## When finished
1. Make sure everything above is deployed (frontend, backend, database) and the done-check passes on the public URL.
2. Set `"status": "done"` for B02 in `docs/build-plan/plan.json`, then run `python ~/.claude/skills/prototype-build-planner/scripts/build_plan.py render docs/build-plan/plan.json`.
3. Commit as `B02: Backend on Render, mastery persisted`.
4. Report what changed, the test output, the browser-check screenshots and the done-check result, then stop. Don't start the next step without being asked.
5. If you found a bug you didn't fix, add it to `bugs` in `plan.json` with a severity (P0 correctness/safety, P1 trust/core loop, P2 polish). An open P0/P1 blocks the next feature step.

## Notes
Render free instances lose SQLite data on redeploy, so seed on startup. Add a keep-warm ping before the demo.

