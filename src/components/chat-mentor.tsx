"use client";

import { useLocale } from "@/contexts/locale-context";
import { landingCopy } from "@/lib/landing-copy";
import type { ChatCitation } from "@/lib/chat-types";
import { useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; content: string; citations?: ChatCitation[] };

export function ChatMentor() {
  const { locale } = useLocale();
  const p = landingCopy[locale].pages.chat;
  const c = landingCopy[locale].chatUi;
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setError(null);
    setInput("");
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.map(({ role, content }) => ({ role, content })),
        }),
      });
      const data = (await res.json()) as {
        reply?: string;
        citations?: ChatCitation[];
        error?: string;
        hint?: string;
      };
      if (!res.ok) {
        setError(data.hint ? `${data.error ?? c.errorGeneric}\n\n${data.hint}` : (data.error ?? c.errorGeneric));
        setMessages((m) => m.slice(0, -1));
        return;
      }
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: data.reply ?? "",
          citations: data.citations,
        },
      ]);
    } catch {
      setError(c.errorGeneric);
      setMessages((m) => m.slice(0, -1));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-8 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-300">
        UPSCMENTOR
      </p>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
        {p.title}
      </h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{p.description}</p>

      <div className="glass-card mt-6 flex min-h-[min(70vh,520px)] flex-1 flex-col overflow-hidden rounded-2xl">
        <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-5">
          {messages.length === 0 && !loading ? (
            <div className="flex h-full min-h-[200px] flex-col items-center justify-center text-center">
              <p className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">{c.emptyTitle}</p>
              <p className="mt-2 max-w-md text-sm text-zinc-500">{c.emptyBody}</p>
            </div>
          ) : null}
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-relaxed sm:max-w-[85%] ${
                  m.role === "user"
                    ? "bg-gradient-to-br from-indigo-600 to-violet-600 text-white"
                    : "border border-white/10 bg-white/5 text-zinc-800 dark:text-zinc-100"
                }`}
              >
                <p className="whitespace-pre-wrap">{m.content}</p>
                {m.role === "assistant" && m.citations && m.citations.length > 0 ? (
                  <div className="mt-3 border-t border-white/10 pt-3 dark:border-white/10">
                    <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{c.citations}</p>
                    <ul className="mt-2 space-y-1.5">
                      {m.citations.map((cite, j) => (
                        <li key={j}>
                          <a
                            href={cite.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-indigo-600 underline-offset-2 hover:underline dark:text-indigo-300"
                          >
                            {cite.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </div>
          ))}
          {loading ? (
            <div className="flex justify-start">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-500">
                {c.thinking}
              </div>
            </div>
          ) : null}
          <div ref={bottomRef} />
        </div>

        {error ? (
          <div className="border-t border-red-500/20 bg-red-500/5 px-4 py-2 text-sm text-red-700 dark:text-red-300">
            {error}
          </div>
        ) : null}

        <div className="border-t border-white/10 p-3 sm:p-4">
          <div className="flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send();
                }
              }}
              rows={2}
              placeholder={c.placeholder}
              className="min-h-[44px] flex-1 resize-none rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-zinc-900 outline-none ring-indigo-500/20 focus:ring-2 dark:text-white"
            />
            <button
              type="button"
              disabled={loading || !input.trim()}
              onClick={() => void send()}
              className="shrink-0 self-end rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {c.send}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
