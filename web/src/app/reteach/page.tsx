"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { btn, btn2, Card, Head, Model, Pulse } from "@/components/ui";
import { chat, Diagnosis, play, tts } from "@/lib/sarvam";
import { Guide } from "@/components/bird";

const MODES = {
  Kahani: { en: "Story", how: "a 4-sentence story with Indian characters and settings", icon: "M4 5h7a3 3 0 0 1 3 3v11a2 2 0 0 0-2-2H4zM20 5h-4a3 3 0 0 0-3 3" },
  "Step by step": { en: "From first principles", how: "a numbered 4-step walk-through from first principles (for fractions, compare positions on a number line from 0 to 1)", icon: "M4 18h4v-4h4v-4h4V6h4" },
  "Asli zindagi": { en: "Real-life analogy", how: "one vivid real-life analogy from daily life in India", icon: "M3 11l9-7 9 7v9H3zM9 20v-6h6v6" },
} as const;
type Mode = keyof typeof MODES;

function NumberLine() {
  return (
    <svg viewBox="0 0 300 64" className="mb-5 w-full" aria-label="Number line: 1/2 sits further from 0 than 1/3">
      <line x1="12" y1="30" x2="288" y2="30" className="stroke-line" strokeWidth="2" />
      <rect x="12" y="27" width="138" height="6" rx="3" className="fill-chart/20" />
      {([[12, "0", false], [104, "1/3", true], [150, "1/2", true], [288, "1", false]] as const).map(([x, l, hot]) => (
        <g key={l}>
          <circle cx={x} cy="30" r={hot ? 5 : 3} className={hot ? "fill-chart" : "fill-muted"} />
          <text x={x} y="56" fontSize="12" textAnchor="middle" className={hot ? "fill-chart font-medium" : "fill-muted"}>{l}</text>
        </g>
      ))}
    </svg>
  );
}

export default function Reteach() {
  const [d, setD] = useState<Diagnosis | null>(null);
  const [mode, setMode] = useState<Mode>("Kahani");
  const [text, setText] = useState<Record<string, string>>({});
  const [state, setState] = useState<"loading" | "success" | "failed">("loading");
  const [tries, setTries] = useState(0);
  const [audio, setAudio] = useState<"idle" | "loading" | "playing" | "failed">("idle");

  useEffect(() => { try { setD(JSON.parse(sessionStorage.getItem("diagnosis") ?? "null")); } catch {} }, []);

  useEffect(() => {
    if (!d) return;
    if (text[mode]) return setState("success");
    setState("loading");
    chat(
      `You are a warm expert ${d.topic} teacher. Re-teach in ${d.reply ?? "simple Hinglish in Roman script"}, pitched at the learner's level. Max 5 short sentences. No markdown.`,
      `Question: ${d.question}\nLearner said: "${d.transcript}"\nMisconception: ${d.misconception}\nConcept: ${d.concept}\nRe-teach with ${MODES[mode].how}.`,
    ).then((t) => { if (!t.trim()) throw 0; setText((x) => ({ ...x, [mode]: t.trim() })); setState("success"); })
     .catch(() => setState("failed"));
  }, [d, mode, text, tries]);

  async function listen() {
    setAudio("loading");
    try {
      const en = d!.voice === "en-IN";
      const echo = d!.evidence ? (en ? `You said, ${d!.evidence}. Let's look at it another way. ` : `Tumne kaha, ${d!.evidence}. Chalo isse naye tareeke se samajhte hain. `) : "";
      const a = await tts(echo + text[mode], d!.voice);
      setAudio("playing"); await play(a); setAudio("idle");
    } catch { setAudio("failed"); }
  }

  if (!d) return (
    <><Head step="02 · Samjho" title="Nothing to re-teach yet" />
      <div className="mb-6"><Guide mood="idle">Pehle bolo! Tell me how you&apos;d answer a question, and I&apos;ll explain it a new way.</Guide></div>
      <Link href="/speak" className={btn}>Go to Bolo</Link></>
  );

  return (
    <>
      <Head step="02 · Samjho" title={<>Let&apos;s untangle <em className="text-chart">{d.misconception}</em></>} />
      <div className="mb-6">
        <Guide mood={audio === "playing" ? "happy" : state === "loading" ? "thinking" : "idle"}>
          {audio === "playing" ? "Suno dhyaan se…" : <>The big idea: <b className="font-medium">{d.right_idea || d.concept}</b> <span className="text-muted">Pick how you&apos;d like to hear it.</span></>}
        </Guide>
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        {(Object.keys(MODES) as Mode[]).map((m) => (
          <button key={m} onClick={() => setMode(m)}
            className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition ${m === mode ? "border-ink bg-surface shadow-[0_0_0_1px_var(--color-ink)]" : "border-line bg-surface/60 hover:border-ink/30"}`}>
            <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${m === mode ? "bg-ink text-white" : "bg-raised"}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"><path d={MODES[m].icon} /></svg>
            </span>
            <span><span className="block font-medium">{m}</span><span className="text-xs text-muted">{MODES[m].en}</span></span>
          </button>
        ))}
      </div>

      <Card className="p-7">
        <div className="mb-4 flex items-center justify-between"><span className="text-sm text-muted">{d.topic} · {d.concept}</span><Model m="105b" live={state === "loading"} /></div>
        {mode === "Step by step" && d.topic === "Fractions" && <NumberLine />}
        {state === "loading" && (
          <div className="space-y-3" aria-label="Writing">
            {[92, 80, 86, 60].map((w, i) => <div key={i} className="h-4 animate-pulse rounded bg-raised" style={{ width: `${w}%` }} />)}
          </div>
        )}
        {state === "failed" && <p className="text-negative">Couldn&apos;t write this one. <button className="underline" onClick={() => setTries(tries + 1)}>Try again</button></p>}
        {state === "success" && <p className="animate-rise whitespace-pre-line text-lg leading-8">{text[mode]}</p>}
        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-line pt-5">
          <button className={btn2} disabled={state !== "success" || audio === "loading" || audio === "playing"} onClick={listen}>
            {audio === "playing" ? <Pulse className="bg-marigold" /> : audio === "loading" ? <Pulse className="bg-muted" /> : "▶"}
            {audio === "playing" ? "Speaking…" : audio === "loading" ? "Bulbul is getting ready" : "Listen"} <Model m="bulbul" live={audio === "playing"} />
          </button>
          <Link href="/drill" className={btn}>Practise it →</Link>
          {audio === "failed" && <span className="text-sm text-negative">Audio unavailable. Try again.</span>}
        </div>
      </Card>
    </>
  );
}
