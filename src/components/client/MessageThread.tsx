"use client";

import { useState, useEffect, useRef } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import type { RealtimePostgresInsertPayload } from "@supabase/supabase-js";
import type { DbMessage } from "@/lib/supabase/types";

interface Message {
  id: string;
  sender: "client" | "admin";
  body: string;
  createdAt: string;
}

interface Props {
  permanentId: string;
  initialMessages: Message[];
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function MessageThread({ permanentId, initialMessages }: Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mark admin messages as read on mount
  useEffect(() => {
    fetch(`/api/client/${permanentId}/messages/read`, { method: "POST" }).catch(() => {});
  }, [permanentId]);

  // Real-time subscription
  useEffect(() => {
    const channel = supabaseBrowser
      .channel(`messages:client:${permanentId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `permanent_id=eq.${permanentId}`,
        },
        (payload: RealtimePostgresInsertPayload<DbMessage>) => {
          const row = payload.new;
          setMessages((prev) => {
            if (prev.some((m) => m.id === row.id)) return prev;
            return [
              ...prev,
              { id: row.id, sender: row.sender, body: row.body, createdAt: row.created_at },
            ];
          });
        }
      )
      .subscribe();

    return () => { supabaseBrowser.removeChannel(channel); };
  }, [permanentId]);

  // Scroll message container to bottom when new messages arrive
  useEffect(() => {
    const el = containerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    setSending(true);
    setError(null);

    try {
      const res = await fetch(`/api/client/${permanentId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Failed to send. Please try again.");
        return;
      }

      setInput("");
    } catch {
      setError("Unable to send. Please check your connection.");
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="bg-surface border border-white/8 rounded-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-white/8">
        <h3 className="font-display text-text-muted text-sm tracking-widest uppercase">
          Messages
        </h3>
        <p className="font-body text-text-subtle text-xs mt-0.5">
          Send a message to the studio. We typically respond within 24 hours.
        </p>
      </div>

      {/* Message list */}
      <div ref={containerRef} className="px-5 py-4 space-y-3 max-h-80 overflow-y-auto">
        {messages.length === 0 ? (
          <p className="font-body text-text-subtle text-sm text-center py-6">
            No messages yet. Send one below.
          </p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "client" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`
                  max-w-[80%] rounded-sm px-4 py-2.5 space-y-1
                  ${msg.sender === "client"
                    ? "bg-gold/15 border border-gold/25"
                    : "bg-white/5 border border-white/8"
                  }
                `}
              >
                <p className="font-body text-sm text-text-base leading-relaxed whitespace-pre-wrap">
                  {msg.body}
                </p>
                <p className="font-body text-[10px] text-text-subtle text-right" suppressHydrationWarning>
                  {msg.sender === "admin" ? "Studio · " : ""}{formatTime(msg.createdAt)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Compose */}
      <form onSubmit={handleSubmit} className="border-t border-white/8 px-5 py-4 space-y-2">
        {error && (
          <p className="font-body text-xs text-red-400">{error}</p>
        )}
        <div className="flex gap-2 items-end">
          <textarea
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(null); }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(e as unknown as React.FormEvent); }
            }}
            placeholder="Type a message… (Enter to send, Shift+Enter for new line)"
            rows={2}
            maxLength={2000}
            disabled={sending}
            className="
              flex-1 resize-none px-3 py-2
              bg-background border border-white/8
              font-body text-sm text-text-base placeholder:text-text-subtle
              rounded-sm transition-colors duration-200
              focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/30
              disabled:opacity-50
            "
          />
          <button
            type="submit"
            disabled={sending || !input.trim()}
            className="
              shrink-0 px-4 py-2
              bg-gold text-background
              font-body text-sm font-semibold
              rounded-sm transition-all duration-200
              hover:bg-gold-light
              disabled:opacity-40 disabled:cursor-not-allowed
            "
          >
            {sending ? "…" : "Send"}
          </button>
        </div>
        <p className="font-body text-[10px] text-text-subtle text-right">
          {input.length}/2000
        </p>
      </form>
    </section>
  );
}
