import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

const highlights = [
  "Every song composed personally — never templated",
  "Thirty years of musical craft behind every production",
  "Your vision guides every creative decision",
  "Consistent, professional-grade quality",
];

export default function AboutSnippet() {
  return (
    <section className="py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-surface">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Visual side */}
          <div className="relative order-2 lg:order-1">
            <div className="aspect-square max-w-md mx-auto border border-border-subtle flex items-center justify-center relative overflow-hidden">
              <Image
                src="/images/IMG_5103.png"
                alt=""
                fill
                className="object-cover object-center scale-110"
                aria-hidden="true"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
              <div className="absolute inset-0" style={{ background: "rgba(201,168,76,0.04)", mixBlendMode: "overlay" } as React.CSSProperties} />
              <div className="text-center p-8 relative z-10">
                <div className="w-48 h-48 mx-auto mb-6 flex items-center justify-center">
                  <Image
                    src="/images/B6E31839-3169-4CE4-A5D6-A45D2ED27628.png"
                    alt="Brass Note Studios"
                    width={192}
                    height={192}
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="font-display text-2xl text-text-base font-light mb-1">
                  Brass Note Studios
                </p>
                <p className="text-gold text-xs italic font-body tracking-wide">
                  Where Your Story Becomes a Song
                </p>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-16 h-16 border-b border-r border-gold/20 pointer-events-none" />
            <div className="absolute -top-4 -left-4 w-16 h-16 border-t border-l border-gold/20 pointer-events-none" />
          </div>

          {/* Content side */}
          <div className="order-1 lg:order-2">
            <SectionHeading
              eyebrow="The Atelier"
              title="An Atelier Built for the Weight of Human Memory"
              subtitle="We believe every story — every wedding, every anniversary, every act of courage — deserves its own permanent expression in sound."
              className="mb-8"
            />

            <p className="text-text-muted font-body text-sm leading-[1.85] mb-8">
              Brass Note Studios is where the precision of a craftsman meets the reach of modern AI production.
              Thirty years of musical experience, reverse-engineered into a methodology that delivers consistency
              without sacrificing the emotional weight that makes music meaningful.
            </p>

            <ul className="flex flex-col gap-3 mb-8">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="w-1 h-1 rounded-full bg-gold mt-2 shrink-0" />
                  <span className="text-text-muted font-body text-sm leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            <Link
              href="/about"
              className="flex items-center gap-2 text-gold hover:text-gold-light font-body text-[11px] font-normal tracking-[0.2em] uppercase transition-colors group"
            >
              Read Our Story{" "}
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
