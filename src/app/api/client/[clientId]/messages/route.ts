export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rateLimit";
import { kvGetClient, getMessages, createMessage } from "@/lib/supabase/queries";
import { createServiceClient } from "@/lib/supabase/server";
import { sendAdminPushNotifications } from "@/lib/webpush";

interface RouteContext {
  params: Promise<{ clientId: string }>; // clientId = permanentId
}

const CLIENT_MESSAGE_LIMIT = 2000;
const MESSAGES_PER_HOUR = 10;

function sanitize(body: string): string {
  return body.replace(/<[^>]*>/g, "").trim();
}

async function checkMessageRateLimit(permanentId: string): Promise<boolean> {
  const db = createServiceClient();
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count } = await db
    .from("messages")
    .select("*", { count: "exact", head: true })
    .eq("permanent_id", permanentId)
    .eq("sender", "client")
    .gte("created_at", oneHourAgo);
  return (count ?? 0) < MESSAGES_PER_HOUR;
}

export async function GET(req: NextRequest, context: RouteContext): Promise<Response> {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const { clientId: permanentId } = await context.params;

    const client = await kvGetClient(permanentId);
    if (!client) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const messages = await getMessages(permanentId);
    // Never expose is_read or admin-only fields — return minimal safe shape
    const safeMessages = messages.map((m) => ({
      id: m.id,
      sender: m.sender,
      body: m.body,
      createdAt: m.createdAt,
    }));

    return NextResponse.json(safeMessages);
  } catch (err) {
    console.error("[GET /api/client/[clientId]/messages]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, context: RouteContext): Promise<Response> {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const { clientId: permanentId } = await context.params;

    const client = await kvGetClient(permanentId);
    if (!client) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const withinLimit = await checkMessageRateLimit(permanentId);
    if (!withinLimit) {
      return NextResponse.json(
        { error: "Message limit reached. You can send up to 10 messages per hour." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const raw = typeof body?.message === "string" ? body.message : "";
    const clean = sanitize(raw);

    if (!clean) {
      return NextResponse.json({ error: "Message cannot be empty." }, { status: 400 });
    }
    if (clean.length > CLIENT_MESSAGE_LIMIT) {
      return NextResponse.json(
        { error: `Message must be ${CLIENT_MESSAGE_LIMIT} characters or fewer.` },
        { status: 400 }
      );
    }

    const message = await createMessage(permanentId, "client", clean);

    // Fire-and-forget push notification to admin device(s) — result is intentionally discarded
    void sendAdminPushNotifications({
      title: "New message — Brass Note Studios",
      body: `${client.clientName}: ${clean.slice(0, 100)}${clean.length > 100 ? "…" : ""}`,
      url: "/admin/portal/messages",
    });

    return NextResponse.json(
      { id: message.id, sender: message.sender, body: message.body, createdAt: message.createdAt },
      { status: 201 }
    );
  } catch (err) {
    console.error("[POST /api/client/[clientId]/messages]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
