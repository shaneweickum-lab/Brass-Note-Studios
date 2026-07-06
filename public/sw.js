// BNS Admin PWA — minimal service worker
// Satisfies the PWA installability requirement (fetch handler required).
// Admin portal is always online-only; no caching strategy needed.
// NOTE: Do NOT call e.respondWith() — that would intercept WebSocket upgrades
// (e.g. Supabase Realtime wss://) and cause fetch errors. Returning without
// calling e.respondWith() lets the browser handle all requests normally.

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", () => {
  // Presence of this listener satisfies PWA installability.
  // No caching, no interception — all requests fall through to the network.
});
