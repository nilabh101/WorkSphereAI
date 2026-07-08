/**
 * WorkSphere AI — Wellness Chatbot
 *
 * A mental-health focused conversational assistant powered by Google Gemini.
 * The bot acts as an empathetic wellness companion for employees — it listens,
 * gives coping strategies, breathing exercises, and connects to HR resources.
 *
 * API key is read from the Vite env variable VITE_GEMINI_API_KEY.
 * Set it in a root .env file:  VITE_GEMINI_API_KEY=your_key_here
 */
import { useState, useRef, useEffect, useCallback } from "react";
import {
  Heart, Send, X, Minimize2, Maximize2, Bot, Smile,
  Wind, Moon, Sun, Sparkles, RefreshCw, Phone,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  ts: string;
}

type Mood = "great" | "good" | "okay" | "low" | "anxious" | null;

// ─── Constants ────────────────────────────────────────────────────────────────

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

const SYSTEM_PROMPT = `You are Aura, a compassionate and professional workplace wellness assistant for WorkSphere AI. Your role is to support employee mental health and wellbeing.

Guidelines:
- Speak with warmth, empathy, and professionalism. Never be dismissive.
- Focus on practical, evidence-based mental health support: breathing exercises, grounding techniques, cognitive reframing, stress management.
- For workplace issues (burnout, stress, workload), offer actionable coping strategies.
- Always validate feelings before offering advice.
- Keep responses concise (2–4 short paragraphs max) and conversational.
- Suggest connecting with HR or a professional when the situation is serious.
- Never diagnose or prescribe medication.
- If someone expresses thoughts of self-harm, immediately provide crisis resources (988 Lifeline, 911).
- You can suggest: breathing exercises, short walks, mindfulness, journaling, speaking to a manager or HR.
- Be culturally sensitive and inclusive.`;

const QUICK_PROMPTS = [
  { icon: Wind,  label: "Feeling stressed",     text: "I'm feeling really stressed at work today." },
  { icon: Moon,  label: "Can't sleep",           text: "I've been having trouble sleeping because of work anxiety." },
  { icon: Sun,   label: "Burnout",               text: "I think I'm experiencing burnout. I feel exhausted all the time." },
  { icon: Smile, label: "Breathing exercise",    text: "Can you guide me through a quick breathing exercise?" },
];

const MOOD_OPTIONS: { value: Mood; label: string; emoji: string; color: string }[] = [
  { value: "great",   label: "Great",   emoji: "😄", color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20" },
  { value: "good",    label: "Good",    emoji: "🙂", color: "text-sky-400     border-sky-500/30     bg-sky-500/10     hover:bg-sky-500/20"     },
  { value: "okay",    label: "Okay",    emoji: "😐", color: "text-amber-400   border-amber-500/30   bg-amber-500/10   hover:bg-amber-500/20"   },
  { value: "low",     label: "Low",     emoji: "😔", color: "text-orange-400  border-orange-500/30  bg-orange-500/10  hover:bg-orange-500/20"  },
  { value: "anxious", label: "Anxious", emoji: "😰", color: "text-rose-400    border-rose-500/30    bg-rose-500/10    hover:bg-rose-500/20"    },
];

// ─── Gemini API call ──────────────────────────────────────────────────────────

async function callGemini(history: Message[], userMessage: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    // Graceful fallback when no API key is set
    return getFallbackResponse(userMessage);
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

  // Build conversation history for Gemini
  const contents = [
    // Inject system prompt as first user turn (Gemini doesn't have a system role in basic API)
    { role: "user",  parts: [{ text: SYSTEM_PROMPT }] },
    { role: "model", parts: [{ text: "Understood. I'm Aura, your WorkSphere wellness assistant. I'm here to support your mental health and wellbeing. How are you feeling today?" }] },
    // Prior conversation
    ...history.map(m => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    })),
    // New message
    { role: "user", parts: [{ text: userMessage }] },
  ];

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents,
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 512,
        topP: 0.9,
      },
      safetySettings: [
        { category: "HARM_CATEGORY_HARASSMENT",        threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_HATE_SPEECH",       threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Gemini API error:", err);
    throw new Error(`Gemini API error: ${res.status}`);
  }

  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "I'm here for you. Could you tell me a little more about what you're experiencing?";
}

// ─── Fallback responses (no API key) ─────────────────────────────────────────

