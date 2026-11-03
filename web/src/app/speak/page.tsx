"use client";
import Link from "next/link";
import { useState } from "react";
import { btn, btn2, Card, Head } from "@/components/ui";
import { diagnose, Diagnosis, play, stt, TOPICS, tts } from "@/lib/sarvam";
import { useRecorder } from "@/lib/recorder";

export default function Speak() {
  const r = useRecorder();
  const [topic, setTopic] = useState(TOPICS[0]);
  const [question, setQuestion] = useState(TOPICS[0].question);
  const [state, setState] = useState<"empty" | "running" | "success" | "failed">("empty");
  const [msg, setMsg] = useState("");
  const [d, setD] = useState<Diagnosis | null>(null);

  function pick(t: (typeof TOPICS)[number]) { setTopic(t); setQuestion(t.question); setD(null); setState("empty"); }

  async function run(audio: Blob) {
    setState("running"); setMsg("Saaras is listening…");
    try {
      const transcript = await stt(audio);
      if (transcript.trim().length < 4) throw new Error("We couldn't hear you. Try again, a little closer to the mic.");
      setMsg("Sarvam-105B is looking for the misconception…");
      const j = await diagnose(transcript, topic.label, question).catch(() => { throw new Error("The model was unsure. Retry."); });
      const full = { transcript, topic: topic.label, question, ...j };
      setD(full); setState("success");
      sessionStorage.setItem("diagnosis", JSON.stringify(full));
    } catch (e) { setMsg((e as Error).message); setState("failed"); }
  }

  async function sample() {
    setState("running"); setMsg("Bulbul is speaking as a sample learner…");
    try { const a = await tts(topic.sample); play(a); await run(a); }
    catch (e) { setMsg((e as Error).message); setState("failed"); }
  }

  const hl = d?.evidence && d.transcript.includes(d.evidence) ? d.transcript.split(d.evidence) : null;
  const busy = state === "running" || r.on;

  return (
    <>
      <Head kicker="Explain your answer out loud, in Hindi or Hinglish" title="Bolo" sample={false} />
      <div className="mb-3 flex flex-wrap gap-1">
        {TOPICS.map((t) => (
          <button key={t.id} disabled={busy} onClick={() => pick(t)} className={`rounded-md px-3 py-1.5 text-sm ${t.id === topic.id ? "bg-raised text-ink" : "text-muted hover:text-ink"}`}>
            {t.label} <span className="text-muted">· {t.level}</span>
          </button>
        ))}
      </div>
      <div className="grid gap-3">
        <Card title="Question">
          <input value={question} onChange={(e) => setQuestion(e.target.value)} disabled={busy}
            className="w-full rounded-md border border-line bg-surface px-3 py-2 text-lg outline-none focus:border-ink" />
          <p className="mt-2 text-xs text-muted">Edit it to ask anything, at any level.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            {r.on
              ? <button className={btn} onClick={async () => run(await r.stop())}>Stop and diagnose</button>
              : <button className={btn} disabled={state === "running"} onClick={() => r.start().catch(() => { setMsg("Mic blocked. Use the sample."); setState("failed"); })}>Record your answer</button>}
            <button className={btn2} disabled={busy || question !== topic.question} onClick={sample}>Play sample learner</button>
          </div>
          {r.on && <p className="mt-3 text-negative">● Recording</p>}
          {(state === "running" || state === "failed") && <p className={`mt-3 ${state === "failed" ? "text-negative" : "text-muted"}`}>{msg}</p>}
        </Card>
        {state === "success" && d && (
          <>
            <Card title="What Saaras heard">
              <p className="text-lg">
                “{hl ? <>{hl[0]}<mark className="bg-chart/10 px-0.5 text-chart">{d.evidence}</mark>{hl.slice(1).join(d.evidence)}</> : d.transcript}”
              </p>
            </Card>
            <Card title="Diagnosis, from Sarvam-105B">
              <p className="text-lg font-medium">{d.correct && d.misconception === "None" ? "Sound reasoning, no misconception" : d.misconception}</p>
              <p className="mt-1 text-muted">{d.concept} · confidence <span className="font-mono">{Number(d.confidence).toFixed(2)}</span></p>
              <Link href="/reteach" className={`${btn} mt-4`}>Re-teach this</Link>
            </Card>
          </>
        )}
      </div>
    </>
  );
}
