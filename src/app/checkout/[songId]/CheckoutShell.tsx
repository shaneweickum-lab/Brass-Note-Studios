"use client";

import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import type { Song } from "@/types";
import CheckoutForm from "./CheckoutForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface Props {
  song: Song;
}

export default function CheckoutShell({ song }: Props) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/checkout/song", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ songId: song.id }),
    })
      .then((r) => r.json())
      .then((data: { clientSecret?: string; error?: string }) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          setError(data.error ?? "Unable to load checkout.");
        }
      })
      .catch(() => setError("Unable to load checkout."));
  }, [song.id]);

  const appearance = {
    theme: "night" as const,
    variables: {
      colorPrimary: "#D4A843",
      colorBackground: "#140F10",
      colorText: "#E8E0D5",
      colorTextSecondary: "#8A7A6E",
      colorDanger: "#e05a5a",
      borderRadius: "2px",
      fontFamily: "system-ui, -apple-system, sans-serif",
      colorInputBackground: "#0D0A0B",
      colorInputBorder: "rgba(255,255,255,0.12)",
      colorInputText: "#E8E0D5",
      colorInputPlaceholder: "#5a4e47",
      colorIconTab: "#8A7A6E",
      colorIconTabSelected: "#D4A843",
      colorIconTabHover: "#E8E0D5",
      focusBoxShadow: "0 0 0 2px rgba(212,168,67,0.35)",
      focusOutline: "none",
    },
    rules: {
      ".Label": { color: "#8A7A6E", fontSize: "11px", textTransform: "uppercase" as const, letterSpacing: "0.12em" },
      ".Input": { border: "1px solid rgba(255,255,255,0.1)", padding: "12px 14px" },
      ".Input:focus": { border: "1px solid rgba(212,168,67,0.5)", boxShadow: "0 0 0 2px rgba(212,168,67,0.15)" },
      ".Tab": { border: "1px solid rgba(255,255,255,0.08)", backgroundColor: "#0D0A0B" },
      ".Tab:hover": { border: "1px solid rgba(212,168,67,0.3)", color: "#E8E0D5" },
      ".Tab--selected": { border: "1px solid rgba(212,168,67,0.5)", backgroundColor: "rgba(212,168,67,0.08)" },
      ".Block": { border: "1px solid rgba(255,255,255,0.06)", backgroundColor: "#0D0A0B" },
    },
  };

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        {/* Back link */}
        <Link
          href="/store"
          className="inline-flex items-center gap-1.5 text-text-muted hover:text-text-base font-body text-sm transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Store
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">

          {/* Left — Song details */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {/* Song card */}
            <div
              className="rounded-[10px] overflow-hidden border border-white/[0.06]"
              style={{ background: "linear-gradient(160deg, #131d30 0%, #0F172A 60%, #080d18 100%)" }}
            >
              <div className="h-[2px] w-full bg-gold" />

              {/* Art area */}
              <div
                className="h-[140px] flex items-center justify-center relative"
                style={{ background: "linear-gradient(135deg, #0a1525, #111827)" }}
              >
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-40 h-40 rounded-full blur-2xl" style={{ background: "rgba(212,168,67,0.1)" }} />
                </div>
                <div className="flex items-end justify-center gap-[3px] h-10 relative z-10">
                  {[10, 22, 36, 28, 44, 32, 48, 38, 28, 18, 30, 12].map((h, i) => (
                    <div key={i} className="w-[3px] rounded-sm bg-gold" style={{ height: h, opacity: 0.5 }} />
                  ))}
                </div>
              </div>

              <div className="p-5">
                <p className="text-gold font-body text-[10px] uppercase tracking-[0.18em] font-semibold mb-1">
                  A Brass Note Studios Production
                </p>
                <h1 className="font-display text-xl text-text-base leading-tight mb-1">{song.title}</h1>
                <p className="text-teal font-body text-sm mb-3">{song.clientName}</p>
                {song.description && (
                  <p className="text-text-muted font-body text-xs leading-relaxed mb-4">{song.description}</p>
                )}
                <div className="flex flex-wrap gap-1.5">
                  {song.genre && (
                    <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-gold bg-gold/[0.08] border border-gold/[0.25] px-2.5 py-1 rounded-full">
                      {song.genre}
                    </span>
                  )}
                  <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-teal bg-teal/[0.08] border border-teal/[0.25] px-2.5 py-1 rounded-full">
                    MP3 Download
                  </span>
                </div>
              </div>
            </div>

            {/* Price summary */}
            <div className="bg-surface border border-gold/10 rounded-lg px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-text-muted font-body text-xs uppercase tracking-[0.15em] font-semibold mb-0.5">Total</p>
                <p className="text-text-base font-body text-sm">Personal-use MP3 license</p>
              </div>
              <p className="font-display text-2xl text-gold">${song.downloadPrice!.toFixed(2)}</p>
            </div>

            {/* License note */}
            <p className="text-text-subtle font-body text-xs leading-relaxed">
              Personal use only. For commercial licensing contact{" "}
              <a href="mailto:support@brassnotestudios.com" className="text-gold/70 hover:text-gold transition-colors">
                support@brassnotestudios.com
              </a>
              .
            </p>
          </div>

          {/* Right — Payment form */}
          <div className="lg:col-span-3">
            <div
              className="rounded-[10px] overflow-hidden border border-white/[0.06]"
              style={{ background: "linear-gradient(160deg, #131d30 0%, #0F172A 60%, #080d18 100%)" }}
            >
              <div
                className="h-[2px] w-full"
                style={{ background: "linear-gradient(90deg, transparent 0%, #D4A843 30%, #0D9488 70%, transparent 100%)" }}
              />
              <div className="p-6 sm:p-8">
                <p className="text-text-muted font-body text-xs uppercase tracking-[0.2em] font-semibold mb-6">
                  Payment Details
                </p>

                {error ? (
                  <div className="text-red-400 font-body text-sm bg-red-400/10 border border-red-400/20 rounded-sm px-4 py-3">
                    {error}
                  </div>
                ) : clientSecret ? (
                  <Elements
                    stripe={stripePromise}
                    options={{ clientSecret, appearance }}
                  >
                    <CheckoutForm song={song} />
                  </Elements>
                ) : (
                  <div className="flex flex-col gap-3 animate-pulse">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-12 rounded-sm bg-white/[0.04]" />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
