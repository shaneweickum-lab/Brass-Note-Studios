"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Link from "next/link";
import { ArrowLeft, Check, Clock, Plus, Minus } from "lucide-react";
import CommissionCheckoutForm from "./CommissionCheckoutForm";
import type { AddonOption } from "./page";

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

function parsePriceCents(priceStr: string): number {
  const match = priceStr.match(/\$?([\d,]+)/);
  if (!match) return 0;
  return parseInt(match[1].replace(",", ""), 10) * 100;
}

function formatTotal(cents: number): string {
  const dollars = cents / 100;
  return `$${dollars % 1 === 0 ? dollars : dollars.toFixed(2)}`;
}

interface Props {
  serviceName: string;
  packageName: string;
  price: string;
  description: string;
  included: string;
  delivery: string;
  customerEmail: string;
  customerName: string;
  availableAddons: AddonOption[];
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
  availableAddons,
}: Props) {
  const [step, setStep]                   = useState<"addons" | "payment">("addons");
  const [selected, setSelected]           = useState<Set<string>>(new Set());
  const [clientSecret, setClientSecret]   = useState<string | null>(null);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [error, setError]                 = useState<string | null>(null);

  const baseCents  = parsePriceCents(price);
  const addonCents = Array.from(selected).reduce((sum, name) => {
    const a = availableAddons.find((x) => x.name === name);
    return sum + (a ? parsePriceCents(a.price) : 0);
  }, 0);
  const totalCents = baseCents + addonCents;
  const totalDisplay = formatTotal(totalCents);

  const toggleAddon = (name: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });

  const handleProceed = async () => {
    setLoadingPayment(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout/commission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceName,
          packageName,
          customerEmail,
          customerName,
          addons: Array.from(selected),
        }),
      });
      const data = await res.json() as { clientSecret?: string; error?: string };
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
        setStep("payment");
      } else {
        setError(data.error ?? "Unable to proceed to payment.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoadingPayment(false);
  };

  // ── Left panel (shared) ─────────────────────────────────────────────────────
  const leftPanel = (
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
            <h1 className="font-display text-xl text-text-base leading-tight mb-2">{packageName}</h1>
            <p className="text-text-muted font-body text-sm leading-relaxed">{description}</p>
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

          {/* Selected add-ons summary (payment step only) */}
          {step === "payment" && selected.size > 0 && (
            <>
              <div className="h-px bg-white/[0.06]" />
              <div className="flex flex-col gap-1.5">
                <p className="text-gold font-body text-[10px] uppercase tracking-[0.15em] font-semibold mb-0.5">
                  Add-ons
                </p>
                {Array.from(selected).map((name) => {
                  const a = availableAddons.find((x) => x.name === name);
                  return (
                    <div key={name} className="flex items-center justify-between gap-2">
                      <p className="text-text-muted font-body text-xs">{name}</p>
                      <p className="text-text-base font-body text-xs font-semibold shrink-0">+{a?.price}</p>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Price summary */}
      <div className="bg-surface border border-gold/10 rounded-lg px-5 py-4 flex items-center justify-between">
        <div>
          <p className="text-text-muted font-body text-xs uppercase tracking-[0.15em] font-semibold mb-0.5">
            Total
          </p>
          <p className="text-text-base font-body text-sm">
            {addonCents > 0 ? `Base ${price} + add-ons` : "Deposit to begin"}
          </p>
        </div>
        <p className="font-display text-2xl text-gold">{totalDisplay}</p>
      </div>

      <p className="text-text-subtle font-body text-xs leading-relaxed">
        We'll reach out within 1–2 business days to kick off your project. Questions?{" "}
        <a href="mailto:support@brassnotestudios.com" className="text-gold/70 hover:text-gold transition-colors">
          support@brassnotestudios.com
        </a>
      </p>
    </div>
  );

  // ── Step 1: Add-on selection ────────────────────────────────────────────────
  if (step === "addons") {
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
            {leftPanel}

            {/* Add-on selection */}
            <div className="lg:col-span-3 flex flex-col gap-4">
              <div
                className="rounded-[10px] overflow-hidden border border-white/[0.06]"
                style={{ background: "linear-gradient(160deg, #131d30 0%, #0F172A 60%, #080d18 100%)" }}
              >
                <div
                  className="h-[2px] w-full"
                  style={{ background: "linear-gradient(90deg, transparent 0%, #D4A843 30%, #0D9488 70%, transparent 100%)" }}
                />
                <div className="p-6 sm:p-8">
                  <p className="text-text-muted font-body text-xs uppercase tracking-[0.2em] font-semibold mb-5">
                    Customize Your Order
                  </p>

                  {availableAddons.length === 0 ? (
                    <p className="text-text-muted font-body text-sm">No add-ons available for this package.</p>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {availableAddons.map((addon) => {
                        const isSelected = selected.has(addon.name);
                        return (
                          <button
                            key={addon.name}
                            type="button"
                            onClick={() => toggleAddon(addon.name)}
                            className="w-full text-left flex items-start gap-4 p-4 rounded-sm border transition-all duration-200"
                            style={{
                              background: isSelected ? "rgba(212,168,67,0.06)" : "rgba(255,255,255,0.02)",
                              borderColor: isSelected ? "rgba(212,168,67,0.4)" : "rgba(255,255,255,0.08)",
                            }}
                          >
                            {/* Checkbox */}
                            <div
                              className="w-5 h-5 rounded-sm border flex items-center justify-center shrink-0 mt-0.5 transition-all duration-150"
                              style={{
                                background: isSelected ? "#D4A843" : "transparent",
                                borderColor: isSelected ? "#D4A843" : "rgba(255,255,255,0.2)",
                              }}
                            >
                              {isSelected && <Check className="w-3 h-3 text-background" />}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <p className="text-text-base font-body text-sm font-semibold leading-tight">
                                {addon.name}
                              </p>
                              <p className="text-text-muted font-body text-xs mt-0.5 leading-relaxed">
                                {addon.notes}
                              </p>
                            </div>

                            {/* Price */}
                            <div className="flex items-center gap-1 shrink-0">
                              {isSelected
                                ? <Minus className="w-3 h-3 text-gold" />
                                : <Plus className="w-3 h-3 text-text-muted" />
                              }
                              <span
                                className="font-display text-base"
                                style={{ color: isSelected ? "#D4A843" : "#8A7A6E" }}
                              >
                                {addon.price}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Order summary + proceed */}
              <div
                className="rounded-[10px] border border-white/[0.06] px-6 py-5 flex flex-col gap-3"
                style={{ background: "linear-gradient(160deg, #131d30 0%, #0F172A 60%, #080d18 100%)" }}
              >
                <div className="flex flex-col gap-1.5 text-sm font-body">
                  <div className="flex justify-between">
                    <span className="text-text-muted">{packageName}</span>
                    <span className="text-text-base">{price}</span>
                  </div>
                  {Array.from(selected).map((name) => {
                    const a = availableAddons.find((x) => x.name === name);
                    return (
                      <div key={name} className="flex justify-between">
                        <span className="text-text-muted">{name}</span>
                        <span className="text-text-base">+{a?.price}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="h-px bg-white/[0.06]" />

                <div className="flex justify-between items-baseline">
                  <span className="text-text-muted font-body text-xs uppercase tracking-[0.15em] font-semibold">
                    Total
                  </span>
                  <span className="font-display text-2xl text-gold">{totalDisplay}</span>
                </div>

                {error && (
                  <p className="text-red-400 font-body text-sm bg-red-400/10 border border-red-400/20 rounded-sm px-3 py-2">
                    {error}
                  </p>
                )}

                <button
                  onClick={handleProceed}
                  disabled={loadingPayment}
                  className="w-full flex items-center justify-center gap-2 bg-gold hover:bg-gold-light text-background font-body font-semibold py-4 rounded-sm transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-1"
                >
                  {loadingPayment ? "Loading…" : `Proceed to Payment — ${totalDisplay}`}
                </button>

                <p className="text-text-subtle font-body text-[10px] text-center">
                  No charge yet — you'll review before confirming payment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ── Step 2: Payment ─────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => setStep("addons")}
          className="inline-flex items-center gap-1.5 text-text-muted hover:text-text-base font-body text-sm transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to order options
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
          {leftPanel}

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
                {clientSecret ? (
                  <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
                    <CommissionCheckoutForm price={totalDisplay} />
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
