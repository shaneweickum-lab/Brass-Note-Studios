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
  clientName: string;
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

export default function AdminMessageThread({
  permanentId,
  clientName,
  initialMessages,
}: Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Real-time subscription
  useEffect(() => {
    const channel = supabaseBrowser
      .channel(`messages:admin:${permanentId}`)
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

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    setSending(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/messages/${permanentId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Failed to send.");
        return;
      }

      setInput("");
    } catch {
      setError("Unable to send. Check your connection.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="bg-surface border border-white/10 rounded-lg overflow-hidden">
      <div className="px-5 py-4 border-b border-white/10">
        <p className="font-body text-xs text-text-subtle uppercase tracking-[0.1em]">
          Thread with
        </p>
        <p className="font-display text-text-base text-lg">{clientName}</p>
        <p className="font-mono text-xs text-text-subtle">{permanentId}</p>
      </div>

      {/* Messages */}
      <div className="px-5 py-4 space-y-3 min-h-48 max-h-[32rem] overflow-y-auto">
        {messages.length === 0 ? (
          <p className="font-body text-text-subtle text-sm text-center py-8">
            No messages yet.
          </p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "admin" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`
                  max-w-[80%] rounded px-4 py-2.5 space-y-1
                  ${msg.sender === "admin"
                    ? "bg-gold/15 border border-gold/25"
                    : "bg-white/5 border border-white/10"
                  }
                `}
              >
                <p className="font-body text-xs text-text-subtle mb-1">
                  {msg.sender === "admin" ? "You" : clientName}
                </p>
                <p className="font-body text-sm text-text-base leading-relaxed whitespace-pre-wrap">
                  {msg.body}
                </p>
                <p className="font-body text-[10px] text-text-subtle text-right">
                  {formatTime(msg.createdAt)}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Reply */}
      <form onSubmit={handleSubmit} className="border-t border-white/10 px-5 py-4 space-y-2">
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
            placeholder="Reply… (Enter to send)"
            rows={3}
            maxLength={4000}
            disabled={sending}
            className="
              flex-1 resize-none px-3 py-2
              bg-background border border-white/10
              font-body text-sm text-text-base placeholder:text-text-subtle
              rounded transition-colors
              focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/30
              disabled:opacity-50
            "
          />
          <button
            type="submit"
            disabled={sending || !input.trim()}
            className="
              shrink-0 px-5 py-2
              bg-gold text-background
              font-body text-sm font-semibold
              rounded transition-all
              hover:bg-gold-light
              disabled:opacity-40 disabled:cursor-not-allowed
            "
          >
            {sending ? "…" : "Send"}
          </button>
        </div>
        <p className="font-body text-[10px] text-text-subtle text-right">
          {input.length}/4000
        </p>
      </form>
    </div>
  );
}
