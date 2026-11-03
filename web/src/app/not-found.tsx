import Link from "next/link";
import { btn } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="py-16">
      <h1 className="font-serif text-4xl">Yeh page nahi mila</h1>
      <p className="mt-2 text-muted">This page doesn&apos;t exist.</p>
      <Link href="/" className={`${btn} mt-6`}>Back to start</Link>
    </div>
  );
}
