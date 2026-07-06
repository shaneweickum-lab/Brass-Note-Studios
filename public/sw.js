// BNS Admin PWA — service worker
// NOTE: Do NOT call e.respondWith() in the fetch handler — that would
// intercept Supabase Realtime WebSocket upgrades (wss://) and cause errors.

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", () => {
  // Satisfies PWA installability. No caching — all requests hit the network.
});

// ── Push notifications ────────────────────────────────────────────────────

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { body: event.data ? event.data.text() : "" };
  }

  const title = data.title ?? "Brass Note Studios";
  const options = {
    body: data.body ?? "You have a new client message.",
    data: { url: data.url ?? "/admin/portal" },
    tag: "bns-client-message",
    renotify: true,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url ?? "/admin/portal";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if ("focus" in client) return client.focus();
        }
        if (clients.openWindow) return clients.openWindow(url);
      })
  );
});
