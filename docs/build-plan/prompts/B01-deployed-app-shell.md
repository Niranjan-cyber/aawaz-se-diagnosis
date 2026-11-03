# B01 — Deployed app shell

Build step B01 of **Aawaz se Diagnosis** (Prototype). Paste this into Claude Code / Codex / Cursor at the repo root. Do only this step.

## Read first
- `docs/build-plan/BUILD-PLAN.md` (section B01) and `docs/build-plan/plan.json`
- `AGENTS.md`, `SKILL-PLAYBOOK.md`, `SKILLS.md`

## The goal (the only goal of this step)
A judge opens the Vercel URL and sees a clean, branded Aawaz shell with the Speak, Re-teach, Drill and Mastery screens reachable, labelled 'sample data'.

**Why now:** Gets a public URL up first so deploy problems surface at minute 5, not minute 28.

## Slice
- Use cases: UC-01
- Screens: S-01, S-02, S-03, S-04
- Components: frontend
- Stack: frontend: Next.js 15 (App Router, Tailwind) on Vercel; backend: FastAPI + SQLite on Render (free web service); ai: Saaras v3 (speech-to-text, hi-IN), Sarvam-105B (misconception classification and re-teaching), Bulbul v3 (text-to-speech)

## In scope
- Next.js + Tailwind app
- 4-screen navigation with a stepper
- 'Powered by Sarvam: Saaras, 105B, Bulbul' footer
- Vercel deploy

## Out of scope for this step
- Any API calls
- Recording

## Acceptance criteria
- [ ] The public URL loads and all 4 screens are reachable by nav
- [ ] Every stub shows a 'sample data' badge
- [ ] At 390px width nothing scrolls horizontally
- [ ] An unknown route shows a friendly 404, not a blank page

## Page states to render
Any screen that shows data renders loading, success, empty and failed distinctly.

## Tests to write in this step (before calling it done)
No unit/integration tests for this step; the browser check covers it.

## Suggested tasks
- npx create-next-app (TS, Tailwind, App Router)
- Layout with one accent colour, large type, generous spacing
- Stub the 4 screens with sample content and a visible 'sample data' badge
- vercel --prod

## Skills — use in this order
No installed skill fits; work directly.

## Browser check (on the deployed URL, with screenshots)
Run with Playwright MCP (screenshots reviewed by the agent). Save screenshots to `docs/build-plan/evidence/B01/` and look at each one before calling the step done. Also re-run the earlier steps' browser checks for the golden path.
1. Open <FRONTEND_URL>, click through the 4 screens, and take screenshot b01-screens.png of each
2. Open <FRONTEND_URL>/nope and take screenshot b01-404.png

## Done when (check on the deployed app, not locally)
Build, lint and type-check passing is not evidence that this step works.
1. Open <FRONTEND_URL> and confirm all 4 screens render with the sample badge
2. The browser check passes and its screenshots are reviewed

## If it goes wrong
Deploy a static export if the Next.js build fails on Vercel.

## When finished
1. Make sure everything above is deployed (frontend) and the done-check passes on the public URL.
2. Set `"status": "done"` for B01 in `docs/build-plan/plan.json`, then run `python ~/.claude/skills/prototype-build-planner/scripts/build_plan.py render docs/build-plan/plan.json`.
3. Commit as `B01: Deployed app shell`.
4. Report what changed, the test output, the browser-check screenshots and the done-check result, then stop. Don't start the next step without being asked.
5. If you found a bug you didn't fix, add it to `bugs` in `plan.json` with a severity (P0 correctness/safety, P1 trust/core loop, P2 polish). An open P0/P1 blocks the next feature step.

## Notes
UI: one accent colour, big Devanagari-friendly type (Noto Sans Devanagari), soft cards, no gradients overload. A taste/frontend-design skill is not installed; follow these rules by hand.

