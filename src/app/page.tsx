import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import ServiceCards from "@/components/home/ServiceCards";
import FeaturedMusic from "@/components/home/FeaturedMusic";
import AboutSnippet from "@/components/home/AboutSnippet";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import GoldDivider from "@/components/ui/GoldDivider";
import Link from "next/link";
import songsData from "@/data/songs.json";
import servicesData from "@/data/services.json";
import testimonialsData from "@/data/testimonials.json";
import type { Song, ServiceFeature, Testimonial } from "@/types";

export const metadata: Metadata = {
  title: "Brass Note Studios — Custom Songwriting & Production",
  description:
    "Custom songs written and produced for life's meaningful moments, brands, and organizations. Professional quality, personal touch.",
};

export default function HomePage() {
  const featuredSongs = (songsData.songs as Song[]).filter((s) => s.featured);
  const services = servicesData.services as ServiceFeature[];
  const testimonials = testimonialsData.testimonials as Testimonial[];

  return (
    <>
      <HeroSection />
      <ServiceCards services={services} />
      <GoldDivider className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" />
      <FeaturedMusic songs={featuredSongs} />
      <AboutSnippet />
      <TestimonialsSection testimonials={testimonials} />

      {/* Bottom CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 text-center bg-surface border-t border-white/5">
        <div className="max-w-2xl mx-auto">
          <p className="text-gold font-body text-sm uppercase tracking-[0.2em] font-semibold mb-4">
            Ready to Create?
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-text-base mb-6">
            Let&rsquo;s Make Your Song
          </h2>
          <p className="text-text-muted font-body leading-relaxed mb-8">
            Tell me your story and I&apos;ll turn it into music. Every song
            starts with a conversation.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center font-body font-semibold tracking-wide bg-gold text-background hover:bg-gold-light rounded-sm px-8 py-4 text-lg transition-colors duration-200"
          >
            Get Your Song
          </Link>
        </div>
      </section>
    </>
  );
}
