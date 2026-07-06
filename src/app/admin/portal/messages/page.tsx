export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { createServiceClient } from "@/lib/supabase/server";
import type { DbMessage, DbClient } from "@/lib/supabase/types";

export const metadata: Metadata = { title: "Messages" };

interface ThreadSummary {
  permanentId: string;
  clientName: string;
  lastMessage: string;
  lastMessageAt: string;
  lastSender: "client" | "admin";
  unreadCount: number;
}

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

async function getThreadSummaries(): Promise<ThreadSummary[]> {
  const db = createServiceClient();

  const [{ data: messages }, { data: clients }] = await Promise.all([
    db.from("messages").select("*").order("created_at", { ascending: true }),
    db.from("clients").select("permanent_id, client_name"),
  ]);

  if (!messages || !clients) return [];

  const clientMap = new Map<string, string>(
    (clients as Pick<DbClient, "permanent_id" | "client_name">[]).map((c) => [
      c.permanent_id,
      c.client_name,
    ])
  );

  const threads = new Map<string, ThreadSummary>();
  for (const msg of messages as DbMessage[]) {
    const unreadDelta = !msg.is_read && msg.sender === "client" ? 1 : 0;
    const existing = threads.get(msg.permanent_id);
    if (!existing) {
      threads.set(msg.permanent_id, {
        permanentId: msg.permanent_id,
        clientName: clientMap.get(msg.permanent_id) ?? msg.permanent_id,
        lastMessage: msg.body,
        lastMessageAt: msg.created_at,
        lastSender: msg.sender,
        unreadCount: unreadDelta,
      });
    } else {
      existing.lastMessage = msg.body;
      existing.lastMessageAt = msg.created_at;
      existing.lastSender = msg.sender;
      existing.unreadCount += unreadDelta;
    }
  }

  return Array.from(threads.values()).sort(
    (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
  );
}

export default async function AdminMessagesPage() {
  const threads = await getThreadSummaries();
  const totalUnread = threads.reduce((sum, t) => sum + t.unreadCount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-text-base">Messages</h1>
        <p className="text-text-muted font-body text-sm mt-1">
          Direct conversations with clients
          {totalUnread > 0 && (
            <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-gold/20 text-gold font-body text-xs font-semibold">
              {totalUnread} unread
            </span>
          )}
        </p>
      </div>

      <div className="bg-surface border border-white/10 rounded-lg overflow-hidden">
        {threads.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <MessageSquare className="w-8 h-8 text-text-subtle mx-auto mb-3" />
            <p className="text-text-muted font-body text-sm">No messages yet.</p>
            <p className="text-text-subtle font-body text-xs mt-1">
              Messages appear here when clients write to you from their portal.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-white/5">
            {threads.map((thread) => (
              <li key={thread.permanentId}>
                <Link
                  href={`/admin/portal/messages/${thread.permanentId}`}
                  className="flex items-start gap-4 px-5 py-4 hover:bg-white/[0.03] transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-body text-sm font-semibold text-text-base truncate">
                        {thread.clientName}
                      </span>
                      {thread.unreadCount > 0 && (
                        <span className="shrink-0 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-gold text-background font-body text-[10px] font-bold">
                          {thread.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="font-mono text-xs text-text-subtle mt-0.5">
                      {thread.permanentId}
                    </p>
                    <p className="font-body text-sm text-text-muted mt-1 truncate">
                      {thread.lastSender === "admin" ? (
                        <span className="text-text-subtle">You: </span>
                      ) : null}
                      {thread.lastMessage}
                    </p>
                  </div>
                  <span className="shrink-0 font-body text-xs text-text-subtle mt-0.5">
                    {formatRelativeTime(thread.lastMessageAt)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
