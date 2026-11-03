"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const steps = [
  ["/speak", "Bolo", "Student speaks"],
  ["/reteach", "Samjho", "Re-teach"],
  ["/drill", "Abhyaas", "Spoken drill"],
  ["/mastery", "Pragati", "Mastery"],
];

export default function Nav() {
  const path = usePathname();
  return (
    <aside className="flex items-center justify-between gap-2 border-b border-line px-4 py-3 md:flex-col md:items-stretch md:justify-start md:border-b-0 md:border-r md:px-3 md:py-8">
      <Link href="/" className="px-2 text-base font-medium md:mb-8">
        आवाज़ <span className="text-muted">se Diagnosis</span>
      </Link>
      <nav className="flex gap-1 overflow-x-auto md:flex-col md:gap-0.5">
        {steps.map(([href, hi, en], i) => (
          <Link
            key={href}
            href={href}
            className={`flex h-8 shrink-0 items-center gap-2 rounded-md px-3 text-sm ${path === href ? "bg-raised text-ink" : "text-muted hover:text-ink"}`}
          >
            <span className="font-mono text-xs">{i + 1}</span>
            {hi}
            <span className="hidden text-muted md:inline">· {en}</span>
          </Link>
        ))}
      </nav>
      <p className="mt-auto hidden px-3 text-xs leading-5 text-muted md:block">
        Saaras hears.<br />Sarvam-105B diagnoses.<br />Bulbul speaks.
      </p>
    </aside>
  );
}
