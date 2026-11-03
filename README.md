# Aawaz se Diagnosis

**Galat jawab nahi. Galat soch pakdo.** A learner explains an answer out loud in Hindi. The app hears the reasoning, names the misconception behind it, re-teaches it a new way and drills it by voice.

Live: https://web-blush-gamma-25.vercel.app

## The loop (all Sarvam)

| Step | Sarvam model | What happens |
|---|---|---|
| Bolo (speak) | **Saaras v3** | Speech to Hindi text |
| Diagnose | **Sarvam-105B** | Names the wrong mental model, quotes the exact phrase that revealed it |
| Samjho (re-teach) | **Sarvam-105B** + **Bulbul v3** | Story, step-by-step (number line for fractions) or real-life analogy, read aloud with an echo-back of what the learner said |
| Abhyaas (drill) | **Bulbul** asks, **Saaras** listens, **105B** judges | 3 targeted questions, spoken or tapped |
| Pragati (mastery) | | Per-concept mastery bars, updated by every answer |

Topics with sample learners: Fractions (Class 5–7), Physics, Chemistry, Calculus, AI. The question box is editable, so any subject at any level works.

## Run locally

```bash
cd web
echo "SARVAM_API_KEY=your_key" > .env.local
npm install && npm run dev
```

The key stays server-side: `web/src/app/api/sarvam/[...path]/route.ts` is a small allow-listed proxy to `api.sarvam.ai`.

## Layout

- `web/`: Next.js 15 app on Vercel (UI and Sarvam proxy)
- `api/`: FastAPI and SQLite mastery API for Render (not yet deployed; mastery currently lives in browser storage)
- `docs/build-plan/`: build plan