function getFallbackResponse(msg: string): string {
  const lower = msg.toLowerCase();

  if (lower.includes("stress") || lower.includes("overwhelm")) {
    return "I hear you — workplace stress can feel really heavy. Try the 4-7-8 breathing technique: inhale for 4 counts, hold for 7, exhale for 8. Repeat 3 times. Also, consider breaking your workload into smaller tasks and tackling just one thing at a time. Would you like to talk more about what's stressing you?";
  }
  if (lower.includes("sleep") || lower.includes("insomnia")) {
    return "Sleep issues and work anxiety often feed each other. A few things that help: avoid screens 30 minutes before bed, write down tomorrow's tasks to 'park' them mentally, and try a body scan meditation. If this persists, it's worth mentioning to HR — they can connect you with support resources.";
  }
  if (lower.includes("burnout") || lower.includes("exhausted") || lower.includes("tired")) {
    return "Burnout is real and serious. The key signs are emotional exhaustion, cynicism, and reduced effectiveness. First — be kind to yourself. Talk to your manager about your workload. Take proper lunch breaks. Consider a short leave if needed. You matter more than your output. What aspect of burnout are you experiencing most?";
  }
  if (lower.includes("breath") || lower.includes("calm") || lower.includes("anxious") || lower.includes("anxiety")) {
    return "Let's do a quick box breathing exercise together:\n\n1️⃣ Breathe IN slowly for 4 counts\n2️⃣ HOLD for 4 counts\n3️⃣ Breathe OUT for 4 counts\n4️⃣ HOLD for 4 counts\n\nRepeat this 4 times. It activates your parasympathetic nervous system and helps calm anxiety within minutes. How do you feel after trying it?";
  }
  if (lower.includes("sad") || lower.includes("depress") || lower.includes("hopeless")) {
    return "I'm really glad you felt safe enough to share that with me. Feeling low at work — or in general — is more common than people admit. Please know you're not alone. I'd encourage you to reach out to someone you trust, or speak with HR about accessing Employee Assistance Program (EAP) resources. If things ever feel very dark, please contact the 988 Suicide & Crisis Lifeline (call or text 988). You deserve support. 💙";
  }
  if (lower.includes("hr") || lower.includes("help") || lower.includes("resource")) {
    return "Here are some resources available to you:\n\n🔹 **HR Team** — Contact Priya Nair for confidential support\n🔹 **EAP** — Employee Assistance Program offers free counseling sessions\n🔹 **988 Lifeline** — Call or text 988 for mental health crisis support\n🔹 **Crisis Text Line** — Text HOME to 741741\n\nWould you like help preparing for a conversation with HR?";
  }

  return "Thank you for sharing that with me. I'm here to listen and support you. Could you tell me more about what you're going through? Whether it's work stress, personal challenges, or just needing to vent — this is a safe space. 💙";
}

// ─── Utility ──────────────────────────────────────────────────────────────────

