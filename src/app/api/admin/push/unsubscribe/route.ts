import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/adminAuth";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  if (!checkAdminAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { endpoint?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { endpoint } = body;
  if (!endpoint) {
    return NextResponse.json({ error: "Missing endpoint" }, { status: 400 });
  }

  const db = createServiceClient();
  await db.from("push_subscriptions").delete().eq("endpoint", endpoint);

  return NextResponse.json({ ok: true });
}
