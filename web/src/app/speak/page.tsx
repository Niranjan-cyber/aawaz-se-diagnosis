"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { btn2, btnLight, Card, Head, Model, Steps } from "@/components/ui";
import { diagnose, Diagnosis, getLang, Lang, LANGS, play, replyStyle, setLang, stt, TOPICS, tts } from "@/lib/sarvam";
import { useRecorder } from "@/lib/recorder";
import { Guide, Mood } from "@/components/bird";

const PIPE: [string, "saaras" | "105b" | "bulbul"][] = [["Listening", "saaras"], ["Transcribing", "saaras"], ["Diagnosing", "105b"]];

export default function Speak() {
  const r = useRecorder();
  const [lang, setL] = useState<Lang>("auto");
  const [topic, setTopic] = useState(TOPICS[0]);
  const [question, setQuestion] = useState(TOPICS[0].question);
  const [state, setState] = useState<"empty" | "running" | "success" | "failed">("empty");
  const [at, setAt] = useState(0);
  const [msg, setMsg] = useState("");
  const [d, setD] = useState<Diagnosis | null>(null);

  useEffect(() => setL(getLang()), []);
  function pickLang(l: Lang) { setL(l); setLang(l); }
  function pick(t: (typeof TOPICS)[number]) { setTopic(t); setQuestion(t.question); setD(null); setState("empty"); }

  async function run(audio: Blob) {
    setState("running"); setAt(1); setD(null);
    try {
      const transcript = await stt(audio, lang);
      if (transcript.trim().length < 4) throw new Error("We couldn't hear you. Try again, a little closer to the mic.");
      setAt(2);
      const style = replyStyle(lang, transcript);
      const j = await diagnose(transcript, topic.label, question, style.reply).catch(() => { throw new Error("The model was unsure. Try again."); });
      const full = { transcript, topic: topic.label, question, ...style, ...j };
      setD(full); setState("success"); setAt(3);
      sessionStorage.setItem("diagnosis", JSON.stringify(full));
    } catch (e) { setMsg((e as Error).message); setState("failed"); }
  }

  async function record() {
    if (r.on) return run(await r.stop());
    try { await r.start(); setState("running"); setAt(0); setD(null); }
    catch { setMsg("Microphone blocked. Allow it in the address bar, or play the sample learner."); setState("failed"); }
  }

  async function sample() {
    setState("running"); setAt(0); setD(null);
    try { const a = await tts(topic.sample); play(a); await run(a); }
    catch (e) { setMsg((e as Error).message); setState("failed"); }
  }

  const hl = d?.evidence && d.transcript.includes(d.evidence) ? d.transcript.split(d.evidence) : null;
  const busy = state === "running" && !r.on;
  const sound = d?.correct && /^none$/i.test(d.misconception);

  const [mood, say]: [Mood, React.ReactNode] =
    r.on ? ["listening", <>Sun rahi hoon… <span className="text-muted">take your time, and tell me <i>why</i>.</span></>]
    : state === "running" ? ["thinking", at < 2 ? "Hmm, let me write down what you said…" : "Soch rahi hoon… looking for the idea behind your answer."]
    : state === "failed" ? ["oops", <>Oops! <span className="text-muted">{msg}</span></>]
    : state === "success" && d ? (sound ? ["happy", "Wah! Your reasoning is solid. Want to try a harder one?"] : ["happy", <>Mil gaya! <span className="text-muted">Here&apos;s the idea that tripped you up. Totally normal, let&apos;s fix it.</span></>])
    : ["idle", <>Namaste! Pick a topic, then answer out loud and tell me <b className="font-medium">why</b>. <span className="text-muted">Wrong answers are welcome here.</span></>];

  return (
    <>
      <Head step="01 · Bolo" title="Explain your answer, out loud" />
      <div className="mb-6"><Guide mood={mood}>{say}</Guide></div>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {TOPICS.map((t) => (
            <button key={t.id} disabled={busy || r.on} onClick={() => pick(t)}
              className={`flex items-center gap-2.5 rounded-full border py-1 pl-1 pr-3.5 text-sm transition ${t.id === topic.id ? "border-ink bg-ink text-white" : "border-line bg-surface hover:border-ink/30"}`}>
              <span className={`grid h-7 min-w-7 place-items-center rounded-full px-1.5 font-mono text-[11px] ${t.id === topic.id ? "bg-white/15" : "bg-raised"}`}>{t.glyph}</span>
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex rounded-full bg-raised p-1 text-sm" role="radiogroup" aria-label="Transcript language">
          {(Object.keys(LANGS) as Lang[]).map((l) => (
            <button key={l} role="radio" aria-checked={lang === l} title={LANGS[l].hint} disabled={busy || r.on} onClick={() => pickLang(l)}
              className={`rounded-full px-3 py-1.5 transition ${lang === l ? "bg-surface font-medium shadow-sm" : "text-muted hover:text-ink"}`}>
              {LANGS[l].label}
            </button>
          ))}
        </div>
      </div>

      <Card className="p-0">
        <div className="border-b border-line p-6">
          <div className="mb-2 flex items-center justify-between text-xs text-muted">
            <span>Question · {topic.level}</span><span>Edit it to ask anything</span>
          </div>
          <textarea value={question} onChange={(e) => setQuestion(e.target.value)} disabled={busy || r.on} rows={2}
            className="w-full resize-none bg-transparent font-serif text-2xl leading-snug outline-none sm:text-3xl" />
        </div>
        <div className="flex flex-col items-center gap-5 rounded-b-2xl bg-[radial-gradient(circle_at_50%_30%,var(--color-chart-soft),transparent_65%)] p-8">
          <button onClick={record} disabled={busy} aria-label={r.on ? "Stop and diagnose" : "Record your answer"}
            className="relative grid size-24 place-items-center rounded-full bg-ink text-white transition hover:scale-105 disabled:opacity-40">
            {r.on && <span className="absolute inset-0 animate-breathe rounded-full bg-negative" />}
            {r.on
              ? <span className="size-7 rounded-md bg-negative" />
              : <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="9" y="3" width="6" height="12" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></svg>}
          </button>
          <div className="flex h-10 items-center gap-[3px]" aria-hidden>
            {r.bars.map((v, i) => (
              <span key={i} className={`w-1 rounded-full transition-[height] duration-75 ${r.on ? "bg-chart" : "bg-line"}`} style={{ height: `${8 + v * 32}px` }} />
            ))}
          </div>
          <p className="text-sm text-muted">
            {r.on ? "Listening… tap to stop and diagnose" : `Tap to record · transcript in ${LANGS[lang].label}`}
          </p>
          <button className={btn2} disabled={busy || r.on || question !== topic.question} onClick={sample}>
            ▶ Play a sample learner <Model m="bulbul" />
          </button>
        </div>
      </Card>

      {(state === "running" || state === "success") && <div className="mt-4"><Steps steps={PIPE} at={at} /></div>}

      {state === "success" && d && (
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <Card title={<span className="flex items-center justify-between">What you said <Model m="saaras" /></span>}>
            <p className="text-xl leading-relaxed">
              “{hl ? <>{hl[0]}<mark className="rounded bg-marigold-soft px-1 text-ink decoration-marigold underline decoration-2 underline-offset-4">{d.evidence}</mark>{hl.slice(1).join(d.evidence)}</> : d.transcript}”
            </p>
            {hl && <p className="mt-3 text-xs text-muted">Highlighted: the words that gave the idea away.</p>}
          </Card>
          <section className="animate-rise rounded-2xl bg-ink p-6 text-white [animation-delay:100ms]">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/60">{sound ? "Diagnosis" : "The hidden thought"}</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-xs"><span className="size-1.5 rounded-full bg-white" />Sarvam-105B</span>
            </div>
            <p className="mt-2 font-serif text-3xl leading-tight">{sound ? "Sound reasoning" : d.misconception}</p>
            {d.right_idea && <p className="mt-3 text-white/75"><span className="text-white/50">Right idea · </span>{d.right_idea}</p>}
            <div className="mt-5 flex items-center gap-3 text-xs text-white/60">
              <span>{d.concept}</span>
              <span className="h-1 flex-1 rounded-full bg-white/15"><span className="block h-1 rounded-full bg-white" style={{ width: `${Number(d.confidence) * 100}%` }} /></span>
              <span className="font-mono">{Math.round(Number(d.confidence) * 100)}% sure</span>
            </div>
            <Link href="/reteach" className={`${btnLight} mt-6 w-full`}>Re-teach this idea →</Link>
          </section>
        </div>
      )}
    </>
  );
}
