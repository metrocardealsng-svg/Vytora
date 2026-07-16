"use client";

import { useState, useRef, useEffect } from "react";

type Message = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "What should I eat after a 5km run?",
  "Give me a 7-day Nigerian meal plan to lose weight",
  "Best military calisthenics for beginners",
  "How to run faster in Lagos heat?",
];

export default function VytoChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hey! I'm Vyto, your Vytora fitness assistant. Ask me anything about workouts, Nigerian meal plans, military calisthenics, running tips... I got you!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  async function send(text?: string) {
    const content = text || input.trim();
    if (!content || loading) return;
    setInput("");

    const newMessages: Message[] = [...messages, { role: "user", content }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply || "Sorry, try again." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Network error. Try again." },
      ]);
    }
    setLoading(false);
  }

  return (
    <>
      {/* Floating button - uses inline SVG, no image dependency */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg shadow-mint/30 transition-transform hover:scale-105 active:scale-95"
        style={{ background: "linear-gradient(135deg, #34e0a1, #2dd4bf)" }}
        aria-label="Open Vyto AI"
      >
        {open ? (
          <svg viewBox="0 0 24 24" className="h-6 w-6 text-ink" fill="none" stroke="#06080c" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="#06080c" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12h4l2 6 4-14 2 8h6" />
          </svg>
        )}
        {!open && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-400 text-[8px] font-black text-ink">
            AI
          </span>
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-4 z-50 flex w-[340px] max-w-[calc(100vw-2rem)] flex-col rounded-3xl bg-[#0e1118] shadow-2xl ring-1 ring-white/10"
          style={{ height: "480px" }}>
          {/* Header */}
          <div className="flex items-center gap-3 rounded-t-3xl border-b border-white/5 bg-gradient-to-r from-mint/10 to-teal/5 px-4 py-3">
            <div className="h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, #34e0a1, #2dd4bf)" }}>
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="#06080c" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12h4l2 6 4-14 2 8h6" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-black text-white">Vyto</p>
              <p className="text-[10px] text-slate-400">Vytora AI Fitness Assistant</p>
            </div>
            <span className="ml-auto flex items-center gap-1 text-[10px] text-green-400">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
              Online
            </span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} gap-2`}>
                {m.role === "assistant" && (
                  <div className="h-6 w-6 rounded-full flex-shrink-0 self-end mb-1 flex items-center justify-center" style={{ background: "linear-gradient(135deg, #34e0a1, #2dd4bf)" }}>
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="#06080c" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M3 12h4l2 6 4-14 2 8h6" />
                    </svg>
                  </div>
                )}
                <div className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-mint text-ink font-medium rounded-br-sm"
                    : "bg-white/8 text-slate-200 rounded-bl-sm"
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start gap-2">
                <div className="h-6 w-6 rounded-full flex-shrink-0 self-end mb-1 flex items-center justify-center" style={{ background: "linear-gradient(135deg, #34e0a1, #2dd4bf)" }}>
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="#06080c" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M3 12h4l2 6 4-14 2 8h6" />
                  </svg>
                </div>
                <div className="rounded-2xl rounded-bl-sm bg-white/8 px-4 py-3">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="h-1.5 w-1.5 rounded-full bg-slate-400"
                        style={{ animation: `bounce 1s ${i * 0.15}s infinite` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions */}
          {messages.length === 1 && (
            <div className="px-3 pb-2 flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => send(s)}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300 hover:bg-mint/15 hover:text-mint transition-colors">
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="flex gap-2 border-t border-white/5 p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
              placeholder="Ask Vyto anything..."
              className="flex-1 rounded-xl bg-white/5 px-3 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:ring-1 focus:ring-mint"
            />
            <button onClick={() => send()} disabled={!input.trim() || loading}
              className="rounded-xl bg-mint px-3 py-2.5 text-sm font-black text-ink disabled:opacity-40">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </>
  );
}
