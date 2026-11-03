export type Topic = { id: string; label: string; level: string; question: string; sample: string };

export const TOPICS: Topic[] = [
  { id: "fractions", label: "Fractions", level: "Class 5–7", question: "1/3 aur 1/2 mein bada kaun?",
    sample: "Mujhe lagta hai ek tihai bada hai ek bata do se, kyunki teen bada hai do se." },
  { id: "physics", label: "Physics", level: "Class 9–12", question: "Bhaari aur halki ball ek saath giraao, toh pehle kaun girega?",
    sample: "Bhaari ball pehle girega, kyunki uska weight zyada hai toh gravity usse zyada tez kheenchti hai." },
  { id: "chemistry", label: "Chemistry", level: "Class 9–12", question: "Paani ubalne par jo bubbles bante hain, unke andar kya hota hai?",
    sample: "Bubbles mein hawa hoti hai, aur paani ubalne par oxygen aur hydrogen alag ho jaate hain." },
  { id: "calculus", label: "Calculus", level: "Class 11 – college", question: "x square ka derivative kya hai, aur kyun?",
    sample: "x square ka derivative x hai, kyunki derivative mein bas power hata dete hain." },
  { id: "ai", label: "AI", level: "College & beyond", question: "ChatGPT jaise LLM jawab kaise banate hain?",
    sample: "ChatGPT har sawaal par internet se live search karke database se sahi jawab dhoondh ke deta hai, isliye woh hamesha sahi hota hai." },
];

export type Diagnosis = {
  transcript: string; topic: string; question: string;
  correct: boolean; misconception: string; concept: string; evidence: string; confidence: number;
};

export async function stt(audio: Blob): Promise<string> {
  const f = new FormData();
  f.append("file", audio, audio.type.includes("wav") ? "a.wav" : "a.webm");
  f.append("model", "saaras:v3");
  f.append("language_code", "hi-IN");
  const r = await fetch("/api/sarvam/speech-to-text", { method: "POST", body: f });
  if (!r.ok) throw new Error(`Saaras couldn't read the audio (${r.status}): ${(await r.text()).slice(0, 120)}`);
  return (await r.json()).transcript ?? "";
}

export async function chat(system: string, user: string): Promise<string> {
  const r = await fetch("/api/sarvam/v1/chat/completions", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      model: "sarvam-105b-conversations",
      messages: [{ role: "system", content: system }, { role: "user", content: user }],
    }),
  });
  if (!r.ok) throw new Error(`Sarvam-105B ${r.status}`);
  return (await r.json()).choices?.[0]?.message?.content ?? "";
}

export function parseJSON<T>(s: string): T | null {
  const m = s.match(/[[{][\s\S]*[\]}]/); // tolerate ```json fences and chatter
  try { return m ? JSON.parse(m[0]) : null; } catch { return null; }
}

export async function tts(text: string): Promise<Blob> {
  const r = await fetch("/api/sarvam/text-to-speech", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ text: text.slice(0, 1500), target_language_code: "hi-IN", model: "bulbul:v3" }),
  });
  if (!r.ok) throw new Error(`Bulbul ${r.status}`);
  const b64 = (await r.json()).audios?.[0];
  if (!b64) throw new Error("Bulbul returned no audio");
  return new Blob([Uint8Array.from(atob(b64), (c) => c.charCodeAt(0))], { type: "audio/wav" });
}

export const play = (b: Blob) => new Audio(URL.createObjectURL(b)).play();

export async function diagnose(transcript: string, topic: string, question: string) {
  const out = await chat(
    `You are an expert teacher of ${topic}. A learner answered a question out loud (Hindi/Hinglish transcript). Find the underlying misconception in their reasoning, not just whether the answer is wrong. Reply ONLY JSON: {"correct":true|false,"misconception":"<short English name of the wrong mental model, or 'None' if reasoning is sound>","concept":"<the core concept being tested, 2-4 words>","evidence":"<exact phrase copied from the transcript that reveals it>","confidence":0..1}`,
    `Question: ${question}\nTranscript: ${transcript}`,
  );
  const j = parseJSON<Omit<Diagnosis, "transcript" | "topic" | "question">>(out);
  if (!j?.misconception || !j.concept) throw new Error("unsure");
  return j;
}

// mastery: browser storage, keyed by concept. ponytail: per-browser only; move to the Render API when deployed
export function getMastery(): Record<string, number> {
  try { return JSON.parse(localStorage.getItem("mastery") ?? "{}"); } catch { return {}; }
}
export function bumpMastery(concept: string, delta: number) {
  const m = getMastery();
  m[concept] = Math.round(Math.max(0, Math.min(1, (m[concept] ?? 0.3) + delta)) * 100) / 100;
  try { localStorage.setItem("mastery", JSON.stringify(m)); } catch {}
  return m;
}
