// BNS Admin PWA — minimal service worker
// Satisfies the PWA installability requirement (fetch handler required).
// Admin portal is always online-only; no caching strategy needed.

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", (e) => e.respondWith(fetch(e.request)));
