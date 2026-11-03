export function Sample() {
  return <span className="rounded-md bg-raised px-2 py-0.5 text-xs font-normal text-muted">sample data</span>;
}

export function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-line bg-surface p-6">
      <h2 className="mb-3 text-sm font-semibold">{title}</h2>
      {children}
    </section>
  );
}

export function Head({ kicker, title, sample = true }: { kicker: string; title: string; sample?: boolean }) {
  return (
    <div className="mb-6">
      <h1 className="flex flex-wrap items-center gap-3 text-2xl font-medium">
        {title} {sample && <Sample />}
      </h1>
      <p className="mt-1 text-muted">{kicker}</p>
    </div>
  );
}

const base = "inline-flex h-9 items-center gap-2 rounded-md px-4 text-sm font-medium disabled:opacity-50";
export const btn = `${base} bg-ink text-white hover:bg-ink/85`;
export const btn2 = `${base} bg-pill text-ink hover:bg-raised`;
