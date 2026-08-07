"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Download, Music, ArrowLeft, CheckCircle } from "lucide-react";

export default function DownloadClient() {
  const searchParams = useSearchParams();
  const paymentIntentId = searchParams.get("payment_intent");
  const redirectStatus  = searchParams.get("redirect_status");

  const [dlState, setDlState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [dlError, setDlError] = useState<string | null>(null);

  if (!paymentIntentId || redirectStatus !== "succeeded") {
    return (
      <ErrorState message={
        redirectStatus === "failed"
          ? "Payment was not completed. Please try again."
          : "No payment found. Please check your order confirmation email."
      } />
    );
  }

  const handleDownload = async () => {
    setDlState("loading");
    setDlError(null);
    try {
      const res = await fetch(`/api/download?payment_intent=${encodeURIComponent(paymentIntentId)}`);
      const data = await res.json() as { url?: string; error?: string };

      if (!res.ok || !data.url) {
        setDlError(data.error ?? "Could not generate download link. Please try again.");
        setDlState("error");
        return;
      }

      // Trigger download without navigating away
      const a = document.createElement("a");
      a.href = data.url;
      a.download = "";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setDlState("done");
    } catch {
      setDlError("Something went wrong. Please try again.");
      setDlState("error");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full">
        <div
          className="rounded-lg overflow-hidden"
          style={{
            background: "linear-gradient(160deg, #131d30 0%, #0F172A 60%, #080d18 100%)",
            border: "1px solid rgba(212,168,67,0.3)",
            boxShadow: "0 0 40px rgba(212,168,67,0.08), 0 24px 60px rgba(0,0,0,0.6)",
          }}
        >
          <div
            className="h-[2px]"
            style={{ background: "linear-gradient(90deg, transparent 0%, #D4A843 40%, #0D9488 70%, transparent 100%)" }}
          />

          <div className="px-8 py-10 text-center flex flex-col items-center gap-5">
            <div
              className="w-16 h-16 rounded-full border border-gold/30 flex items-center justify-center"
              style={{ background: dlState === "done" ? "rgba(52,211,153,0.08)" : "rgba(212,168,67,0.08)" }}
            >
              {dlState === "done"
                ? <CheckCircle className="w-7 h-7 text-teal" />
                : <Music className="w-7 h-7 text-gold" />
              }
            </div>

            <div>
              <p className="text-gold font-body text-[10px] uppercase tracking-[0.25em] font-semibold mb-2">
                Purchase Complete
              </p>
              <h1 className="font-display text-2xl text-text-base leading-tight mb-3">
                {dlState === "done" ? "Download Started" : "Your Track is Ready"}
              </h1>
              <p className="text-text-muted font-body text-sm leading-relaxed">
                {dlState === "done"
                  ? "Your MP3 is downloading. You can click the button again if it didn't start."
                  : "Click below to download your personal-use MP3. The link is valid for 24 hours."}
              </p>
            </div>

            {dlError && (
              <div className="w-full bg-red-400/10 border border-red-400/20 rounded-sm px-4 py-3">
                <p className="text-red-400 font-body text-sm">{dlError}</p>
              </div>
            )}

            <button
              onClick={handleDownload}
              disabled={dlState === "loading"}
              className="w-full flex items-center justify-center gap-2 bg-gold hover:bg-gold-light text-background font-body font-semibold px-6 py-4 rounded-sm transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Download className="w-5 h-5" />
              {dlState === "loading" ? "Preparing Download…" : dlState === "done" ? "Download Again" : "Download MP3"}
            </button>

            <div className="w-full bg-white/[0.03] border border-white/[0.06] rounded-sm px-4 py-3 text-left">
              <p className="text-gold font-body text-[10px] uppercase tracking-[0.15em] font-semibold mb-1">
                License
              </p>
              <p className="text-text-muted font-body text-xs leading-relaxed">
                Personal use only. Do not redistribute, re-sell, or use in commercial productions
                without a commercial license. Contact{" "}
                <a href="mailto:support@brassnotestudios.com" className="text-gold hover:underline">
                  support@brassnotestudios.com
                </a>{" "}
                for commercial licensing.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/store"
            className="inline-flex items-center gap-1.5 text-text-muted hover:text-text-base font-body text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Store
          </Link>
        </div>
      </div>
    </main>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <p className="text-text-muted font-body text-sm mb-4">{message}</p>
        <Link
          href="/store"
          className="inline-flex items-center gap-1.5 text-gold hover:text-gold-light font-body text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Store
        </Link>
      </div>
    </main>
  );
}
