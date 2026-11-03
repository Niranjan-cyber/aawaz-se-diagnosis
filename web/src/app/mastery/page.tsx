"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { btn, Card, Head, Ring } from "@/components/ui";
import { getMastery } from "@/lib/sarvam";
import { Guide } from "@/components/bird";

const band = (s: number) => (s >= 0.8 ? ["Mastered", "text-positive"] : s >= 0.5 ? ["Getting there", "text-chart"] : ["Needs work", "text-marigold"]);

export default function Mastery() {
  const [scores, setScores] = useState<Record<string, number> | null>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => { setScores(getMastery()); requestAnimationFrame(() => setShown(true)); }, []);
  const rows = scores ? Object.entries(scores).sort((a, b) => a[1] - b[1]) : [];
  const avg = rows.length ? rows.reduce((s, [, v]) => s + v, 0) / rows.length : 0;

  return (
    <>
      <Head step="04 · Pragati" title="Mastery, one idea at a time" sub="Every drill answer moves the concept it targets. Weakest first." />
      {!scores ? null : !rows.length ? (
        <><div className="mb-6"><Guide mood="idle">Your map is empty for now. Answer one question out loud and watch it grow!</Guide></div>
          <Link href="/speak" className={btn}>Start with Bolo</Link></>
      ) : (
        <>
          <div className="mb-6">
            <Guide mood={avg >= 0.5 ? "happy" : "idle"}>
              {avg >= 0.8 ? "Shabaash! You've mastered these. Try a tougher topic?" : avg >= 0.5 ? "Badhiya! You're getting there. One more round on the weakest idea?" : <>Every expert started here. <span className="text-muted">Practise the top one next.</span></>}
            </Guide>
          </div>
          <div className="mb-4 grid grid-cols-3 gap-3">
            {[["Concepts", rows.length], ["Average", `${Math.round(avg * 100)}%`], ["Mastered", rows.filter(([, v]) => v >= 0.8).length]].map(([k, v]) => (
              <div key={k} className="animate-rise rounded-2xl border border-line bg-surface p-4 sm:p-5">
                <p className="text-xs text-muted sm:text-sm">{k}</p><p className="mt-1 font-mono text-2xl sm:text-3xl">{v}</p>
              </div>
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {rows.map(([c, s], i) => {
              const [label, tone] = band(s);
              return (
                <div key={c} className="animate-rise flex items-center gap-5 rounded-2xl border border-line bg-surface p-5" style={{ animationDelay: `${i * 60}ms` }}>
                  <div className="relative">
                    <Ring value={shown ? s : 0} />
                    <span className="absolute inset-0 grid place-items-center font-mono text-lg">{Math.round(s * 100)}</span>
                  </div>
                  <div>
                    <p className="font-medium">{c}</p>
                    <p className={`text-sm ${tone}`}>{label}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <Link href="/speak" className={`${btn} mt-6`}>Diagnose another answer</Link>
        </>
      )}
    </>
  );
}
