export type Topic = { id: string; label: string; glyph: string; level: string; question: string; sample: string };

export const TOPICS: Topic[] = [
  { id: "fractions", label: "Fractions", glyph: "½", level: "Class 5–7", question: "1/3 aur 1/2 mein bada kaun?",
    sample: "Mujhe lagta hai ek tihai bada hai ek bata do se, kyunki teen bada hai do se." },
  { id: "physics", label: "Physics", glyph: "F=ma", level: "Class 9–12", question: "Bhaari aur halki ball ek saath giraao, toh pehle kaun girega?",
    sample: "Bhaari ball pehle girega, kyunki uska weight zyada hai toh gravity usse zyada tez kheenchti hai." },
  { id: "chemistry", label: "Chemistry", glyph: "H₂O", level: "Class 9–12", question: "Paani ubalne par jo bubbles bante hain, unke andar kya hota hai?",
    sample: "Bubbles mein hawa hoti hai, aur paani ubalne par oxygen aur hydrogen alag ho jaate hain." },
  { id: "calculus", label: "Calculus", glyph: "∫", level: "Class 11 – college", question: "x square ka derivative kya hai, aur kyun?",
    sample: "x square ka derivative x hai, kyunki derivative mein bas power hata dete hain." },
  { id: "ai", label: "AI", glyph: "LLM", level: "College & beyond", question: "ChatGPT jaise LLM jawab kaise banate hain?",
    sample: "ChatGPT har sawaal par internet se live search karke database se sahi jawab dhoondh ke deta hai, isliye woh hamesha sahi hota hai." },
];

// Transcript language. Verified against Saaras v3: "unknown" auto-detects (English stays English),
// "translate" always returns English, "translit" returns Roman-script Hinglish.
export type Lang = "auto" | "en" | "hinglish" | "hi";
export const LANGS: Record<Lang, { label: string; hint: string; code: string; mode?: string }> = {
  auto: { label: "Auto", hint: "Keeps the language you speak", code: "unknown" },
  en: { label: "English", hint: "Always English text", code: "hi-IN", mode: "translate" },
  hinglish: { label: "Hinglish", hint: "Hindi in Roman letters", code: "hi-IN", mode: "translit" },
  hi: { label: "हिंदी", hint: "Devanagari script", code: "hi-IN" },
};
export function getLang(): Lang {
  try { const l = localStorage.getItem("lang") as Lang; return l in LANGS ? l : "auto"; } catch { return "auto"; }
}
export function setLang(l: Lang) { try { localStorage.setItem("lang", l); } catch {} }

const DEVANAGARI = /[ऀ-ॿ]/;
export function replyStyle(lang: Lang, transcript: string): { reply: string; voice: string } {
  if (lang === "en" || (lang === "auto" && !DEVANAGARI.test(transcript))) return { reply: "simple English", voice: "en-IN" };
  if (lang === "hi") return { reply: "simple Hindi in Devanagari script", voice: "hi-IN" };
  return { reply: "simple Hinglish in Roman script", voice: "hi-IN" };
}

export type Diagnosis = {
  transcript: string; topic: string; question: string; reply: string; voice: string;
  correct: boolean; misconception: string; right_idea: string; concept: string; evidence: string; confidence: number;
};

export async function stt(audio: Blob, lang: Lang = "auto"): Promise<string> {
  const f = new FormData();
  f.append("file", audio, audio.type.includes("wav") ? "a.wav" : "a.webm");
  f.append("model", "saaras:v3");
  f.append("language_code", LANGS[lang].code);
  if (LANGS[lang].mode) f.append("mode", LANGS[lang].mode!);
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

export async function tts(text: string, voice = "hi-IN"): Promise<Blob> {
  const r = await fetch("/api/sarvam/text-to-speech", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ text: text.slice(0, 1500), target_language_code: voice, model: "bulbul:v3" }),
  });
  if (!r.ok) throw new Error(`Bulbul ${r.status}`);
  const b64 = (await r.json()).audios?.[0];
  if (!b64) throw new Error("Bulbul returned no audio");
  return new Blob([Uint8Array.from(atob(b64), (c) => c.charCodeAt(0))], { type: "audio/wav" });
}

/** Plays audio and resolves when it finishes. */
export function play(b: Blob): Promise<void> {
  return new Promise((res) => {
    const a = new Audio(URL.createObjectURL(b));
    a.onended = () => res();
    a.onerror = () => res();
    a.play().catch(() => res());
  });
}

export async function diagnose(transcript: string, topic: string, question: string, reply: string) {
  const out = await chat(
    `You are an expert teacher of ${topic}. A learner answered a question out loud (transcript below, may be Hindi, Hinglish or English). Find the underlying misconception in their reasoning, not just whether the answer is wrong. Reply ONLY JSON: {"correct":true|false,"misconception":"<short English name of the wrong mental model, or 'None' if reasoning is sound>","right_idea":"<the correct idea in one short sentence, in ${reply}>","concept":"<the core concept being tested, 2-4 English words>","evidence":"<exact phrase copied from the transcript that reveals it>","confidence":0..1}`,
    `Question: ${question}\nTranscript: ${transcript}`,
  );
  const j = parseJSON<Omit<Diagnosis, "transcript" | "topic" | "question" | "reply" | "voice">>(out);
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
