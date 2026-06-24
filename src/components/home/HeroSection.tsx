import Link from "next/link";
import Image from "next/image";
import FloatingParticles from "@/components/ui/FloatingParticles";
import HeroPingPongVideo from "./HeroPingPongVideo";

// ─── Hero media paths ─────────────────────────────────────────────────────────
const HERO_VIDEO = "/videos/hero-desktop.mp4";   // desktop looping video
const HERO_MOBILE = "/images/IMG_5104.png";       // mobile static image
// ─────────────────────────────────────────────────────────────────────────────

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* Mobile background — portrait image, hidden on md+ */}
      <Image
        src={HERO_MOBILE}
        alt="Saxophone with smoke rising and transforming into teal digital data streams"
        fill
        priority
        className="md:hidden"
        style={{ objectFit: "cover", objectPosition: "center" }}
      />

      {/* Desktop background — ping-pong video, hidden below md */}
      <HeroPingPongVideo src={HERO_VIDEO} />

      {/* Dark overlay so text stays legible */}
      <div className="absolute inset-0 bg-background/60" />

      {/* Warm brass glow */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(212,168,67,0.18) 0%, transparent 70%)",
        }}
      />

      {/* Floating particles */}
      <FloatingParticles />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 text-center">
        <p className="text-gold font-body text-sm uppercase tracking-[0.3em] font-semibold mb-6 animate-fade-in">
          Custom Songwriting &amp; Production
        </p>

        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-text-base leading-[1.05] mb-6 animate-slide-up">
          Brass Note
          <br />
          <span className="text-gold italic">Studios</span>
        </h1>

        <p className="text-text-muted font-body text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10 animate-slide-up">
          Bring your story to life through music. I write and produce custom
          songs for individuals, organizations, and brands — every song crafted
          with heart and delivered with professional quality.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center font-body font-semibold tracking-wide transition-all duration-200 bg-gold text-background hover:bg-gold-light rounded-sm px-8 py-4 text-lg w-full sm:w-auto"
          >
            Commission a Song
          </Link>
          <Link
            href="/music"
            className="inline-flex items-center justify-center font-body font-semibold tracking-wide transition-all duration-200 border border-gold text-gold hover:bg-gold/10 rounded-sm px-8 py-4 text-lg w-full sm:w-auto"
          >
            Hear Our Work
          </Link>
        </div>
      </div>
    </section>
  );
}
