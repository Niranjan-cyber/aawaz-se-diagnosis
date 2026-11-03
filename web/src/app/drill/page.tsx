"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { btn, btn2, Card, Head, Model, Pulse } from "@/components/ui";
import { bumpMastery, chat, Diagnosis, getLang, parseJSON, play, stt, tts } from "@/lib/sarvam";
import { useRecorder } from "@/lib/recorder";
import { Burst, Guide } from "@/components/bird";

type Q = { q: string; options: string[]; answer: string };
type Raw = { q: string; correct: string; wrong: string };

// The model writes the correct answer and the tempting wrong one as separate fields; we build the options.
// When it picked options itself it kept dropping the true answer ("both land together").
const strip = (s: string) => String(s ?? "").replace(/^\s*[A-Da-d][).:]\s*/, "").trim();
function toQ(x: Raw): Q | null {
  const correct = strip(x.correct), wrong = strip(x.wrong);
  if (!x.q || !correct || !wrong || correct.toLowerCase() === wrong.toLowerCase()) return null;
  return { q: x.q, options: Math.random() < 0.5 ? [correct, wrong] : [wrong, correct], answer: correct };
}

export default function Drill() {
  const r = useRecorder();
  const [d, setD] = useState<Diagnosis | null>(null);
  const [qs, setQs] = useState<Q[] | null>(null);
  const [i, setI] = useState(0);
  const [state, setState] = useState<"loading" | "success" | "running" | "failed">("loading");
  const [fb, setFb] = useState<{ ok?: boolean; text: string } | null>(null);
  const [done, setDone] = useState<Record<number, boolean>>({});
  const [speaking, setSpeaking] = useState(false);

  function load(dx: Diagnosis) {
    setState("loading");
    chat(
      `You write spoken practice drills. Make 3 short questions in ${dx.reply ?? "simple Hinglish in Roman script"} on ${dx.topic}, at the learner's level, that each directly test this misconception. For each, write the factually correct answer (it may be "both at the same time", "equal", "neither" when that is the truth) and the tempting wrong answer the misconception predicts, each under 8 words. Reply ONLY JSON array: [{"q":"...","correct":"...","wrong":"..."}]`,
      `Misconception: ${dx.misconception}. The right idea: ${dx.right_idea ?? dx.concept}. Concept: ${dx.concept}. Original question: ${dx.question}`,
    ).then((t) => {
      const j = (parseJSON<Raw[]>(t) ?? []).map(toQ).filter((x): x is Q => !!x);
      if (!j.length) throw 0;
      setQs(j); setState("success");
    })
     .catch(() => setState("failed"));
  }
  useEffect(() => {
    try { const x = JSON.parse(sessionStorage.getItem("diagnosis") ?? "null"); setD(x); if (x) load(x); } catch {}
  }, []);

  function mark(ok: boolean) {
    if (done[i] === undefined) { bumpMastery(d!.concept, ok ? 0.15 : -0.05); setDone({ ...done, [i]: ok }); }
    setFb(ok ? { ok, text: "Sahi! +15% mastery" } : { ok, text: `Not quite. The answer is “${qs![i].answer}”.` });
    setState("success");
  }

  async function spoken() {
    if (!r.on) return r.start().catch(() => setFb({ text: "Microphone blocked. Tap an answer instead." }));
    const audio = await r.stop();
    setState("running"); setFb({ text: "Saaras is listening…" });
    try {
      const heard = await stt(audio, getLang());
      if (heard.trim().length < 2) { setFb({ text: "Say that again, please." }); return setState("success"); }
      const j = parseJSON<{ correct: boolean }>(await chat(`Judge a learner's spoken answer. Reply ONLY JSON {"correct":true|false}.`, `Q: ${qs![i].q}. Correct: ${qs![i].answer}. Learner said: "${heard}"`));
      if (!j) throw 0;
      mark(j.correct);
    } catch { setFb({ text: "Couldn't check that. Tap your answer instead." }); setState("success"); }
  }

  async function ask(text: string) {
    setSpeaking(true);
    try { await play(await tts(text, d!.voice)); } catch { setFb({ text: "Audio unavailable." }); }
    setSpeaking(false);
  }

  if (!d) return (
    <><Head step="03 · Abhyaas" title="Nothing to practise yet" />
      <div className="mb-6"><Guide mood="idle">Pehle bolo! Answer one question out loud, and I&apos;ll make practice just for you.</Guide></div>
      <Link href="/speak" className={btn}>Go to Bolo</Link></>
  );
  const q = qs?.[i];
  const answered = done[i] !== undefined;

  return (
    <>
      <Head step="03 · Abhyaas" title="Practise the one idea" sub={<>Target: <b className="font-medium text-ink">{d.concept}</b>. Answer by voice or tap.</>} />

      {qs && (
        <div className="mb-4 flex gap-2">
          {qs.map((_, k) => (
            <span key={k} className={`h-1.5 flex-1 rounded-full transition ${done[k] === true ? "bg-positive" : done[k] === false ? "bg-negative" : k === i ? "bg-ink" : "bg-line"}`} />
          ))}
        </div>
      )}

      <Card className="p-7">
        {state === "loading" && (
          <div className="flex items-center gap-3 text-muted"><Pulse /> Sarvam-105B is writing questions for you…</div>
        )}
        {state === "failed" && !qs && <p className="text-negative">Couldn&apos;t make questions. <button className="underline" onClick={() => load(d)}>Try again</button></p>}
        {q && (
          <div key={i} className="animate-rise">
            <div className="mb-3 flex items-center justify-between text-sm text-muted">
              <span>Question {i + 1} of {qs!.length}</span>
              <button onClick={() => ask(q.q)} disabled={speaking} className="inline-flex items-center gap-2 hover:text-ink">
                {speaking ? <Pulse className="bg-marigold" /> : "▶"} Hear it <Model m="bulbul" live={speaking} />
              </button>
            </div>
            <p className="font-serif text-2xl leading-snug sm:text-3xl">{q.q}</p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {q.options?.map((o) => {
                const look = !answered ? "border-line bg-surface hover:border-ink/40"
                  : o === q.answer ? "border-positive bg-positive-soft text-positive" : "border-line bg-surface opacity-50";
                return (
                  <button key={o} disabled={state === "running" || answered} onClick={() => mark(o === q.answer)}
                    className={`rounded-2xl border p-4 text-left text-base transition first-letter:uppercase ${look}`}>
                    {o}
                  </button>
                );
              })}
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button className={r.on ? `${btn} bg-negative hover:bg-negative/90` : btn2} disabled={state === "running" || answered} onClick={spoken}>
                {r.on ? <><span className="size-2.5 animate-pulse rounded-full bg-white" /> Stop and check</> : <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="9" y="3" width="6" height="12" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></svg> Say your answer</>}
              </button>
              {r.on && (
                <span className="flex h-6 items-center gap-[2px]" aria-hidden>
                  {r.bars.slice(0, 16).map((v, k) => <span key={k} className="w-1 rounded-full bg-chart" style={{ height: `${4 + v * 20}px` }} />)}
                </span>
              )}
            </div>

            <div className="relative mt-6">
              {fb?.ok === true && <Burst key={i} />}
              <Guide size={64} mood={fb?.ok === true ? "happy" : fb?.ok === false ? "oops" : r.on ? "listening" : state === "running" ? "thinking" : "idle"}>
                {fb ? (
                  <span className={fb.ok === true ? "text-positive" : fb.ok === false ? "text-negative" : ""}>
                    {fb.ok === false ? <>{fb.text} <span className="text-muted">No worries, that&apos;s how we learn.</span></> : fb.text}
                  </span>
                ) : r.on ? "Sun rahi hoon…" : "Tap an answer, or say it out loud. Koi jaldi nahi."}
              </Guide>
            </div>

            <div className="mt-6 flex justify-end border-t border-line pt-5">
              {i < qs!.length - 1
                ? <button className={btn} disabled={!answered} onClick={() => { setI(i + 1); setFb(null); }}>Next question →</button>
                : <Link href="/mastery" className={`${btn} ${answered ? "" : "pointer-events-none opacity-40"}`}>See your mastery →</Link>}
            </div>
          </div>
        )}
      </Card>
    </>
  );
}
