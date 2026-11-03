import { Card, Head } from "@/components/ui";

export default function Speak() {
  return (
    <>
      <Head kicker="Saaras · speech to text" title="Bolo: 1/3 aur 1/2 mein bada kaun?" />
      <div className="grid gap-4">
        <Card title="Your answer">
          <div className="flex flex-wrap gap-3">
            <button className="rounded-full bg-accent px-5 py-2.5 text-white">● Record</button>
            <button className="rounded-full border border-line px-5 py-2.5">▶ Play sample</button>
          </div>
        </Card>
        <Card title="Transcript">
          <p className="text-lg">“Mujhe lagta hai 1/3 bada hai 1/2 se, kyunki 3 bada hai 2 se.”</p>
        </Card>
        <Card title="Misconception · Sarvam-105B">
          <p className="text-lg font-medium">Bigger denominator = bigger fraction</p>
          <p className="mt-1 text-sm text-muted">Evidence: “kyunki 3 bada hai 2 se” · confidence 0.92</p>
        </Card>
      </div>
    </>
  );
}
