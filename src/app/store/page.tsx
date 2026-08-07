import type { Metadata } from "next";
import { Download, Music2, Shield, Zap } from "lucide-react";
import GoldDivider from "@/components/ui/GoldDivider";
import StoreGrid from "./StoreGrid";
import songsData from "@/data/songs.json";
import type { Song } from "@/types";

export const metadata: Metadata = {
  title: "Download Songs — Brass Note Studios",
  description:
    "Purchase personal-use MP3 downloads of original Brass Note Studios productions. Instant delivery, 24-hour download link.",
  alternates: { canonical: "https://brassnotestudios.com/store" },
  openGraph: {
    title: "Download Songs | Brass Note Studios",
    description: "Purchase personal-use MP3 downloads of original Brass Note Studios productions.",
    url: "https://brassnotestudios.com/store",
    type: "website",
  },
};

const PERKS = [
  {
    icon: Download,
    title: "Instant Download",
    body: "Receive a secure download link immediately after payment. Valid for 24 hours.",
  },
  {
    icon: Music2,
    title: "High-Quality MP3",
    body: "Full-quality MP3 file — the same master used for every official release.",
  },
  {
    icon: Shield,
    title: "Personal Use License",
    body: "Stream it, keep it, share it privately. Need a commercial license? Contact us.",
  },
  {
    icon: Zap,
    title: "Stripe Checkout",
    body: "Secure card payment via Stripe. Your payment info never touches our servers.",
  },
];

export default function StorePage() {
  const purchasable = (songsData.songs as Song[]).filter(
    (s) => s.published && s.purchasable && s.downloadPrice
  );

  return (
    <div>
      {/* Hero */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{ backgroundImage: "radial-gradient(ellipse 60% 50% at 50% 0%, #C9921A33, transparent 70%)" }}
        />
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <p className="text-gold font-body text-xs uppercase tracking-[0.3em] font-semibold mb-4">
            Digital Downloads
          </p>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-text-base leading-tight mb-5">
            Own the Music
          </h1>
          <p className="text-text-muted font-body text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Purchase personal-use MP3s of original Brass Note Studios productions.
            Every track is a real song — written, produced, and mastered for a real story.
          </p>
        </div>
      </section>

      <GoldDivider className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16" />

      {/* Track grid */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-20">
        <StoreGrid songs={purchasable} />
      </section>

      <GoldDivider className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16" />

      {/* Perks row */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-32">
        <p className="text-gold font-body text-xs uppercase tracking-[0.25em] font-semibold text-center mb-10">
          What You Get
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PERKS.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="flex flex-col gap-3 bg-surface border border-white/[0.06] rounded-lg p-6"
            >
              <div className="w-9 h-9 rounded-lg bg-gold/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-gold" />
              </div>
              <p className="font-display text-base text-text-base">{title}</p>
              <p className="text-text-muted font-body text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
