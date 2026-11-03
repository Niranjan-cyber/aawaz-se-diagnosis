export function Sample() {
  return <span className="rounded-full bg-marigold/15 px-2 py-0.5 text-xs font-medium text-amber-800">sample data</span>;
}

export function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-white p-5 shadow-sm">
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">{title}</h2>
      {children}
    </section>
  );
}

export function Head({ kicker, title, sample = true }: { kicker: string; title: string; sample?: boolean }) {
  return (
    <div className="mb-6">
      <p className="text-sm text-accent">{kicker}</p>
      <h1 className="mt-1 flex flex-wrap items-center gap-3 text-3xl font-semibold tracking-tight">
        {title} {sample && <Sample />}
      </h1>
    </div>
  );
}
