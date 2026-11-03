"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const steps = [
  ["/speak", "Bolo", "Speak your reasoning"],
  ["/reteach", "Samjho", "Re-teach"],
  ["/drill", "Abhyaas", "Spoken drill"],
  ["/mastery", "Pragati", "Mastery"],
];

export default function Nav() {
  const path = usePathname();
  return (
    <aside className="sticky top-0 z-10 flex items-center justify-between gap-2 border-b border-line bg-paper/90 px-4 py-3 backdrop-blur md:static md:flex-col md:items-stretch md:justify-start md:border-b-0 md:border-r md:bg-transparent md:px-4 md:py-8">
      <Link href="/" className="px-2 md:mb-10">
        <span className="block font-serif text-2xl leading-none">आवाज़</span>
        <span className="hidden text-xs text-muted md:block">se Diagnosis</span>
      </Link>
      <nav className="flex gap-1 overflow-x-auto md:flex-col md:gap-1">
        {steps.map(([href, hi, en], i) => {
          const on = path === href;
          return (
            <Link key={href} href={href}
              className={`group flex shrink-0 items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${on ? "bg-surface shadow-[0_0_0_1px_var(--color-line)]" : "text-muted hover:text-ink"}`}>
              <span className={`grid size-6 place-items-center rounded-full font-mono text-[11px] ${on ? "bg-ink text-white" : "bg-raised"}`}>{i + 1}</span>
              <span>
                <span className="block font-medium">{hi}</span>
                <span className="hidden text-xs text-muted md:block">{en}</span>
              </span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto hidden space-y-2 px-3 text-xs text-muted md:block">
        <p className="font-medium text-ink">Built on Sarvam</p>
        <p className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-chart" />Saaras hears</p>
        <p className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-ink" />Sarvam-105B diagnoses</p>
        <p className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-marigold" />Bulbul speaks</p>
      </div>
    </aside>
  );
}
