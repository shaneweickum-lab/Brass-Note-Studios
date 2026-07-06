import webpush from "web-push";
import { createServiceClient } from "@/lib/supabase/server";

let vapidReady = false;
let vapidError: string | null = null;

function ensureVapid(): boolean {
  if (vapidReady) return true;
  const pub = process.env.VAPID_PUBLIC_KEY;
  const priv = process.env.VAPID_PRIVATE_KEY;
  const sub = process.env.VAPID_SUBJECT ?? "mailto:admin@brassnote.studio";
  if (!pub || !priv) {
    vapidError = "VAPID_PUBLIC_KEY or VAPID_PRIVATE_KEY not set in environment";
    console.warn("[webpush]", vapidError);
    return false;
  }
  try {
    webpush.setVapidDetails(sub, pub, priv);
    vapidReady = true;
    vapidError = null;
    return true;
  } catch (err) {
    vapidError = `Invalid VAPID keys: ${(err as Error).message ?? err}`;
    console.error("[webpush]", vapidError);
    return false;
  }
}

export type PushResult = {
  vapidConfigured: boolean;
  vapidError: string | null;
  sent: number;
  failed: number;
  expired: number;
  errors: string[];
};

export async function sendAdminPushNotifications(payload: {
  title: string;
  body: string;
  url?: string;
}): Promise<PushResult> {
  if (!ensureVapid()) {
    return { vapidConfigured: false, vapidError, sent: 0, failed: 0, expired: 0, errors: [] };
  }

  const db = createServiceClient();
  const { data: subs, error: queryErr } = await db
    .from("push_subscriptions")
    .select("endpoint, p256dh, auth");

  if (queryErr) {
    const msg = `DB error querying push_subscriptions: ${queryErr.message}`;
    console.error("[webpush]", msg);
    return { vapidConfigured: true, vapidError: null, sent: 0, failed: 0, expired: 0, errors: [msg] };
  }
  if (!subs?.length) {
    return { vapidConfigured: true, vapidError: null, sent: 0, failed: 0, expired: 0, errors: [] };
  }

  const json = JSON.stringify({
    title: payload.title,
    body: payload.body,
    url: payload.url ?? "/admin/portal",
  });

  const expiredEndpoints: string[] = [];
  let sent = 0;
  let failed = 0;
  const errors: string[] = [];

  await Promise.allSettled(
    subs.map(async (sub) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          json
        );
        sent++;
      } catch (err: unknown) {
        const status = (err as { statusCode?: number }).statusCode;
        if (status === 404 || status === 410) {
          expiredEndpoints.push(sub.endpoint);
        } else {
          failed++;
          const msg = `Push failed (HTTP ${status ?? "?"}) for ${sub.endpoint.slice(0, 60)}…: ${(err as Error).message ?? err}`;
          errors.push(msg);
          console.error("[webpush]", msg);
        }
      }
    })
  );

  if (expiredEndpoints.length) {
    await db.from("push_subscriptions").delete().in("endpoint", expiredEndpoints);
  }

  return {
    vapidConfigured: true,
    vapidError: null,
    sent,
    failed,
    expired: expiredEndpoints.length,
    errors,
  };
}
