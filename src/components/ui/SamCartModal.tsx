"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

// ─── SamCart Product Configuration ────────────────────────────────────────────
// After creating your products in SamCart, paste the checkout page URL for each
// product below. Find the URL in SamCart: Products → [Product] → Share/Embed.
//
// For EMAIL CAPTURE (free opt-in): use the checkout URL of your free product.
// For PAID CHECKOUT: use the checkout URL of your paid product.
// ──────────────────────────────────────────────────────────────────────────────
export const SAMCART_URLS: Record<string, string> = {
  // Paste your SamCart checkout URLs here ↓
  shore:         "PASTE_SAMCART_URL_FOR_SHORE_HERE",
  weeds:         "PASTE_SAMCART_URL_FOR_WEEDS_HERE",
  swamp:         "PASTE_SAMCART_URL_FOR_SWAMP_HERE",
  emailCapture:  "PASTE_SAMCART_URL_FOR_EMAIL_CAPTURE_HERE",
};
// ──────────────────────────────────────────────────────────────────────────────

interface SamCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  /** SamCart checkout page URL — renders inside an iframe */
  checkoutUrl: string;
}

export default function SamCartModal({
  isOpen,
  onClose,
  title,
  subtitle,
  checkoutUrl,
}: SamCartModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Prevent body scroll while modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isPlaceholder = checkoutUrl.startsWith("PASTE_");

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Modal panel */}
      <div
        className="relative z-10 w-full max-w-xl flex flex-col rounded-lg overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #1A1114 0%, #0D0A0B 100%)",
          border: "1px solid rgba(212,168,67,0.35)",
          boxShadow: "0 0 60px rgba(212,168,67,0.12), 0 24px 80px rgba(0,0,0,0.7)",
          maxHeight: "90vh",
        }}
      >
        {/* Gold accent top strip */}
        <div
          className="h-[2px] w-full flex-shrink-0"
          style={{ background: "linear-gradient(90deg, transparent 0%, #D4A843 30%, #0D9488 70%, transparent 100%)" }}
        />

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 flex-shrink-0">
          <div>
            <p className="text-gold font-body text-[10px] uppercase tracking-[0.25em] font-semibold mb-1">
              Brass Syntax Academy
            </p>
            <h2 className="font-display text-xl text-text-base leading-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-text-muted font-body text-sm mt-1">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="ml-4 flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full border border-white/10 text-text-muted hover:text-text-base hover:border-gold/30 transition-colors duration-150"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Thin divider */}
        <div className="h-px mx-6 bg-white/5 flex-shrink-0" />

        {/* Checkout iframe / placeholder */}
        <div className="flex-1 min-h-0 overflow-auto">
          {isPlaceholder ? (
            <div className="flex flex-col items-center justify-center py-16 px-8 text-center gap-4">
              <div
                className="w-14 h-14 rounded-full border border-gold/30 flex items-center justify-center"
                style={{ background: "rgba(212,168,67,0.08)" }}
              >
                <span className="text-gold text-xl">✦</span>
              </div>
              <p className="text-text-base font-display text-lg">Coming Soon</p>
              <p className="text-text-muted font-body text-sm leading-relaxed max-w-xs">
                This enrollment is being set up. Check back shortly or join the
                waitlist below.
              </p>
              <a
                href="#waitlist"
                onClick={onClose}
                className="mt-2 inline-flex items-center justify-center font-body font-semibold tracking-wide border border-gold text-gold hover:bg-gold/10 rounded-sm px-6 py-2.5 text-sm transition-colors duration-200"
              >
                Join the Waitlist
              </a>
            </div>
          ) : (
            <iframe
              src={checkoutUrl}
              title={title}
              className="w-full"
              style={{ minHeight: "600px", border: "none", display: "block" }}
              allow="payment"
              loading="lazy"
            />
          )}
        </div>

        {/* Footer note */}
        {!isPlaceholder && (
          <div className="px-6 py-3 flex-shrink-0 border-t border-white/5">
            <p className="text-text-muted font-body text-[10px] text-center">
              Secure checkout powered by SamCart. Your payment info never touches our servers.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
