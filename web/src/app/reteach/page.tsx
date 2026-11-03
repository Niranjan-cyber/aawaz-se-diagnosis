"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { btn, btn2, Card, Head } from "@/components/ui";
import { chat, Diagnosis, play, tts } from "@/lib/sarvam";

const MODES = {
  Kahani: "a 4-sentence story with Indian characters and settings",
  "Step by step": "a numbered 4-step walk-through from first principles (for fractions, compare positions on a number line from 0 to 1)",
  "Asli zindagi": "one vivid real-life analogy from daily life in India",
} as const;
type Mode = keyof typeof MODES;

function NumberLine() {
  return (
    <svg viewBox="0 0 300 60" className="mb-3 w-full text-ink" aria-label="Number line showing 1/3 before 1/2">
      <line x1="10" y1="30" x2="290" y2="30" stroke="currentColor" strokeOpacity=".3" />
      {([[10, "0", false], [103, "1/3", true], [150, "1/2", true], [290, "1", false]] as const).map(([x, l, hot]) => (
        <g key={l} className={hot ? "text-chart" : ""}>
          <line x1={x} x2={x} y1="22" y2="38" stroke="currentColor" strokeWidth={hot ? 2 : 1} />
          <text x={x} y="54" fontSize="11" textAnchor="middle" fill="currentColor">{l}</text>
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
  const [audio, setAudio] = useState("");

  useEffect(() => { try { setD(JSON.parse(sessionStorage.getItem("diagnosis") ?? "null")); } catch {} }, []);

  useEffect(() => {
    if (!d) return;
    if (text[mode]) return setState("success");
    setState("loading");
    chat(
      `You are a warm expert ${d.topic} teacher. Re-teach in simple Hinglish (Roman script), pitched at the learner's level. Max 5 short sentences. No markdown.`,
      `Question: ${d.question}\nLearner said: "${d.transcript}"\nMisconception: ${d.misconception}\nConcept: ${d.concept}\nRe-teach with ${MODES[mode]}.`,
    ).then((t) => { if (!t.trim()) throw 0; setText((x) => ({ ...x, [mode]: t.trim() })); setState("success"); })
     .catch(() => setState("failed"));
  }, [d, mode, text, tries]);

  async function listen() {
    setAudio("Bulbul is speaking…");
    try {
      const echo = d!.evidence ? `Tumne kaha, ${d!.evidence}. Chalo isse naye tareeke se samajhte hain. ` : ""; // echo-back
      await play(await tts(echo + text[mode]));
      setAudio("");
    } catch { setAudio("Audio unavailable. Retry."); }
  }

  if (!d) return (
    <><Head kicker="Re-teach" title="Pehle bolo" sample={false} />
      <Card title="No diagnosis yet"><p className="text-muted">Speak an answer first.</p><Link href="/speak" className={`${btn} mt-4`}>Go to Bolo</Link></Card></>
  );

  return (
    <>
      <Head kicker={`${d.topic} · ${d.misconception}`} title="Samjho, naye tareeke se" sample={false} />
      <div className="mb-3 flex flex-wrap gap-1">
        {(Object.keys(MODES) as Mode[]).map((t) => (
          <button key={t} onClick={() => setMode(t)} className={`rounded-md px-3 py-1.5 text-sm ${t === mode ? "bg-raised text-ink" : "text-muted hover:text-ink"}`}>{t}</button>
        ))}
      </div>
      <Card title={mode}>
        {mode === "Step by step" && d.topic === "Fractions" && <NumberLine />}
        {state === "loading" && <p className="text-muted">Sarvam-105B is writing it…</p>}
        {state === "failed" && <p className="text-negative">Couldn&apos;t generate this. <button className="underline" onClick={() => setTries(tries + 1)}>Retry</button></p>}
        {state === "success" && <p className="whitespace-pre-line text-base leading-7">{text[mode]}</p>}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button className={btn2} disabled={state !== "success"} onClick={listen}>Listen with Bulbul</button>
          <Link href="/drill" className={btn}>Practise it</Link>
          {audio && <span className="text-muted">{audio}</span>}
        </div>
      </Card>
    </>
  );
}
