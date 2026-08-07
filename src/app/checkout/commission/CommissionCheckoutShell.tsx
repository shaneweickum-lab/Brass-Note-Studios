"use client";

import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Link from "next/link";
import { ArrowLeft, Check, Clock } from "lucide-react";
import CommissionCheckoutForm from "./CommissionCheckoutForm";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

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

interface Props {
  serviceName: string;
  packageName: string;
  price: string;
  description: string;
  included: string;
  delivery: string;
  customerEmail: string;
  customerName: string;
}

export default function CommissionCheckoutShell({
  serviceName,
  packageName,
  price,
  description,
  included,
  delivery,
  customerEmail,
  customerName,
}: Props) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/checkout/commission", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ serviceName, packageName, customerEmail, customerName }),
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
  }, [serviceName, packageName, customerEmail, customerName]);

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        <Link
          href="/services"
          className="inline-flex items-center gap-1.5 text-text-muted hover:text-text-base font-body text-sm transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Services
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">

          {/* Left — Commission details */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <div
              className="rounded-[10px] overflow-hidden border border-white/[0.06]"
              style={{ background: "linear-gradient(160deg, #131d30 0%, #0F172A 60%, #080d18 100%)" }}
            >
              <div className="h-[2px] w-full bg-gold" />

              <div className="p-5 flex flex-col gap-4">
                <div>
                  <p className="text-gold font-body text-[10px] uppercase tracking-[0.18em] font-semibold mb-1">
                    {serviceName}
                  </p>
                  <h1 className="font-display text-xl text-text-base leading-tight mb-2">
                    {packageName}
                  </h1>
                  <p className="text-text-muted font-body text-sm leading-relaxed">
                    {description}
                  </p>
                </div>

                <div className="h-px bg-white/[0.06]" />

                <div className="flex flex-col gap-2.5">
                  <div className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
                    <p className="text-text-muted font-body text-xs leading-relaxed">{included}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
                    <p className="text-text-muted font-body text-xs leading-relaxed">{delivery}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Price summary */}
            <div className="bg-surface border border-gold/10 rounded-lg px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-text-muted font-body text-xs uppercase tracking-[0.15em] font-semibold mb-0.5">
                  Total
                </p>
                <p className="text-text-base font-body text-sm">Deposit to begin</p>
              </div>
              <p className="font-display text-2xl text-gold">{price}</p>
            </div>

            <p className="text-text-subtle font-body text-xs leading-relaxed">
              We'll reach out within 1–2 business days to kick off your project. Questions?{" "}
              <a href="mailto:support@brassnotestudios.com" className="text-gold/70 hover:text-gold transition-colors">
                support@brassnotestudios.com
              </a>
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
                  <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
                    <CommissionCheckoutForm price={price} />
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
