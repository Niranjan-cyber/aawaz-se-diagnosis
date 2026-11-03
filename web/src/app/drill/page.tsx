import { Card, Head } from "@/components/ui";

export default function Drill() {
  return (
    <>
      <Head kicker="Bulbul speaks · Saaras listens" title="Abhyaas" />
      <Card title="Question 1 of 3">
        <p className="text-lg">1/4 aur 1/5 mein bada kaun hai?</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button className="rounded-full border border-line px-4 py-2 text-sm">🔊 Suno</button>
          <button className="rounded-full bg-accent px-4 py-2 text-sm text-white">● Jawab bolo</button>
        </div>
      </Card>
    </>
  );
}
