const base = "inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium transition active:scale-[.98] disabled:pointer-events-none disabled:opacity-40";
export const btn = `${base} bg-ink text-white hover:bg-ink-2`;
export const btn2 = `${base} bg-surface text-ink ring-1 ring-line hover:ring-ink/30`;
export const btnLight = `${base} bg-white text-ink hover:bg-white/90`;

export function Card({ title, children, className = "" }: { title?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={`animate-rise rounded-2xl border border-line bg-surface p-6 ${className}`}>
      {title && <h2 className="mb-3 text-sm font-medium text-muted">{title}</h2>}
      {children}
    </section>
  );
}

export function Head({ step, title, sub }: { step?: string; title: React.ReactNode; sub?: React.ReactNode }) {
  return (
    <div className="mb-7">
      {step && <p className="mb-2 font-mono text-xs text-muted">{step}</p>}
      <h1 className="font-serif text-3xl leading-tight sm:text-4xl">{title}</h1>
      {sub && <p className="mt-2 max-w-xl text-muted">{sub}</p>}
    </div>
  );
}

const MODEL = {
  saaras: ["Saaras", "bg-chart"],
  "105b": ["Sarvam-105B", "bg-ink"],
  bulbul: ["Bulbul", "bg-marigold"],
} as const;

/** Small tag showing which Sarvam model produced a piece of the UI. */
export function Model({ m, live = false }: { m: keyof typeof MODEL; live?: boolean }) {
  const [name, dot] = MODEL[m];
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-raised px-2.5 py-1 text-xs font-medium text-ink-2">
      <span className="relative flex size-1.5">
        {live && <span className={`absolute inline-flex size-full animate-ping rounded-full ${dot} opacity-75`} />}
        <span className={`relative inline-flex size-1.5 rounded-full ${dot}`} />
      </span>
      {name}
    </span>
  );
}

/** Animated equaliser shown while audio plays or the model is working. */
export function Pulse({ className = "bg-ink" }: { className?: string }) {
  return (
    <span className="inline-flex h-3 items-end gap-[2px]" aria-hidden>
      {[0, 1, 2, 3].map((i) => (
        <span key={i} className={`w-[3px] animate-pulse rounded-full ${className}`} style={{ height: `${[60, 100, 40, 80][i]}%`, animationDelay: `${i * 120}ms` }} />
      ))}
    </span>
  );
}

export function Ring({ value, size = 88 }: { value: number; size?: number }) {
  const r = size / 2 - 6, c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="-rotate-90" aria-label={`${Math.round(value * 100)}%`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth="7" className="stroke-raised" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth="7" strokeLinecap="round" className="stroke-chart transition-[stroke-dashoffset] duration-1000"
        strokeDasharray={c} strokeDashoffset={c * (1 - value)} />
    </svg>
  );
}

/** Pipeline tracker: which Sarvam model is working right now. */
export function Steps({ steps, at }: { steps: [string, keyof typeof MODEL][]; at: number }) {
  return (
    <ol className="grid gap-2 sm:grid-cols-3">
      {steps.map(([label, m], i) => (
        <li key={label} className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition ${i < at ? "border-line bg-surface text-muted" : i === at ? "border-ink bg-surface" : "border-dashed border-line text-muted/60"}`}>
          <span className={`grid size-6 shrink-0 place-items-center rounded-full font-mono text-xs ${i < at ? "bg-positive text-white" : i === at ? "bg-ink text-white" : "bg-raised"}`}>
            {i < at ? "✓" : i + 1}
          </span>
          <span className="min-w-0">
            <span className="block truncate">{label}</span>
            <span className="block text-xs text-muted">{MODEL[m][0]}</span>
          </span>
          {i === at && <span className="ml-auto"><Pulse /></span>}
        </li>
      ))}
    </ol>
  );
}
