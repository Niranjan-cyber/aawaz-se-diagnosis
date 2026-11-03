// Thin proxy so the Sarvam key stays server-side.
const ALLOWED = new Set(["speech-to-text", "text-to-speech", "v1/chat/completions"]);

export async function POST(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const path = (await params).path.join("/");
  if (!ALLOWED.has(path)) return new Response("not found", { status: 404 });
  const r = await fetch(`https://api.sarvam.ai/${path}`, {
    method: "POST",
    headers: {
      "api-subscription-key": (process.env.SARVAM_API_KEY ?? "").replace(/^﻿/, "").trim(),
      ...(req.headers.get("content-type") ? { "content-type": req.headers.get("content-type")! } : {}),
    },
    body: await req.arrayBuffer(),
  });
  return new Response(r.body, { status: r.status, headers: { "content-type": r.headers.get("content-type") ?? "application/json" } });
}
