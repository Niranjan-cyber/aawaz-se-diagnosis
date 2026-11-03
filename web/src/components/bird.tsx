// Bulbul, the guide. A red-whiskered bulbul (black crest, white cheek, red whisker and vent),
// which is also the name of Sarvam's voice model.
export type Mood = "idle" | "listening" | "thinking" | "happy" | "oops";

const MOTION: Record<Mood, string> = {
  idle: "animate-bob",
  listening: "animate-tilt",
  thinking: "animate-bob",
  happy: "animate-hop",
  oops: "animate-shake",
};

export function Bird({ mood = "idle", size = 96 }: { mood?: Mood; size?: number }) {
  const happy = mood === "happy";
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" className={`${MOTION[mood]} shrink-0 overflow-visible`} role="img" aria-label={`Bulbul the guide, ${mood}`}>
      {/* tail and red vent */}
      <path d="M38 78 L10 96 L16 100 L42 90 Z" fill="#5d4f41" />
      <ellipse cx="44" cy="92" rx="7" ry="4.5" fill="#d6322b" />
      {/* body, wing, belly */}
      <ellipse cx="60" cy="74" rx="30" ry="27" fill="#7d6b57" />
      <path d="M40 66 Q56 58 70 72 Q58 90 40 84 Z" fill="#665645" />
      <ellipse cx="68" cy="82" rx="19" ry="16" fill="#fbf6ec" />
      {/* feet */}
      <path d="M56 99 v8 M66 99 v8 M52 107 h8 M62 107 h8" stroke="#e8960c" strokeWidth="3" strokeLinecap="round" />
      {/* head and crest */}
      <path d="M58 30 L63 6 L78 27 Z" fill="#1f1d1a" />
      <circle cx="70" cy="44" r="21" fill="#1f1d1a" />
      <ellipse cx="77" cy="53" rx="9" ry="6.5" fill="#fff" />
      <circle cx="84" cy="44" r="3.4" fill="#d6322b" />
      {/* eye */}
      {happy ? (
        <path d="M70 41 q4 -5 8 0" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      ) : (
        <g>
          <circle cx="74" cy="40" r="5" fill="#fff" />
          <circle cx={mood === "thinking" ? 75.5 : 74.6} cy={mood === "thinking" ? 38 : 40.4} r="2.8" fill="#12110f" />
          <circle cx="75.6" cy="39" r="1" fill="#fff" />
        </g>
      )}
      {mood === "oops" && <path d="M68 32 L79 34" stroke="#fff" strokeWidth="2" strokeLinecap="round" />}
      {/* beak */}
      <path d={happy ? "M89 43 L99 45 L89 50 Q93 46 89 43 Z" : "M89 43 L100 47 L89 50 Z"} fill="#f0a33a" />
      {/* blush when happy */}
      {happy && <ellipse cx="80" cy="56" rx="4" ry="2.4" fill="#f4a3a0" opacity=".8" />}
      {/* mood extras */}
      {mood === "listening" && (
        <g stroke="#1d5fbf" strokeWidth="2.4" fill="none" strokeLinecap="round" className="animate-pulse">
          <path d="M104 34 q6 10 0 20" /><path d="M111 28 q10 16 0 32" />
        </g>
      )}
      {mood === "thinking" && (
        <g fill="#6e6a62">
          {[0, 1, 2].map((i) => <circle key={i} cx={96 + i * 9} cy={18 - i * 4} r={2.2 + i} className="animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />)}
        </g>
      )}
      {mood === "oops" && <path d="M58 24 q-4 7 0 9 q4 -2 0 -9 Z" fill="#7fb2f0" />}
    </svg>
  );
}

/** The guide plus a speech bubble. */
export function Guide({ mood, children, size = 84 }: { mood: Mood; children: React.ReactNode; size?: number }) {
  return (
    <div className="flex items-end gap-3">
      <Bird mood={mood} size={size} />
      <div key={String(children)} className="animate-rise relative mb-6 max-w-sm rounded-2xl rounded-bl-md border border-line bg-surface px-4 py-3 text-[15px] leading-snug shadow-[0_8px_24px_-16px_rgba(18,17,15,.4)]">
        {children}
      </div>
    </div>
  );
}

/** Small burst of colour on a correct answer. */
export function Burst() {
  const colors = ["#1d5fbf", "#e8960c", "#2e7d32", "#d6322b", "#12110f"];
  return (
    <span className="pointer-events-none absolute left-1/2 top-1/2" aria-hidden>
      {Array.from({ length: 14 }, (_, i) => {
        const a = (i / 14) * Math.PI * 2;
        return (
          <span key={i} className="animate-burst absolute size-2 rounded-full"
            style={{ background: colors[i % colors.length], ["--x" as string]: `${Math.cos(a) * 70}px`, ["--y" as string]: `${Math.sin(a) * 50}px` }} />
        );
      })}
    </span>
  );
}
