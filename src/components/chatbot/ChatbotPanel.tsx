import { useState, useRef, useEffect } from "react";
import { X, Brain, Zap, Send } from "lucide-react";
import { initialChatMessages, chatResponses } from "@/data";

interface ChatbotPanelProps {
  onClose: () => void;
}

export function ChatbotPanel({ onClose }: ChatbotPanelProps) {
  const [messages, setMessages] = useState(initialChatMessages);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    "Who has the highest fatigue risk today?",
    "Show me ICU staffing gaps",
    "Summarize pending leave requests",
    "Optimize this week's shifts",
  ];

  const send = (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg) return;
    setMessages(m => [...m, { role: "user", content: msg }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const reply =
        chatResponses[msg] ??
        "I've analyzed your query against the current workforce data. For a detailed breakdown, I recommend opening the Analytics or AI Insights dashboard. Is there a specific team or metric you'd like me to focus on?";
      setMessages(m => [...m, { role: "assistant", content: reply }]);
    }, 900);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[560px] bg-card border border-border rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/40 flex flex-col z-50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/20 border border-white/20 flex items-center justify-center">
            <Brain size={17} className="text-white" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">WorkSphere AI</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-xs text-indigo-200">Active · GPT-4 powered</span>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X size={17} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0 mr-2 mt-1">
                <Zap size={12} className="text-white" />
              </div>
            )}
            <div className={`max-w-[82%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
              msg.role === "user"
                ? "bg-primary text-primary-foreground rounded-br-md"
                : "bg-muted/70 text-foreground rounded-bl-md"
            }`}>
              {msg.content}
            </div>
          </div>
        ))}

        {typing && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0">
              <Zap size={12} className="text-white" />
            </div>
            <div className="bg-muted/70 px-4 py-3 rounded-2xl rounded-bl-md flex items-center gap-1.5">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick suggestions — shown only on the first message */}
      {messages.length <= 1 && (
        <div className="px-4 pb-3 flex-shrink-0">
          <p className="text-xs text-muted-foreground mb-2 font-semibold">Quick questions</p>
          <div className="grid grid-cols-2 gap-1.5">
            {suggestions.map(s => (
              <button
                key={s}
                onClick={() => send(s)}
                className="text-xs text-left px-3 py-2.5 bg-muted/50 hover:bg-muted border border-border/40 rounded-xl text-muted-foreground hover:text-foreground transition-colors leading-snug"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-border flex-shrink-0">
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
            placeholder="Ask WorkSphere AI anything…"
            className="flex-1 px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button
            onClick={() => send()}
            disabled={!input.trim()}
            className="p-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all flex-shrink-0 disabled:opacity-40"
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
