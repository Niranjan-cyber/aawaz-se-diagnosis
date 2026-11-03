import Link from "next/link";
import { btn } from "@/components/ui";

export default function Home() {
  return (
    <div className="py-8 md:py-16">
      <h1 className="max-w-xl text-4xl font-medium leading-tight sm:text-5xl">
        Galat jawab nahi. Galat <span className="underline decoration-chart decoration-4 underline-offset-8">soch</span> pakdo.
      </h1>
      <p className="mt-5 max-w-lg text-base text-muted">
        Anyone explains an answer out loud in Hindi, from Class 5 fractions to physics, calculus or how LLMs work. We
        hear the reasoning, name the misconception, re-teach it a new way, and drill it by voice.
      </p>
      <Link href="/speak" className={`${btn} mt-8`}>Start speaking</Link>
    </div>
  );
}
