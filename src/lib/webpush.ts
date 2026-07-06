import webpush from "web-push";
import { createServiceClient } from "@/lib/supabase/server";

let vapidReady = false;

function ensureVapid(): boolean {
  if (vapidReady) return true;
  const pub = process.env.VAPID_PUBLIC_KEY;
  const priv = process.env.VAPID_PRIVATE_KEY;
  const sub = process.env.VAPID_SUBJECT ?? "mailto:admin@brassnote.studio";
  if (!pub || !priv) return false;
  try {
    webpush.setVapidDetails(sub, pub, priv);
    vapidReady = true;
    return true;
  } catch {
    return false;
  }
}

export async function sendAdminPushNotifications(payload: {
  title: string;
  body: string;
  url?: string;
}): Promise<void> {
  if (!ensureVapid()) return;

  const db = createServiceClient();
  const { data: subs } = await db
    .from("push_subscriptions")
    .select("endpoint, p256dh, auth");

  if (!subs?.length) return;

  const json = JSON.stringify({
    title: payload.title,
    body: payload.body,
    url: payload.url ?? "/admin/portal",
  });

  const expired: string[] = [];

  await Promise.allSettled(
    subs.map(async (sub) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          json
        );
      } catch (err: unknown) {
        const status = (err as { statusCode?: number }).statusCode;
        if (status === 404 || status === 410) expired.push(sub.endpoint);
      }
    })
  );

  if (expired.length) {
    await db.from("push_subscriptions").delete().in("endpoint", expired);
  }
}
