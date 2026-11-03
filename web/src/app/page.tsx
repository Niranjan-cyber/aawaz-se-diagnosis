import Link from "next/link";
import { btn, btn2, Model } from "@/components/ui";
import { TOPICS } from "@/lib/sarvam";
import { Guide } from "@/components/bird";

const LOOP = [
  ["Bolo", "Explain your answer out loud, in Hindi, Hinglish or English.", "saaras"],
  ["Diagnose", "The hidden wrong idea is named, with the exact words that gave it away.", "105b"],
  ["Samjho", "Re-taught as a story, step by step, or a real-life analogy, spoken aloud.", "bulbul"],
  ["Abhyaas", "Spoken drills on that one idea. Mastery moves with every answer.", "bulbul"],
] as const;

export default function Home() {
  return (
    <div className="space-y-16">
      <section className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
        <div className="animate-rise">
          <h1 className="font-serif text-5xl leading-[1.02] sm:text-6xl">
            Galat jawab nahi.<br />Galat <em className="text-chart">soch</em> pakdo.
          </h1>
          <p className="mt-5 max-w-md text-base text-muted">
            A wrong answer tells you <i>that</i> a learner is stuck. Their spoken reasoning tells you <i>why</i>. We listen,
            name the misconception, and fix it out loud.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/speak" className={btn}>Start speaking</Link>
            <Link href="/mastery" className={btn2}>See mastery</Link>
          </div>
          <div className="mt-8">
            <Guide mood="idle" size={72}>Namaste, main Bulbul hoon! <span className="text-muted">I listen to how you think, and help fix the idea, not just the answer.</span></Guide>
          </div>
        </div>

        {/* A real piece of the product, not a stock illustration */}
        <div className="animate-rise rounded-3xl border border-line bg-surface p-5 shadow-[0_24px_60px_-30px_rgba(18,17,15,.35)] [animation-delay:120ms]">
          <div className="flex items-center justify-between"><Model m="saaras" /><span className="font-mono text-xs text-muted">Physics · Class 9</span></div>
          <p className="mt-4 text-lg leading-relaxed">
            “Bhaari ball pehle girega, kyunki <mark className="rounded bg-marigold-soft px-1 text-ink">uska weight zyada hai toh gravity usse tez kheenchti hai</mark>.”
          </p>
          <div className="mt-5 rounded-2xl bg-ink p-5 text-white">
            <div className="flex items-center justify-between"><span className="text-xs text-white/60">The hidden thought</span><span className="font-mono text-xs text-white/60">0.95</span></div>
            <p className="mt-1 font-serif text-2xl">Heavier objects fall faster</p>
            <p className="mt-2 text-sm text-white/70">Right idea: all objects fall with the same acceleration, g.</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-sm font-medium text-muted">The loop</h2>
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {LOOP.map(([t, d, m], i) => (
            <li key={t} className="animate-rise rounded-2xl border border-line bg-surface p-5" style={{ animationDelay: `${i * 80}ms` }}>
              <span className="font-mono text-xs text-muted">0{i + 1}</span>
              <p className="mt-2 font-serif text-2xl">{t}</p>
              <p className="mt-1 text-sm text-muted">{d}</p>
              <div className="mt-4"><Model m={m} /></div>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className="mb-4 text-sm font-medium text-muted">From Class 5 to college</h2>
        <div className="flex flex-wrap gap-2">
          {TOPICS.map((t) => (
            <Link key={t.id} href="/speak" className="flex items-center gap-3 rounded-full border border-line bg-surface py-1.5 pl-1.5 pr-4 text-sm transition hover:border-ink/30">
              <span className="grid h-8 min-w-8 place-items-center rounded-full bg-raised px-2 font-mono text-xs">{t.glyph}</span>
              {t.label} <span className="text-muted">{t.level}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
