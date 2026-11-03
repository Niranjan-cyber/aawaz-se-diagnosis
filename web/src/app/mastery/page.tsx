"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { btn, Card, Head } from "@/components/ui";
import { getMastery } from "@/lib/sarvam";

export default function Mastery() {
  const [scores, setScores] = useState<Record<string, number> | null>(null);
  useEffect(() => setScores(getMastery()), []);
  const rows = scores ? Object.entries(scores) : [];

  return (
    <>
      <Head kicker="Mastery per concept, updated by every drill answer" title="Pragati" sample={false} />
      <Card title="Concepts">
        {!scores ? <p className="text-muted">Loading…</p> : !rows.length ? (
          <><p className="text-muted">No concepts practised yet.</p><Link href="/speak" className={`${btn} mt-4`}>Start with Bolo</Link></>
        ) : (
          <ul className="grid gap-4">
            {rows.map(([c, s]) => (
              <li key={c}>
                <div className="flex justify-between"><span>{c}</span><span className="font-mono text-muted">{Math.round(s * 100)}%</span></div>
                <div className="mt-1.5 h-2 rounded-full bg-raised">
                  <div className="h-2 rounded-full bg-chart transition-all duration-700" style={{ width: `${s * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
