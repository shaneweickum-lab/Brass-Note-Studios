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
  | "unsupported"
  | "ios-browser"   // iOS Safari, not installed as PWA
  | "no-vapid"      // server VAPID keys not configured
  | "denied"        // OS notification permission denied
  | "idle"
  | "subscribed"
  | "error";

type TestResult = "idle" | "sending" | "ok" | "fail";

export default function PushNotificationToggle() {
  const [status, setStatus] = useState<Status>("loading");
  const [endpoint, setEndpoint] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<TestResult>("idle");
  const [testError, setTestError] = useState<string | null>(null);

  useEffect(() => {
    async function detect() {
      if (
        typeof window === "undefined" ||
        !("serviceWorker" in navigator) ||
        !("PushManager" in window) ||
        !("Notification" in window)
      ) {
        const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
        setStatus(isIOS ? "ios-browser" : "unsupported");
        return;
      }

      // iOS: push only works when installed to Home Screen
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

      // Check server VAPID config
      try {
        const keyRes = await fetch("/api/admin/push/vapid-public-key");
        if (!keyRes.ok) {
          setStatus("no-vapid");
          return;
        }
      } catch {
        setStatus("no-vapid");
        return;
      }

      // Check for existing subscription
      try {
        const reg = await navigator.serviceWorker.getRegistration("/");
        const sub = reg ? await reg.pushManager.getSubscription() : null;
        if (sub) {
          setEndpoint(sub.endpoint);
          setStatus("subscribed");
          return;
        }
      } catch {
        // ignore — fall through to idle
      }

      setStatus("idle");
    }

    detect().catch(() => setStatus("unsupported"));
  }, []);

  async function subscribe() {
    setBusy(true);
    setErrorMsg(null);
    try {
      const keyRes = await fetch("/api/admin/push/vapid-public-key");
      if (!keyRes.ok) {
        throw new Error("VAPID keys not configured on server. Add VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY to Vercel env vars.");
      }
      const { publicKey } = (await keyRes.json()) as { publicKey: string };

      const permission = await Notification.requestPermission();
      if (permission === "denied") { setStatus("denied"); return; }
      if (permission !== "granted") return;

      // Ensure SW is active
      await navigator.serviceWorker.register("/sw.js");
      const reg = await Promise.race([
        navigator.serviceWorker.ready,
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Service worker timed out. Try reloading.")), 8000)
        ),
      ]);

      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey) as unknown as BufferSource,
      });

      const subJson = sub.toJSON() as {
        endpoint: string;
        keys: { p256dh: string; auth: string };
      };

      const saveRes = await fetch("/api/admin/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subJson),
      });
      if (!saveRes.ok) {
        const data = await saveRes.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error ?? `Server error ${saveRes.status} — push_subscriptions table may not exist in Supabase`);
      }

      setEndpoint(sub.endpoint);
      setStatus("subscribed");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[push subscribe]", msg);
      setErrorMsg(msg);
      setStatus("error");
    } finally {
      setBusy(false);
    }
  }

  async function sendTest() {
    setTestResult("sending");
    setTestError(null);
    try {
      const res = await fetch("/api/admin/push/test", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setTestError((data as { error?: string }).error ?? `Error ${res.status}`);
        setTestResult("fail");
      } else {
        setTestResult("ok");
        setTimeout(() => setTestResult("idle"), 4000);
      }
    } catch {
      setTestError("Request failed");
      setTestResult("fail");
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
      // best-effort unsubscribe
    } finally {
      setBusy(false);
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  if (status === "loading" || status === "unsupported") return null;

  if (status === "ios-browser") {
    return (
      <div className="flex items-start gap-3 bg-gold/5 border border-gold/20 rounded-lg px-4 py-3">
        <Bell className="w-4 h-4 text-gold shrink-0 mt-0.5" />
        <div>
          <p className="font-body text-sm text-text-base font-medium">Enable push notifications</p>
          <p className="font-body text-xs text-text-subtle mt-0.5">
            Add BNSignal to your Home Screen, then reopen to enable message alerts.
          </p>
        </div>
      </div>
    );
  }

  if (status === "no-vapid") {
    return (
      <div className="flex items-start gap-3 bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3">
        <BellOff className="w-4 h-4 text-text-subtle shrink-0 mt-0.5" />
        <div>
          <p className="font-body text-sm text-text-muted">Push not configured</p>
          <p className="font-body text-xs text-text-subtle mt-0.5">
            Add <span className="font-mono text-gold/70">VAPID_PUBLIC_KEY</span> and{" "}
            <span className="font-mono text-gold/70">VAPID_PRIVATE_KEY</span> to Vercel env vars.
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
      <div className="bg-white/[0.03] border border-red-400/20 rounded-lg px-4 py-3 space-y-1.5">
        <div className="flex items-center gap-3">
          <BellOff className="w-4 h-4 text-red-400 shrink-0" />
          <p className="font-body text-sm text-red-400 flex-1 font-medium">Failed to enable notifications</p>
          <button
            onClick={() => { setStatus("idle"); setErrorMsg(null); }}
            className="font-body text-xs text-text-subtle hover:text-text-muted transition-colors"
          >
            Retry
          </button>
        </div>
        {errorMsg && (
          <p className="font-mono text-[11px] text-red-400/80 leading-relaxed pl-7">{errorMsg}</p>
        )}
      </div>
    );
  }

  if (status === "subscribed") {
    return (
      <div className="bg-gold/5 border border-gold/20 rounded-lg px-4 py-3 space-y-2">
        <div className="flex items-center gap-3">
          <BellRing className="w-4 h-4 text-gold shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-body text-sm text-text-base font-medium">Notifications active</p>
            <p className="font-body text-xs text-text-subtle mt-0.5">
              You&rsquo;ll be alerted when a client sends a message.
              {/iPhone|iPad|iPod/i.test(
                typeof navigator !== "undefined" ? navigator.userAgent : ""
              ) && (
                <> Make sure BNSignal is open from your Home Screen (not Safari) to receive alerts.</>
              )}
            </p>
          </div>
          <button
            onClick={unsubscribe}
            disabled={busy || testResult === "sending"}
            className="shrink-0 font-body text-xs text-text-subtle hover:text-red-400 transition-colors disabled:opacity-40"
          >
            {busy ? "…" : "Turn off"}
          </button>
        </div>
        <div className="flex items-start gap-2 pt-0.5">
          <button
            onClick={sendTest}
            disabled={testResult === "sending"}
            className="font-body text-xs text-gold/70 hover:text-gold underline underline-offset-2 transition-colors disabled:opacity-40 shrink-0"
          >
            {testResult === "sending"
              ? "Sending…"
              : testResult === "ok"
              ? "✓ Sent — check your device"
              : "Send test notification"}
          </button>
          {testResult === "fail" && testError && (
            <span className="font-mono text-[11px] text-red-400 leading-relaxed">{testError}</span>
          )}
        </div>
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
