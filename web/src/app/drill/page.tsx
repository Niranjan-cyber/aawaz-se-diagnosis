"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { btn, btn2, Card, Head } from "@/components/ui";
import { bumpMastery, chat, Diagnosis, parseJSON, play, stt, tts } from "@/lib/sarvam";
import { useRecorder } from "@/lib/recorder";

type Q = { q: string; options: string[]; answer: string };

// Model sometimes returns "A) foo" options with answer "A". Normalise so tap-matching works.
const strip = (s: string) => String(s).replace(/^\s*[A-Da-d][).:]\s*/, "").trim();
function fixQ(x: Q): Q {
  const options = (x.options ?? []).map(strip);
  const a = String(x.answer).trim();
  const answer = /^[A-Da-d]$/.test(a) ? options["abcd".indexOf(a.toLowerCase())] ?? a : strip(a);
  return { q: x.q, options, answer };
}

export default function Drill() {
  const r = useRecorder();
  const [d, setD] = useState<Diagnosis | null>(null);
  const [qs, setQs] = useState<Q[] | null>(null);
  const [i, setI] = useState(0);
  const [state, setState] = useState<"loading" | "success" | "running" | "failed">("loading");
  const [fb, setFb] = useState("");
  const [done, setDone] = useState<Record<number, boolean>>({});

  function load(dx: Diagnosis) {
    setState("loading");
    chat(
      `You write spoken practice drills. Make 3 short questions in simple Hinglish (Roman script) on ${dx.topic}, at the learner's level, that each directly test this misconception. Two short options each, one of them scientifically correct, no letter prefixes; "answer" must be copied exactly from options. Reply ONLY JSON array: [{"q":"...","options":["<option 1>","<option 2>"],"answer":"<exact option text>"}]`,
      `Misconception: ${dx.misconception}. Concept: ${dx.concept}. Original question: ${dx.question}`,
    ).then((t) => { const j = parseJSON<Q[]>(t); if (!j?.length) throw 0; setQs(j.map(fixQ)); setState("success"); })
     .catch(() => setState("failed"));
  }
  useEffect(() => {
    try { const x = JSON.parse(sessionStorage.getItem("diagnosis") ?? "null"); setD(x); if (x) load(x); } catch {}
  }, []);

  function mark(ok: boolean) {
    if (done[i] === undefined) { bumpMastery(d!.concept, ok ? 0.15 : -0.05); setDone({ ...done, [i]: ok }); }
    setFb(ok ? "Sahi! Mastery up." : `Not quite. Answer: ${qs![i].answer}.`);
    setState("success");
  }

  async function spoken() {
    const audio = await r.stop();
    setState("running"); setFb("Saaras is listening…");
    try {
      const heard = await stt(audio);
      if (heard.trim().length < 2) { setFb("Say that again, please."); return setState("success"); }
      const j = parseJSON<{ correct: boolean }>(await chat(`Judge a learner's spoken answer. Reply ONLY JSON {"correct":true|false}.`, `Q: ${qs![i].q}. Correct: ${qs![i].answer}. Learner said: "${heard}"`));
      if (!j) throw 0;
      mark(j.correct);
    } catch { setFb("Couldn't check that. Tap your answer instead."); setState("success"); }
  }

  if (!d) return (
    <><Head kicker="Spoken drill" title="Abhyaas" sample={false} />
      <Card title="No diagnosis yet"><Link href="/speak" className={btn}>Go to Bolo</Link></Card></>
  );
  const q = qs?.[i];

  return (
    <>
      <Head kicker={`Bulbul asks, Saaras listens · ${d.concept}`} title="Abhyaas" sample={false} />
      <Card title={q ? `Question ${i + 1} of ${qs!.length}` : "Questions"}>
        {state === "loading" && <p className="text-muted">Sarvam-105B is making questions for you…</p>}
        {state === "failed" && !qs && <p className="text-negative">Couldn&apos;t make questions. <button className="underline" onClick={() => load(d)}>Retry</button></p>}
        {q && (
          <>
            <p className="text-lg">{q.q}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button className={btn2} onClick={() => tts(q.q).then(play).catch(() => setFb("Audio unavailable."))}>Suno</button>
              {r.on
                ? <button className={btn} onClick={spoken}>Stop</button>
                : <button className={btn} disabled={state === "running"} onClick={() => r.start().catch(() => setFb("Mic blocked. Tap instead."))}>Jawab bolo</button>}
              {q.options?.map((o) => <button key={o} className={btn2} disabled={state === "running"} onClick={() => mark(o === q.answer)}>{o}</button>)}
            </div>
            {r.on && <p className="mt-3 text-negative">● Recording</p>}
            {fb && <p className="mt-3">{fb}</p>}
            <div className="mt-4 flex gap-3">
              {i < qs!.length - 1
                ? <button className={btn2} onClick={() => { setI(i + 1); setFb(""); }}>Next question</button>
                : <Link href="/mastery" className={btn}>See mastery</Link>}
            </div>
          </>
        )}
      </Card>
    </>
  );
}
