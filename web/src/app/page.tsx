import Link from "next/link";

export default function Home() {
  return (
    <div className="py-10">
      <p className="text-sm text-accent">Fractions · Class 5–7 · Hindi</p>
      <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
        Galat jawab nahi —<br />galat <span className="text-accent">soch</span> pakdo.
      </h1>
      <p className="mt-5 max-w-xl text-lg text-muted">
        A student explains their answer out loud. We hear the reasoning, name the misconception, re-teach it a new way,
        and drill it by voice.
      </p>
      <Link href="/speak" className="mt-8 inline-block rounded-full bg-accent px-6 py-3 font-medium text-white hover:opacity-90">
        Start: student speaks →
      </Link>
    </div>
  );
}
