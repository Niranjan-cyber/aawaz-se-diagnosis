import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-16 text-center">
      <h1 className="text-2xl font-semibold">Yeh page nahi mila</h1>
      <Link href="/" className="mt-4 inline-block text-accent">← Ghar wapas</Link>
    </div>
  );
}
