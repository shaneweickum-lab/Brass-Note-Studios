import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

const highlights = [
  "Every song written personally — never templated",
  "Professional-grade production via Suno AI",
  "Your vision guides every creative decision",
  "Fast turnaround without sacrificing quality",
];

export default function AboutSnippet() {
  return (
    <section className="py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-surface">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Visual side */}
          <div className="relative order-2 lg:order-1">
            <div className="aspect-square max-w-md mx-auto rounded-2xl border border-gold/15 flex items-center justify-center relative overflow-hidden">
              {/* Background photo */}
              <Image
                src="/images/IMG_5103.png"
                alt=""
                fill
                className="object-cover object-center scale-110"
                aria-hidden="true"
              />
              {/* Dark overlay to keep text readable */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
              <div className="text-center p-8 relative z-10">
                <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <Image
                    src="/images/B6E31839-3169-4CE4-A5D6-A45D2ED27628.png"
                    alt="Brass Note Studios"
                    width={96}
                    height={96}
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="font-display text-2xl text-text-base mb-2">
                  Brass Note Studios
                </p>
                <p className="text-gold text-sm italic font-body">
                  Where Your Story Becomes a Song
                </p>
              </div>
            </div>
            {/* Decorative corner accent */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-gold/30 rounded-br-2xl pointer-events-none" />
            <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-gold/30 rounded-tl-2xl pointer-events-none" />
          </div>

          {/* Content side */}
          <div className="order-1 lg:order-2">
            <SectionHeading
              eyebrow="About Brass Note Studios"
              title="Music Crafted for Your Moment"
              subtitle="We're a songwriting and production studio that believes every story deserves its own soundtrack. From the first conversation to the final note, we're with you every step of the way."
              className="mb-8"
            />

            <ul className="flex flex-col gap-3 mb-8">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-gold mt-0.5 shrink-0" />
                  <span className="text-text-muted font-body text-sm leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            <Link
              href="/about"
              className="flex items-center gap-2 text-gold hover:text-gold-light font-body font-medium text-sm transition-colors group"
            >
              Read our full story{" "}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
