# B03 — Speak and get diagnosed

Build step B03 of **Aawaz se Diagnosis** (Prototype). Paste this into Claude Code / Codex / Cursor at the repo root. Do only this step.

## Read first
- `docs/build-plan/BUILD-PLAN.md` (section B03) and `docs/build-plan/plan.json`
- `AGENTS.md`, `SKILL-PLAYBOOK.md`, `SKILLS.md`

## The goal (the only goal of this step)
A student records (or plays the sample clip of) a spoken Hindi explanation and sees the Saaras transcript plus the named misconception, with the evidence phrase highlighted.

**Why now:** This is the riskiest unknown and the winning feature: if Saaras plus 105B JSON classification is unreliable, we want the fallback with time left.

## Slice
- Use cases: UC-01
- Screens: S-01, S-02
- Components: backend, frontend, Saaras, Sarvam-105B
- Stack: frontend: Next.js 15 (App Router, Tailwind) on Vercel; backend: FastAPI + SQLite on Render (free web service); ai: Saaras v3 (speech-to-text, hi-IN), Sarvam-105B (misconception classification and re-teaching), Bulbul v3 (text-to-speech)

## In scope
- Browser MediaRecorder with a Record/Stop UI
- 'Play sample' button using a Bulbul-generated Hindi clip saved to public/samples/
- POST /diagnose (audio) calls Saaras v3 with hi-IN, then 105B with a fixed label list
- Label set: M1 bigger denominator means bigger fraction, M2 add numerators and denominators, M3 whole-number thinking, M4 none
- Transcript card plus a misconception card with a confidence chip

## Out of scope for this step
- Re-teaching
- Drills

## Acceptance criteria
- [ ] The sample clip returns transcript text and misconception M1 within 10 s
- [ ] A silent or too-short recording shows 'we couldn't hear you, try again', never a diagnosis
- [ ] If the 105B output is not valid JSON, the app shows 'unsure' with a Retry, not a made-up label
- [ ] The API key never appears in frontend code or network responses

## Page states to render
- S-01: empty, running, failed
- S-02: success, failed

## Tests to write in this step (before calling it done)
- unit: classifier JSON parser handles valid, fenced-in-markdown and garbage outputs
- unit: unknown misconception ids map to M4
- integration: POST /diagnose with the sample clip returns 200 and a transcript; with an empty file returns 422

## Suggested tasks
- SARVAM_API_KEY in Render env
- Generate the sample clip once with Bulbul: 'Mujhe lagta hai 1/3 bada hai 1/2 se kyunki 3 bada hai 2 se'
- Classifier prompt returns JSON {misconception_id, skill, evidence, confidence}; parse with fallback to M4
- Frontend states: recording, running, success, failed

## Skills — use in this order
No installed skill fits; work directly.

## Browser check (on the deployed URL, with screenshots)
Run with Playwright MCP (screenshots reviewed by the agent). Save screenshots to `docs/build-plan/evidence/B03/` and look at each one before calling the step done. Also re-run the earlier steps' browser checks for the golden path.
1. Open <FRONTEND_URL>/speak, click Play sample, and take screenshot b03-success.png of the diagnosis
2. Submit an empty recording and take screenshot b03-failed.png
3. Reload and confirm the page returns to the idle state: b03-reload.png

## Done when (check on the deployed app, not locally)
Build, lint and type-check passing is not evidence that this step works.
1. Open <FRONTEND_URL>/speak, click Play sample, and see the transcript and M1 within 10 s with no sample badge
2. The browser check passes and its screenshots are reviewed

## If it goes wrong
If the live mic or Saaras fails on stage, DIAGNOSE_MODE=fixture returns the recorded sample transcript and diagnosis.

## When finished
1. Make sure everything above is deployed (frontend, backend) and the done-check passes on the public URL.
2. Set `"status": "done"` for B03 in `docs/build-plan/plan.json`, then run `python ~/.claude/skills/prototype-build-planner/scripts/build_plan.py render docs/build-plan/plan.json`.
3. Commit as `B03: Speak and get diagnosed`.
4. Report what changed, the test output, the browser-check screenshots and the done-check result, then stop. Don't start the next step without being asked.
5. If you found a bug you didn't fix, add it to `bugs` in `plan.json` with a severity (P0 correctness/safety, P1 trust/core loop, P2 polish). An open P0/P1 blocks the next feature step.

## Notes
Parameter names differ between SDK docs (language_code and target_language_code, saaras:v3). Check against the installed sarvamai version. Creative touch: highlight the exact spoken phrase that revealed the misconception.

