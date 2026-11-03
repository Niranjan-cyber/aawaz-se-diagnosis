# AGENTS.md

## Build plan

- Plan: `docs/build-plan/BUILD-PLAN.md` (source of truth: `docs/build-plan/plan.json`; re-render, never hand-edit generated files).
- Work one step at a time using `docs/build-plan/prompts/<ID>-*.md`.
- Current step: **B02** (B01 live at https://web-blush-gamma-25.vercel.app).
- Always-on: ponytail (laziest working solution), caveman (terse prose), design-taste-frontend (UI).
- Never commit `.env`; `SARVAM_API_KEY` lives only in Render env and local `.env`.
