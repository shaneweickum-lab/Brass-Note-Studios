export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth, UNAUTHORIZED } from "@/lib/adminAuth";
import {
  kvGetClient,
  getMessages,
  createMessage,
  markMessagesRead,
} from "@/lib/supabase/queries";

interface RouteContext {
  params: Promise<{ permanentId: string }>;
}

const ADMIN_MESSAGE_LIMIT = 4000;

function sanitize(body: string): string {
  return body.replace(/<[^>]*>/g, "").trim();
}

export async function GET(req: NextRequest, context: RouteContext): Promise<Response> {
  if (!checkAdminAuth(req)) return UNAUTHORIZED;

  try {
    const { permanentId } = await context.params;

    const client = await kvGetClient(permanentId);
    if (!client) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const messages = await getMessages(permanentId);

    // Mark client messages as read since admin is viewing
    await markMessagesRead(permanentId, "admin");

    return NextResponse.json({ client, messages });
  } catch (err) {
    console.error("[GET /api/admin/messages/[permanentId]]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, context: RouteContext): Promise<Response> {
  if (!checkAdminAuth(req)) return UNAUTHORIZED;

  try {
    const { permanentId } = await context.params;

    const client = await kvGetClient(permanentId);
    if (!client) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const body = await req.json();
    const raw = typeof body?.message === "string" ? body.message : "";
    const clean = sanitize(raw);

    if (!clean) {
      return NextResponse.json({ error: "Message cannot be empty." }, { status: 400 });
    }
    if (clean.length > ADMIN_MESSAGE_LIMIT) {
      return NextResponse.json(
        { error: `Message must be ${ADMIN_MESSAGE_LIMIT} characters or fewer.` },
        { status: 400 }
      );
    }

    const message = await createMessage(permanentId, "admin", clean);
    return NextResponse.json(message, { status: 201 });
  } catch (err) {
    console.error("[POST /api/admin/messages/[permanentId]]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
