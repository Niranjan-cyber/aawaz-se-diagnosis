import { Card, Head } from "@/components/ui";

export default function Reteach() {
  return (
    <>
      <Head kicker="Sarvam-105B + Bulbul" title="Samjho, naye tareeke se" />
      <div className="mb-4 flex flex-wrap gap-2 text-sm">
        {["Kahani", "Number line", "Asli zindagi"].map((t, i) => (
          <span key={t} className={`rounded-full px-4 py-1.5 ${i === 1 ? "bg-ink text-white" : "border border-line"}`}>{t}</span>
        ))}
      </div>
      <Card title="Number line">
        <svg viewBox="0 0 300 60" className="w-full">
          <line x1="10" y1="30" x2="290" y2="30" stroke="currentColor" />
          {[[10, "0"], [103, "1/3"], [150, "1/2"], [290, "1"]].map(([x, l]) => (
            <g key={l as string}>
              <line x1={x} x2={x} y1="22" y2="38" stroke="currentColor" />
              <text x={x} y="54" fontSize="11" textAnchor="middle">{l}</text>
            </g>
          ))}
        </svg>
        <p className="mt-3">1/2 zyada door hai — isliye 1/2 bada hai.</p>
        <button className="mt-4 rounded-full border border-line px-4 py-2 text-sm">🔊 Listen (Bulbul)</button>
      </Card>
    </>
  );
}
