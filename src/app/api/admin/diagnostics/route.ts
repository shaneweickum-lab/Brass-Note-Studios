import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/adminAuth";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = createServiceClient();
  const checks: Record<string, unknown> = {};

  // ── DB connectivity + message count ───────────────────────────────────────
  try {
    const { count, error } = await db
      .from("messages")
      .select("*", { count: "exact", head: true });
    checks.dbConnected = !error;
    checks.messageCount = error ? null : (count ?? 0);
    if (error) checks.dbError = error.message;
  } catch (e) {
    checks.dbConnected = false;
    checks.dbError = (e as Error).message;
  }

  // ── Push subscriptions table ───────────────────────────────────────────────
  try {
    const { count, error } = await db
      .from("push_subscriptions")
      .select("*", { count: "exact", head: true });
    checks.pushTableExists = !error;
    checks.pushSubscriptionCount = error ? null : (count ?? 0);
    if (error) checks.pushTableError = error.message;
  } catch (e) {
    checks.pushTableExists = false;
    checks.pushTableError = (e as Error).message;
  }

  // ── VAPID keys ─────────────────────────────────────────────────────────────
  const pub = process.env.VAPID_PUBLIC_KEY ?? "";
  const priv = process.env.VAPID_PRIVATE_KEY ?? "";
  checks.vapidPublicKeySet = pub.length > 0;
  checks.vapidPrivateKeySet = priv.length > 0;
  checks.vapidPublicKeyLength = pub.length;   // expected: ~87 chars
  checks.vapidPrivateKeyLength = priv.length; // expected: ~43 chars

  // ── Realtime configuration check (requires migration 004) ─────────────────
  try {
    const { data, error } = await db.rpc("check_realtime_setup" as never);
    if (!error && data) {
      checks.realtimeConfig = data;
    } else if (error) {
      checks.realtimeConfigError = error.message;
      checks.realtimeConfigNote = "Run migration 004 in Supabase SQL Editor to enable this check";
    }
  } catch (e) {
    checks.realtimeConfigError = (e as Error).message;
  }

  return NextResponse.json(checks);
}
