import type { Metadata } from "next";
import { Inter, Noto_Sans_Devanagari } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const deva = Noto_Sans_Devanagari({ subsets: ["devanagari"], variable: "--font-deva" });

export const metadata: Metadata = {
  title: "Aawaz se Diagnosis",
  description: "Hear how a child thinks. Find the misconception. Fix it out loud.",
};

const steps = [
  ["/speak", "1 · Bolo"],
  ["/reteach", "2 · Samjho"],
  ["/drill", "3 · Abhyaas"],
  ["/mastery", "4 · Pragati"],
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hi">
      <body className={`${inter.variable} ${deva.variable} font-sans antialiased`}>
        <div className="mx-auto flex min-h-dvh max-w-3xl flex-col px-4 sm:px-6">
          <header className="flex flex-wrap items-center justify-between gap-3 py-5">
            <Link href="/" className="text-lg font-semibold tracking-tight">
              आवाज़ <span className="text-muted">se Diagnosis</span>
            </Link>
            <nav className="flex flex-wrap gap-1 text-sm">
              {steps.map(([href, label]) => (
                <Link key={href} href={href} className="rounded-full px-3 py-1.5 text-muted hover:bg-line hover:text-ink">
                  {label}
                </Link>
              ))}
            </nav>
          </header>
          <main className="flex-1 py-6">{children}</main>
          <footer className="border-t border-line py-5 text-xs text-muted">
            Powered by Sarvam: <b>Saaras</b> hears · <b>Sarvam-105B</b> diagnoses · <b>Bulbul</b> speaks
          </footer>
        </div>
      </body>
    </html>
  );
}
