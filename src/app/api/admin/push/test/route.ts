import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/adminAuth";
import { createServiceClient } from "@/lib/supabase/server";
import { sendAdminPushNotifications } from "@/lib/webpush";

export async function POST(req: NextRequest) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = createServiceClient();

  // Verify push_subscriptions table exists and has rows
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

  const result = await sendAdminPushNotifications({
    title: "Test — Brass Note Studios",
    body: "Push notifications are working correctly.",
    url: "/admin/portal/messages",
  });

  if (!result.vapidConfigured) {
    return NextResponse.json(
      {
        ok: false,
        error: result.vapidError ?? "VAPID keys not configured. Add VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY to Vercel env vars.",
      },
      { status: 500 }
    );
  }

  if (result.expired > 0 && result.sent === 0) {
    return NextResponse.json(
      {
        ok: false,
        error: "Your saved subscription has expired. Please turn off notifications and re-enable them.",
        detail: `${result.expired} expired subscription(s) were removed.`,
      },
      { status: 400 }
    );
  }

  if (result.failed > 0 || result.errors.length > 0) {
    return NextResponse.json(
      {
        ok: false,
        error: result.errors[0] ?? `Push failed for ${result.failed} subscription(s).`,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    subscriptions: subs.length,
    sent: result.sent,
  });
}
