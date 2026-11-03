import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-16">
      <h1 className="text-2xl font-medium">Yeh page nahi mila</h1>
      <Link href="/" className="mt-3 inline-block text-muted underline">Back to start</Link>
    </div>
  );
}
