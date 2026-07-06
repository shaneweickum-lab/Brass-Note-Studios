import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/adminAuth";
import { createServiceClient } from "@/lib/supabase/server";
import { sendAdminPushNotifications } from "@/lib/webpush";

export async function POST(req: NextRequest) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check whether the table and subscriptions exist
  const db = createServiceClient();
  const { data: subs, error } = await db
    .from("push_subscriptions")
    .select("endpoint")
    .limit(10);

  if (error) {
    return NextResponse.json(
      {
        ok: false,
        error: "push_subscriptions table not found — run the Supabase migration",
        detail: error.message,
      },
      { status: 500 }
    );
  }

  if (!subs?.length) {
    return NextResponse.json(
      { ok: false, error: "No subscriptions saved. Enable notifications in the Messages page first." },
      { status: 400 }
    );
  }

  await sendAdminPushNotifications({
    title: "Test — Brass Note Studios",
    body: "Push notifications are working correctly.",
    url: "/admin/portal/messages",
  });

  return NextResponse.json({ ok: true, subscriptions: subs.length });
}
