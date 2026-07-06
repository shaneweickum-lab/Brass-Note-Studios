// BNS Admin PWA — service worker v2
// NOTE: Do NOT call e.respondWith() in the fetch handler — that would
// intercept Supabase Realtime WebSocket upgrades (wss://) and cause errors.

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", () => {
  // Satisfies PWA installability. No caching — all requests hit the network.
});

// ── Push notifications ────────────────────────────────────────────────────

self.addEventListener("push", (event) => {
  let title = "Brass Note Studios";
  let body = "You have a new client message.";
  let url = "/admin/portal";

  try {
    if (event.data) {
      const d = event.data.json();
      if (d.title) title = d.title;
      if (d.body)  body  = d.body;
      if (d.url)   url   = d.url;
    }
  } catch {
    if (event.data) body = event.data.text() || body;
  }

  // Keep options minimal — tag/renotify can silently suppress on some iOS versions
  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      data: { url },
    })
  );
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
