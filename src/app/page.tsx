import type { Metadata } from "next";
import Image from "next/image";
import HeroSection from "@/components/home/HeroSection";
import StatsStrip from "@/components/home/StatsStrip";
import ServiceCards from "@/components/home/ServiceCards";
import FeaturedMusic from "@/components/home/FeaturedMusic";
import AboutSnippet from "@/components/home/AboutSnippet";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import GoldDivider from "@/components/ui/GoldDivider";
import Link from "next/link";
import songsData from "@/data/songs.json";
import testimonialsData from "@/data/testimonials.json";
import type { Song, Testimonial } from "@/types";

export const metadata: Metadata = {
  title: "Brass Note Studios — Bespoke Songwriting & Music Production",
  description:
    "Every commission begins with your story. Brass Note Studios writes and produces original songs for life's defining moments — weddings, milestones, brands, and beyond.",
  keywords: [
    "custom song",
    "commission a song",
    "bespoke music",
    "custom wedding song",
    "personalized song gift",
    "original music composition",
    "custom songwriting",
    "music commission",
    "custom song for special occasion",
  ],
  alternates: { canonical: "https://brassnotestudios.com" },
  openGraph: {
    title: "Brass Note Studios — Bespoke Songwriting & Music Production",
    description:
      "Every commission begins with your story. Original songs written and produced for life's defining moments — weddings, milestones, brands, and beyond.",
    url: "https://brassnotestudios.com",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brass Note Studios — Bespoke Songwriting & Music Production",
    description:
      "Every commission begins with your story. Original songs written and produced for life's defining moments.",
  },
};

export default function HomePage() {
  const featuredSongs = (songsData.songs as Song[]).filter((s) => s.published);
  const testimonials = testimonialsData.testimonials as Testimonial[];

  return (
    <>
      <HeroSection />
      <StatsStrip />
      <ServiceCards />
      <GoldDivider className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" />
      <FeaturedMusic songs={featuredSongs} />
      <AboutSnippet />
      <TestimonialsSection testimonials={testimonials} />

      {/* Bottom CTA */}
      <section className="py-28 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden border-t border-border-subtle">
        <Image
          src="/images/IMG_5103.png"
          alt="A writing desk with sheet music and a fountain pen"
          fill
          loading="lazy"
          style={{ objectFit: "cover" }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(10,10,10,0.78) 0%, rgba(10,10,10,0.88) 60%, rgba(10,10,10,0.95) 100%)" }} />
        <div className="max-w-xl mx-auto relative z-10">
          <div className="flex items-center justify-center gap-3 mb-8">
            <span className="h-px w-8 bg-gold/35" />
            <p className="font-display-sc text-gold text-[10px] uppercase tracking-[0.3em]">Begin Your Commission</p>
            <span className="h-px w-8 bg-gold/35" />
          </div>
          <h2 className="font-display text-4xl md:text-5xl text-text-base font-light mb-4 leading-tight">
            Every story deserves
            <br />
            <em className="text-gold italic font-light">its own sound.</em>
          </h2>
          <p className="text-text-muted font-body text-sm leading-[1.8] mb-10">
            Tell us your story and we&apos;ll turn it into music. Every commission
            starts with a conversation.
          </p>
          <Link
            href="/contact"
            className="btn-gold-glow inline-flex items-center justify-center font-body font-normal tracking-[0.2em] uppercase border border-gold/60 text-gold hover:bg-gold/8 hover:border-gold px-10 py-4 text-[11px] transition-all duration-200"
          >
            Commission Your Song
          </Link>
        </div>
      </section>
    </>
  );
}