function msgId() { return `m${Date.now()}${Math.random().toString(36).slice(2, 6)}`; }
function timeStr() {
  return new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface WellnessChatbotProps {
  onClose: () => void;
  floating?: boolean; // true = fixed floating panel, false = inline
}

export function WellnessChatbot({ onClose, floating = true }: WellnessChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: msgId(),
      role: "ai",
      content: "Hi there 💙 I'm **Aura**, your workplace wellness companion. I'm here to listen, support, and help you navigate stress, burnout, and anything in between — completely confidentially.\n\nHow are you feeling today?",
      ts: timeStr(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mood, setMood] = useState<Mood>(null);
  const [minimized, setMinimized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = useCallback(async (text: string = input) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = { id: msgId(), role: "user", content: trimmed, ts: timeStr() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      // Pass prior messages excluding the initial AI greeting for cleaner context
      const history = messages.slice(1);
      const reply = await callGemini(history, trimmed);
      setMessages(prev => [...prev, { id: msgId(), role: "ai", content: reply, ts: timeStr() }]);
    } catch {
      setError("Connection issue. Showing a local response instead.");
      const fallback = getFallbackResponse(trimmed);
      setMessages(prev => [...prev, { id: msgId(), role: "ai", content: fallback, ts: timeStr() }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [input, loading, messages]);

  function handleMoodSelect(m: Mood) {
    setMood(m);
    const label = MOOD_OPTIONS.find(o => o.value === m)?.label ?? "";
    send(`I'm feeling ${label} today.`);
  }

  function resetChat() {
    setMessages([{
      id: msgId(),
      role: "ai",
      content: "Hi again 💙 I'm **Aura**. Let's start fresh. How are you feeling right now?",
      ts: timeStr(),
    }]);
    setMood(null);
    setInput("");
    setError(null);
  }

  // Render text with basic **bold** markdown support
  function renderContent(text: string) {
    return text.split("\n").map((line, i) => {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <p key={i} className={i > 0 ? "mt-2" : ""}>
          {parts.map((part, j) =>
            j % 2 === 1 ? <strong key={j}>{part}</strong> : part
          )}
        </p>
      );
    });
  }

  const containerClass = floating
    ? "fixed bottom-6 right-6 z-50 w-[380px] flex flex-col"
    : "w-full flex flex-col";

  const heightClass = minimized ? "h-16" : floating ? "h-[600px]" : "h-[560px]";

  return (
    <div
      className={`${containerClass} ${heightClass} bg-[#0f1117] border border-rose-500/20 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300`}
      style={{ boxShadow: floating ? "0 0 48px rgba(244,63,94,0.12)" : undefined }}
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/8 bg-gradient-to-r from-rose-950/40 to-pink-950/30 flex-shrink-0">
        <div className="w-9 h-9 rounded-xl bg-rose-500/15 border border-rose-500/25 flex items-center justify-center flex-shrink-0">
          <Heart size={16} className="text-rose-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold text-white leading-tight">Aura — Wellness Assistant</div>
          <div className="flex items-center gap-1.5 text-xs text-rose-300/80 mt-0.5">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            {GEMINI_API_KEY ? "Powered by Gemini AI · Confidential" : "Wellness Support · Confidential"}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={resetChat} title="New conversation"
            className="p-1.5 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/8 transition-all">
            <RefreshCw size={13} />
          </button>
          {floating && (
            <button onClick={() => setMinimized(m => !m)} title={minimized ? "Expand" : "Minimize"}
              className="p-1.5 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/8 transition-all">
              {minimized ? <Maximize2 size={13} /> : <Minimize2 size={13} />}
            </button>
          )}
          <button onClick={onClose} title="Close"
            className="p-1.5 rounded-lg text-white/40 hover:text-rose-400 hover:bg-white/8 transition-all">
            <X size={13} />
          </button>
        </div>
      </div>

      {minimized ? null : (
        <>
          {/* ── Messages ───────────────────────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
            {messages.map(m => (
              <div key={m.id} className={`flex gap-2.5 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                {m.role === "ai" && (
                  <div className="w-7 h-7 rounded-full bg-rose-500/15 border border-rose-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot size={13} className="text-rose-400" />
                  </div>
                )}
                <div className={`max-w-[82%] space-y-0.5`}>
                  <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    m.role === "ai"
                      ? "bg-white/6 text-white/90 rounded-tl-sm"
                      : "bg-rose-600/80 text-white rounded-tr-sm"
                  }`}>
                    {renderContent(m.content)}
                  </div>
                  <div className={`text-[10px] text-white/25 px-1 ${m.role === "user" ? "text-right" : ""}`}>{m.ts}</div>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex gap-2.5">
                <div className="w-7 h-7 rounded-full bg-rose-500/15 border border-rose-500/20 flex items-center justify-center flex-shrink-0">
                  <Bot size={13} className="text-rose-400" />
                </div>
                <div className="bg-white/6 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="w-1.5 h-1.5 bg-rose-400/60 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            )}

            <div ref={endRef} />
          </div>

          {/* ── Error banner ───────────────────────────────────────────────── */}
          {error && (
            <div className="mx-4 mb-2 px-3 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-400 flex items-center gap-2">
              <Sparkles size={11} />
              {error}
            </div>
          )}

          {/* ── Mood check-in (shown once at start) ────────────────────────── */}
          {messages.length === 1 && !loading && (
            <div className="px-4 pb-3 flex-shrink-0">
              <p className="text-xs text-white/40 mb-2 font-medium">How are you feeling?</p>
              <div className="flex gap-1.5 flex-wrap">
                {MOOD_OPTIONS.map(o => (
                  <button key={o.value}
                    onClick={() => handleMoodSelect(o.value)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${o.color}`}>
                    <span>{o.emoji}</span>
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Quick prompts (shown after mood or on second message) ───────── */}
          {messages.length >= 1 && messages.length <= 2 && mood && !loading && (
            <div className="px-4 pb-3 flex-shrink-0">
              <p className="text-xs text-white/40 mb-2 font-medium">Quick topics</p>
              <div className="grid grid-cols-2 gap-1.5">
                {QUICK_PROMPTS.map(q => {
                  const QIcon = q.icon;
                  return (
                    <button key={q.label} onClick={() => send(q.text)}
                      className="flex items-center gap-2 px-3 py-2 bg-white/4 hover:bg-white/8 border border-white/8 rounded-xl text-xs text-white/60 hover:text-white/90 transition-all text-left">
                      <QIcon size={12} className="text-rose-400 flex-shrink-0" />
                      {q.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Crisis resources ────────────────────────────────────────────── */}
          <div className="px-4 pb-2 flex-shrink-0">
            <div className="flex items-center gap-2 px-3 py-2 bg-rose-950/30 border border-rose-500/15 rounded-xl">
              <Phone size={11} className="text-rose-400 flex-shrink-0" />
              <span className="text-[10px] text-white/40">Crisis support: <strong className="text-rose-400">988</strong> · Text HOME to <strong className="text-rose-400">741741</strong></span>
            </div>
          </div>

          {/* ── Input ──────────────────────────────────────────────────────── */}
          <div className="px-4 pb-4 flex-shrink-0">
            <div className="flex items-center gap-2 bg-white/6 border border-white/10 rounded-xl px-3.5 py-2.5 focus-within:border-rose-500/40 transition-all">
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
                placeholder="Share how you're feeling…"
                disabled={loading}
                className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 focus:outline-none disabled:opacity-50"
              />
              <button
                onClick={() => send()}
                disabled={!input.trim() || loading}
                className="p-1.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-all flex-shrink-0"
              >
                <Send size={13} className="text-white" />
              </button>
            </div>
            <p className="text-[10px] text-white/20 mt-1.5 text-center">
              Conversations are private and confidential
            </p>
          </div>
        </>
      )}
    </div>
  );
}
