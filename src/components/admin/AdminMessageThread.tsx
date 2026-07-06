"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import type { RealtimePostgresInsertPayload, RealtimeChannel } from "@supabase/supabase-js";
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
  onSend: (text: string) => Promise<{ id: string; sender: "admin"; body: string; createdAt: string }>;
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
  onSend,
}: Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [realtimeStatus, setRealtimeStatus] = useState<"connecting" | "live" | "error">("connecting");
  const containerRef = useRef<HTMLDivElement>(null);

  // Real-time subscription
  useEffect(() => {
    let channel: RealtimeChannel;

    channel = supabaseBrowser
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
      .subscribe((status) => {
        if (status === "SUBSCRIBED") setRealtimeStatus("live");
        else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED") setRealtimeStatus("error");
      });

    return () => { supabaseBrowser.removeChannel(channel); };
  }, [permanentId]);

  // Scroll message container to bottom when new messages arrive
  useEffect(() => {
    const el = containerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || isPending) return;

    setError(null);
    startTransition(async () => {
      try {
        const newMsg = await onSend(text);
        // Add own message to state immediately — don't wait for real-time
        setMessages((prev) =>
          prev.some((m) => m.id === newMsg.id)
            ? prev
            : [...prev, { id: newMsg.id, sender: newMsg.sender, body: newMsg.body, createdAt: newMsg.createdAt }]
        );
        setInput("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to send.");
      }
    });
  }

  return (
    <div className="bg-surface border border-white/10 rounded-lg overflow-hidden">
      <div className="px-5 py-4 border-b border-white/10 flex items-start justify-between gap-3">
        <div>
          <p className="font-body text-xs text-text-subtle uppercase tracking-[0.1em]">
            Thread with
          </p>
          <p className="font-display text-text-base text-lg">{clientName}</p>
          <p className="font-mono text-xs text-text-subtle">{permanentId}</p>
        </div>
        <div className="shrink-0 flex items-center gap-1.5 mt-1">
          <span className={`w-1.5 h-1.5 rounded-full ${
            realtimeStatus === "live" ? "bg-emerald-400" :
            realtimeStatus === "error" ? "bg-red-400" :
            "bg-text-subtle animate-pulse"
          }`} />
          <span className={`font-body text-[10px] ${
            realtimeStatus === "live" ? "text-emerald-400" :
            realtimeStatus === "error" ? "text-red-400" :
            "text-text-subtle"
          }`}>
            {realtimeStatus === "live" ? "Live" : realtimeStatus === "error" ? "Disconnected" : "Connecting…"}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div ref={containerRef} className="px-5 py-4 space-y-3 min-h-48 max-h-[32rem] overflow-y-auto">
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
                <p className="font-body text-[10px] text-text-subtle text-right" suppressHydrationWarning>
                  {formatTime(msg.createdAt)}
                </p>
              </div>
            </div>
          ))
        )}
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
            disabled={isPending}
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
            disabled={isPending || !input.trim()}
            className="
              shrink-0 px-5 py-2
              bg-gold text-background
              font-body text-sm font-semibold
              rounded transition-all
              hover:bg-gold-light
              disabled:opacity-40 disabled:cursor-not-allowed
            "
          >
            {isPending ? "…" : "Send"}
          </button>
        </div>
        <p className="font-body text-[10px] text-text-subtle text-right">
          {input.length}/4000
        </p>
      </form>
    </div>
  );
}
