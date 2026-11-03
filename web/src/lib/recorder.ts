"use client";
import { useRef, useState } from "react";

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
      r.onstop = () => { r.stream.getTracks().forEach((t) => t.stop()); setOn(false); res(new Blob(chunks, { type: r.mimeType })); };
      r.stop();
    });
  }
  return { on, start, stop };
}
