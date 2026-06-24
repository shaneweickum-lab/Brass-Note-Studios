import type { Metadata } from "next";
import Link from "next/link";
import FloatingParticles from "@/components/ui/FloatingParticles";
import MethodPageClient from "@/components/method/MethodPageClient";

export const metadata: Metadata = {
  title: "The Brass Note Method — Brass Note Studios",
  description:
    "Thirty years of musicianship, reverse engineered into a 10-layer AI prompting framework. The system behind every Brass Note Studios production.",
};

const STAT_PILLS = [
  "10-Layer Framework",
  "8 Undocumented Symbols",
  "3 Case Studies",
];

export default function MethodPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-navy-gradient" />
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(201,168,76,0.15) 0%, transparent 70%)",
          }}
        />
        <FloatingParticles />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-gold font-body text-xs uppercase tracking-[0.3em] font-semibold mb-6">
              The Brass Note Method
            </p>

            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl text-text-base leading-[1.05] mb-6">
              Thirty Years of Musicianship.{" "}
              <span className="text-gold italic">Reverse Engineered.</span>
            </h1>

            <p className="text-text-muted font-body text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
              I didn&apos;t read this in a guide. I didn&apos;t learn it from a
              tutorial. This is what thirty years of ear training, music theory,
              and live performance looks like when it&apos;s translated into
              language a model can understand.
            </p>

            {/* Stat pills */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
              {STAT_PILLS.map((pill) => (
                <span
                  key={pill}
                  className="inline-flex items-center px-4 py-1.5 rounded-full border border-gold/30 text-gold font-body text-sm font-medium bg-gold/5"
                >
                  {pill}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#tier1"
                className="inline-flex items-center justify-center font-body font-semibold tracking-wide bg-gold text-background hover:bg-gold-light rounded-sm px-8 py-4 text-lg transition-colors duration-200 w-full sm:w-auto"
              >
                Explore the Framework
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center font-body font-semibold tracking-wide border border-gold text-gold hover:bg-gold/10 rounded-sm px-8 py-4 text-lg transition-colors duration-200 w-full sm:w-auto"
              >
                Commission a Song
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* All interactive sections */}
      <MethodPageClient />
    </>
  );
}
