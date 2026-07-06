export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth, UNAUTHORIZED } from "@/lib/adminAuth";
import { createServiceClient } from "@/lib/supabase/server";
import type { DbMessage, DbClient } from "@/lib/supabase/types";

export interface MessageThreadSummary {
  permanentId: string;
  clientName: string;
  lastMessage: string;
  lastMessageAt: string;
  lastSender: "client" | "admin";
  unreadCount: number;
}

export async function GET(req: NextRequest): Promise<Response> {
  if (!checkAdminAuth(req)) return UNAUTHORIZED;

  try {
    const db = createServiceClient();

    // Fetch all messages and all clients in parallel
    const [{ data: messages }, { data: clients }] = await Promise.all([
      db.from("messages").select("*").order("created_at", { ascending: true }),
      db.from("clients").select("permanent_id, client_name"),
    ]);

    if (!messages || !clients) {
      return NextResponse.json([]);
    }

    const clientMap = new Map<string, string>(
      (clients as Pick<DbClient, "permanent_id" | "client_name">[]).map((c) => [
        c.permanent_id,
        c.client_name,
      ])
    );

    // Group messages by permanentId
    const threads = new Map<string, MessageThreadSummary>();
    for (const msg of messages as DbMessage[]) {
      const existing = threads.get(msg.permanent_id);
      const unreadDelta = !msg.is_read && msg.sender === "client" ? 1 : 0;
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
        // Messages are sorted asc so each iteration is newer
        existing.lastMessage = msg.body;
        existing.lastMessageAt = msg.created_at;
        existing.lastSender = msg.sender;
        existing.unreadCount += unreadDelta;
      }
    }

    // Sort threads by last message time descending
    const sorted = Array.from(threads.values()).sort(
      (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
    );

    return NextResponse.json(sorted);
  } catch (err) {
    console.error("[GET /api/admin/messages]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
