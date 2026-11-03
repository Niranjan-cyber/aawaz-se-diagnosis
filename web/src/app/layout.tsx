import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif, Noto_Sans_Devanagari } from "next/font/google";
import Nav from "@/components/nav";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", variable: "--font-serif-display" });
const deva = Noto_Sans_Devanagari({ subsets: ["devanagari"], variable: "--font-deva" });

export const metadata: Metadata = {
  title: "Aawaz se Diagnosis",
  description: "Hear how a learner thinks. Find the misconception. Fix it out loud.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${mono.variable} ${serif.variable} ${deva.variable}`}>
      <body className="font-sans antialiased">
        <div className="md:grid md:min-h-dvh md:grid-cols-[248px_1fr]">
          <Nav />
          <main className="mx-auto w-full max-w-[920px] px-4 py-8 md:px-12 md:py-12">{children}</main>
        </div>
      </body>
    </html>
  );
}
