"use client";
import { useRef, useState } from "react";

// Saaras accepts WAV reliably; browsers record webm/opus. Decode and re-encode as 16 kHz mono PCM WAV.
async function toWav(blob: Blob): Promise<Blob> {
  const ctx = new AudioContext();
  const buf = await ctx.decodeAudioData(await blob.arrayBuffer());
  ctx.close();
  const rate = 16000;
  const off = new OfflineAudioContext(1, Math.ceil(buf.duration * rate), rate);
  const src = off.createBufferSource();
  src.buffer = buf;
  src.connect(off.destination);
  src.start();
  const pcm = (await off.startRendering()).getChannelData(0);
  const v = new DataView(new ArrayBuffer(44 + pcm.length * 2));
  const s = (o: number, t: string) => [...t].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
  s(0, "RIFF"); v.setUint32(4, 36 + pcm.length * 2, true); s(8, "WAVE"); s(12, "fmt ");
  v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, rate, true); v.setUint32(28, rate * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true);
  s(36, "data"); v.setUint32(40, pcm.length * 2, true);
  pcm.forEach((x, i) => v.setInt16(44 + i * 2, Math.max(-1, Math.min(1, x)) * 0x7fff, true));
  return new Blob([v], { type: "audio/wav" });
}

export function useRecorder() {
  const rec = useRef<MediaRecorder | null>(null);
  const [on, setOn] = useState(false);
  async function start() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    rec.current = new MediaRecorder(stream);
    rec.current.start();
    setOn(true);
  }
  function stop(): Promise<Blob> {
    return new Promise((res) => {
      const r = rec.current!;
      const chunks: Blob[] = [];
      r.ondataavailable = (e) => chunks.push(e.data);
      r.onstop = () => {
        r.stream.getTracks().forEach((t) => t.stop());
        setOn(false);
        const raw = new Blob(chunks, { type: r.mimeType });
        toWav(raw).then(res, () => res(raw)); // decode failed: send raw and let Saaras try
      };
      r.stop();
    });
  }
  return { on, start, stop };
}
