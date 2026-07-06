"use client";

import { useState, useEffect } from "react";
import { Bell, BellOff, BellRing } from "lucide-react";

function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(b64);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) {
    arr[i] = raw.charCodeAt(i);
  }
  return arr;
}

type Status =
  | "loading"
  | "unsupported"   // browser has no Push/Notification API
  | "ios-browser"   // iOS but not installed as PWA
  | "denied"        // user blocked notifications in OS Settings
  | "idle"          // supported, not subscribed
  | "subscribed"
  | "error";

export default function PushNotificationToggle() {
  const [status, setStatus] = useState<Status>("loading");
  const [endpoint, setEndpoint] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    async function detect() {
      // Basic API support check
      if (
        typeof window === "undefined" ||
        !("serviceWorker" in navigator) ||
        !("PushManager" in window) ||
        !("Notification" in window)
      ) {
        // iOS Safari in regular browser mode: suggest adding to Home Screen
        const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
        setStatus(isIOS ? "ios-browser" : "unsupported");
        return;
      }

      // iOS: push only works when installed as PWA on the Home Screen
      const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (navigator as Navigator & { standalone?: boolean }).standalone === true;
      if (isIOS && !isStandalone) {
        setStatus("ios-browser");
        return;
      }

      if (Notification.permission === "denied") {
        setStatus("denied");
        return;
      }

      try {
        const reg = await navigator.serviceWorker.getRegistration("/");
        const sub = reg ? await reg.pushManager.getSubscription() : null;
        if (sub) {
          setEndpoint(sub.endpoint);
          setStatus("subscribed");
        } else {
          setStatus("idle");
        }
      } catch {
        setStatus("idle");
      }
    }

    detect();
  }, []);

  async function subscribe() {
    setBusy(true);
    try {
      const keyRes = await fetch("/api/admin/push/vapid-public-key");
      if (!keyRes.ok) throw new Error("Push not configured on server.");
      const { publicKey } = (await keyRes.json()) as { publicKey: string };

      const permission = await Notification.requestPermission();
      if (permission === "denied") { setStatus("denied"); return; }
      if (permission !== "granted") return; // dismissed — stay idle

      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey) as unknown as BufferSource,
      });

      const subJson = sub.toJSON() as {
        endpoint: string;
        keys: { p256dh: string; auth: string };
      };

      await fetch("/api/admin/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subJson),
      });

      setEndpoint(sub.endpoint);
      setStatus("subscribed");
    } catch (err) {
      console.error("[push subscribe]", err);
      setStatus("error");
    } finally {
      setBusy(false);
    }
  }

  async function unsubscribe() {
    setBusy(true);
    try {
      const reg = await navigator.serviceWorker.getRegistration("/");
      if (reg) {
        const sub = await reg.pushManager.getSubscription();
        if (sub) await sub.unsubscribe();
      }
      if (endpoint) {
        await fetch("/api/admin/push/unsubscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint }),
        });
      }
      setEndpoint(null);
      setStatus("idle");
    } catch {
      setStatus("error");
    } finally {
      setBusy(false);
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  if (status === "loading") return null;

  if (status === "unsupported") return null;

  if (status === "ios-browser") {
    return (
      <div className="flex items-start gap-3 bg-gold/5 border border-gold/20 rounded-lg px-4 py-3">
        <Bell className="w-4 h-4 text-gold shrink-0 mt-0.5" />
        <div>
          <p className="font-body text-sm text-text-base font-medium">
            Enable push notifications
          </p>
          <p className="font-body text-xs text-text-subtle mt-0.5">
            Add BNSignal to your Home Screen, then reopen to enable message alerts.
          </p>
        </div>
      </div>
    );
  }

  if (status === "denied") {
    return (
      <div className="flex items-start gap-3 bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3">
        <BellOff className="w-4 h-4 text-text-subtle shrink-0 mt-0.5" />
        <div>
          <p className="font-body text-sm text-text-muted">Notifications blocked</p>
          <p className="font-body text-xs text-text-subtle mt-0.5">
            Go to Settings → Notifications → BNSignal to allow.
          </p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex items-center gap-3 bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3">
        <BellOff className="w-4 h-4 text-red-400 shrink-0" />
        <p className="font-body text-xs text-red-400 flex-1">
          Something went wrong setting up notifications.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="font-body text-xs text-text-subtle hover:text-text-muted transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (status === "subscribed") {
    return (
      <div className="flex items-center gap-3 bg-gold/5 border border-gold/20 rounded-lg px-4 py-3">
        <BellRing className="w-4 h-4 text-gold shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-body text-sm text-text-base font-medium">
            Notifications active
          </p>
          <p className="font-body text-xs text-text-subtle mt-0.5">
            You&rsquo;ll be alerted when a client sends a message.
          </p>
        </div>
        <button
          onClick={unsubscribe}
          disabled={busy}
          className="shrink-0 font-body text-xs text-text-subtle hover:text-red-400 transition-colors disabled:opacity-40"
        >
          {busy ? "…" : "Turn off"}
        </button>
      </div>
    );
  }

  // idle
  return (
    <div className="flex items-center gap-3 bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3">
      <Bell className="w-4 h-4 text-text-subtle shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="font-body text-sm text-text-muted">Push notifications off</p>
        <p className="font-body text-xs text-text-subtle mt-0.5">
          Get alerted on this device when clients message you.
        </p>
      </div>
      <button
        onClick={subscribe}
        disabled={busy}
        className="
          shrink-0 px-3 py-1.5
          border border-gold/40 text-gold
          font-body text-xs rounded
          hover:bg-gold/10 transition-colors
          disabled:opacity-40 disabled:cursor-not-allowed
        "
      >
        {busy ? "…" : "Enable"}
      </button>
    </div>
  );
}
