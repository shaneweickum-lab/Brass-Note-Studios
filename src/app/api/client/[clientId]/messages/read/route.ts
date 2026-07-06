export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { kvGetClient, markMessagesRead } from "@/lib/supabase/queries";
import { checkRateLimit } from "@/lib/rateLimit";

interface RouteContext {
  params: Promise<{ clientId: string }>;
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

    // Client is reading — mark admin messages as read
    await markMessagesRead(permanentId, "admin");
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[POST /api/client/[clientId]/messages/read]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
