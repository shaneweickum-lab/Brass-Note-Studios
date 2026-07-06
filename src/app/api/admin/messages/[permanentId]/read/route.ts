export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth, UNAUTHORIZED } from "@/lib/adminAuth";
import { kvGetClient, markMessagesRead } from "@/lib/supabase/queries";

interface RouteContext {
  params: Promise<{ permanentId: string }>;
}

export async function POST(req: NextRequest, context: RouteContext): Promise<Response> {
  if (!checkAdminAuth(req)) return UNAUTHORIZED;

  try {
    const { permanentId } = await context.params;

    const client = await kvGetClient(permanentId);
    if (!client) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Admin is reading — mark client messages as read
    await markMessagesRead(permanentId, "admin");
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[POST /api/admin/messages/[permanentId]/read]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
