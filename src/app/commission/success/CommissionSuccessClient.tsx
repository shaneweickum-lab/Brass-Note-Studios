"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { CheckCircle, ArrowLeft, Mail } from "lucide-react";

interface Props {
  paymentIntentId: string | null;
}

export default function CommissionSuccessClient({ paymentIntentId }: Props) {
  const notified = useRef(false);

  useEffect(() => {
    if (!paymentIntentId || notified.current) return;
    notified.current = true;

    let intake: Record<string, string> | null = null;
    try {
      const raw = sessionStorage.getItem("commission_intake");
      if (raw) {
        intake = JSON.parse(raw) as Record<string, string>;
        sessionStorage.removeItem("commission_intake");
      }
    } catch {
      // ignore
    }

    fetch("/api/commission/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentIntentId, intake }),
    }).catch(() => {
      // best-effort; don't surface errors to the customer
    });
  }, [paymentIntentId]);

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full">
        <div
          className="rounded-lg overflow-hidden"
          style={{
            background: "linear-gradient(160deg, #131d30 0%, #0F172A 60%, #080d18 100%)",
            border: "1px solid rgba(13,148,136,0.3)",
            boxShadow: "0 0 40px rgba(13,148,136,0.08), 0 24px 60px rgba(0,0,0,0.6)",
          }}
        >
          <div
            className="h-[2px]"
            style={{ background: "linear-gradient(90deg, transparent 0%, #D4A843 40%, #0D9488 70%, transparent 100%)" }}
          />

          <div className="px-8 py-10 text-center flex flex-col items-center gap-5">
            <div
              className="w-16 h-16 rounded-full border border-teal/30 flex items-center justify-center"
              style={{ background: "rgba(13,148,136,0.08)" }}
            >
              <CheckCircle className="w-7 h-7 text-teal" />
            </div>

            <div>
              <p className="text-teal font-body text-[10px] uppercase tracking-[0.25em] font-semibold mb-2">
                Payment Confirmed
              </p>
              <h1 className="font-display text-2xl text-text-base leading-tight mb-3">
                Your Commission is Booked
              </h1>
              <p className="text-text-muted font-body text-sm leading-relaxed">
                We received your order and project details. Expect a follow-up from us
                within <span className="text-text-base font-semibold">1–2 business days</span> to
                kick off your song.
              </p>
            </div>

            <div className="w-full bg-white/[0.03] border border-white/[0.06] rounded-sm px-4 py-3 text-left flex items-start gap-3">
              <Mail className="w-4 h-4 text-gold shrink-0 mt-0.5" />
              <p className="text-text-muted font-body text-xs leading-relaxed">
                A receipt has been sent to your email. Questions? Reach us at{" "}
                <a href="mailto:support@brassnotestudios.com" className="text-gold hover:underline">
                  support@brassnotestudios.com
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-text-muted hover:text-text-base font-body text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Services
          </Link>
        </div>
      </div>
    </main>
  );
}
