import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_Devanagari } from "next/font/google";
import Nav from "@/components/nav";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });
const deva = Noto_Sans_Devanagari({ subsets: ["devanagari"], variable: "--font-deva" });

export const metadata: Metadata = {
  title: "Aawaz se Diagnosis",
  description: "Hear how a child thinks. Find the misconception. Fix it out loud.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hi">
      <body className={`${geist.variable} ${mono.variable} ${deva.variable} font-sans antialiased`}>
        <div className="md:grid md:min-h-dvh md:grid-cols-[240px_1fr]">
          <Nav />
          <main className="mx-auto w-full max-w-[880px] px-4 py-6 md:px-12 md:py-9">{children}</main>
        </div>
      </body>
    </html>
  );
}
