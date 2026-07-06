import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/adminAuth";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  if (!checkAdminAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { endpoint?: string; keys?: { p256dh?: string; auth?: string } } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { endpoint, keys } = body;
  if (!endpoint || !keys?.p256dh || !keys?.auth) {
    return NextResponse.json({ error: "Missing endpoint or keys" }, { status: 400 });
  }

  const db = createServiceClient();
  const { error } = await db.from("push_subscriptions").upsert(
    {
      endpoint,
      p256dh: keys.p256dh,
      auth: keys.auth,
      user_agent: req.headers.get("user-agent") ?? null,
    },
    { onConflict: "endpoint" }
  );

  if (error) {
    return NextResponse.json({ error: "Failed to save subscription" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
