import { Card, Head } from "@/components/ui";

const sample = { "Fraction comparison": 0.3, "Adding fractions": 0.5, "Equivalent fractions": 0.7, "Fraction as part of whole": 0.4 };

export default function Mastery() {
  return (
    <>
      <Head kicker="Per-skill mastery" title="Pragati" />
      <Card title="Skills">
        <ul className="grid gap-4">
          {Object.entries(sample).map(([skill, s]) => (
            <li key={skill}>
              <div className="flex justify-between text-sm"><span>{skill}</span><span className="text-muted">{Math.round(s * 100)}%</span></div>
              <div className="mt-1.5 h-2 rounded-full bg-line"><div className="h-2 rounded-full bg-accent" style={{ width: `${s * 100}%` }} /></div>
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}
