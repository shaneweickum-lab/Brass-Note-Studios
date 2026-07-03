import Link from "next/link";
import Image from "next/image";
import FloatingParticles from "@/components/ui/FloatingParticles";
import HeroDesktopVideo from "./HeroDesktopVideo";

const HERO_VIDEO = "/videos/hero-desktop.mp4";
const HERO_MOBILE = "/images/IMG_5104.png";

export default function HeroSection() {
  return (
    <section id="hero-section" className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* Mobile background */}
      <Image
        src={HERO_MOBILE}
        alt="Saxophone with smoke rising and transforming into teal digital data streams"
        fill
        priority
        className="md:hidden"
        style={{ objectFit: "cover", objectPosition: "center" }}
      />

      {/* Desktop background */}
      <HeroDesktopVideo src={HERO_VIDEO} />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-background/65" />

      {/* Warm brass glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 50% at 50% 35%, rgba(201,168,76,0.10) 0%, transparent 70%)",
        }}
      />

      {/* Floating particles */}
      <FloatingParticles />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 text-center">

        {/* Eyebrow with flanking rules */}
        <div className="flex items-center justify-center gap-4 mb-10 animate-fade-in">
          <span className="h-px w-12 bg-gold/40" />
          <p className="font-display-sc text-gold text-[10px] uppercase tracking-[0.35em]">
            Brass Note Studios · Est. 2026
          </p>
          <span className="h-px w-12 bg-gold/40" />
        </div>

        {/* Split headline */}
        <h1 className="font-display leading-[1.0] mb-12 animate-slide-up">
          <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] text-text-base font-bold">
            Your Story.
          </span>
          <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] text-gold italic font-light">
            Preserved.
          </span>
        </h1>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
          <Link
            href="/contact"
            className="btn-gold-glow inline-flex items-center justify-center font-body font-normal tracking-[0.2em] uppercase transition-all duration-200 border border-gold/60 text-gold hover:bg-gold/8 hover:border-gold px-10 py-4 text-[11px] w-full sm:w-auto"
          >
            Commission Your Song
          </Link>
          <Link
            href="/music"
            className="inline-flex items-center justify-center font-body font-normal tracking-[0.2em] uppercase text-text-muted/60 hover:text-gold transition-colors duration-200 text-[11px] py-4"
          >
            Explore the Collection ↓
          </Link>
        </div>
      </div>
    </section>
  );
}
