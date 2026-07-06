"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, CheckCircle2, RefreshCw } from "lucide-react";

interface DiagnosticsResult {
  dbConnected?: boolean;
  dbError?: string;
  messageCount?: number;
  pushTableExists?: boolean;
  pushTableError?: string;
  pushSubscriptionCount?: number;
  vapidPublicKeySet?: boolean;
  vapidPrivateKeySet?: boolean;
  vapidPublicKeyLength?: number;
  vapidPrivateKeyLength?: number;
  realtimeConfig?: {
    messages_in_publication: boolean;
    messages_replica_identity: string;
    push_subscriptions_exists: boolean;
  };
  realtimeConfigError?: string;
  realtimeConfigNote?: string;
}

function Check({ ok, label, detail }: { ok: boolean; label: string; detail?: string }) {
  return (
    <div className="flex items-start gap-2">
      {ok ? (
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
      ) : (
        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
      )}
      <div>
        <span className={`font-body text-xs ${ok ? "text-text-muted" : "text-amber-400"}`}>{label}</span>
        {detail && (
          <p className="font-mono text-[10px] text-text-subtle mt-0.5 leading-snug">{detail}</p>
        )}
      </div>
    </div>
  );
}

export default function DiagnosticsPanel() {
  const [data, setData] = useState<DiagnosticsResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/diagnostics");
      if (res.ok) setData(await res.json());
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  // Auto-expand if there are issues
  useEffect(() => {
    if (!data) return;
    const hasIssue =
      !data.dbConnected ||
      !data.pushTableExists ||
      !data.vapidPublicKeySet ||
      !data.vapidPrivateKeySet ||
      data.realtimeConfig?.messages_in_publication === false ||
      data.realtimeConfig?.messages_replica_identity !== "full";
    if (hasIssue) setExpanded(true);
  }, [data]);

  if (loading) return null;
  if (!data) return null;

  const realtimeOk =
    data.realtimeConfig?.messages_in_publication === true &&
    data.realtimeConfig?.messages_replica_identity === "full";

  const vapidOk = data.vapidPublicKeySet && data.vapidPrivateKeySet &&
    (data.vapidPublicKeyLength ?? 0) > 50 && (data.vapidPrivateKeyLength ?? 0) > 30;

  const allOk = data.dbConnected && data.pushTableExists && vapidOk &&
    (data.realtimeConfig ? realtimeOk : true);

  if (allOk && !expanded) return null;

  return (
    <div className={`border rounded-lg overflow-hidden ${allOk ? "border-white/10 bg-white/[0.02]" : "border-amber-400/20 bg-amber-400/5"}`}>
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left"
      >
        {allOk ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        ) : (
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
        )}
        <span className={`font-body text-sm font-medium flex-1 ${allOk ? "text-text-muted" : "text-amber-400"}`}>
          {allOk ? "System health OK" : "Setup issues detected — expand for details"}
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); load(); }}
          className="p-1 text-text-subtle hover:text-text-muted transition-colors"
          title="Refresh"
        >
          <RefreshCw className="w-3 h-3" />
        </button>
        <span className="font-body text-xs text-text-subtle">{expanded ? "▲" : "▼"}</span>
      </button>

      {expanded && (
        <div className="border-t border-white/10 px-4 py-3 space-y-2">
          <Check ok={!!data.dbConnected} label="Supabase database connected" detail={data.dbError} />
          <Check
            ok={!!data.pushTableExists}
            label={data.pushTableExists ? "push_subscriptions table exists" : "push_subscriptions table missing — run migration 003"}
            detail={data.pushTableError}
          />
          <Check
            ok={!!vapidOk}
            label={
              !data.vapidPublicKeySet || !data.vapidPrivateKeySet
                ? "VAPID keys not set in Vercel env vars"
                : (data.vapidPublicKeyLength ?? 0) < 50 || (data.vapidPrivateKeyLength ?? 0) < 30
                ? `VAPID keys look too short (pub: ${data.vapidPublicKeyLength} chars, priv: ${data.vapidPrivateKeyLength} chars — expected ~87 / ~43)`
                : "VAPID keys configured"
            }
          />
          {data.realtimeConfig ? (
            <>
              <Check
                ok={data.realtimeConfig.messages_in_publication}
                label={
                  data.realtimeConfig.messages_in_publication
                    ? "messages table in supabase_realtime publication"
                    : "messages table NOT in realtime publication — run migration 004"
                }
              />
              <Check
                ok={data.realtimeConfig.messages_replica_identity === "full"}
                label={
                  data.realtimeConfig.messages_replica_identity === "full"
                    ? "messages REPLICA IDENTITY = FULL"
                    : `messages REPLICA IDENTITY = ${data.realtimeConfig.messages_replica_identity} (needs FULL) — run migration 004`
                }
              />
            </>
          ) : (
            <Check
              ok={false}
              label="Realtime config unknown — run migration 004 in Supabase SQL Editor to enable this check"
              detail={data.realtimeConfigNote}
            />
          )}

          {(!allOk) && (
            <div className="mt-3 pt-3 border-t border-white/10">
              <p className="font-body text-xs text-text-subtle">
                Run the SQL files in <span className="font-mono text-gold/70">supabase/migrations/</span> in your{" "}
                <a
                  href="https://supabase.com/dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold underline underline-offset-2 hover:text-gold-light"
                >
                  Supabase SQL Editor
                </a>
                {" "}to fix missing setup.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
