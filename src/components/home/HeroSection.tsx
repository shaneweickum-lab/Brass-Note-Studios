import Link from "next/link";
import FloatingParticles from "@/components/ui/FloatingParticles";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-navy-gradient" />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(201,168,76,0.12) 0%, transparent 70%)",
        }}
      />
      {/* Decorative rings */}
      <div className="absolute top-20 right-10 w-96 h-96 rounded-full border border-gold/5 pointer-events-none" />
      <div className="absolute top-32 right-24 w-64 h-64 rounded-full border border-gold/8 pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-80 h-80 rounded-full border border-gold/5 pointer-events-none" />

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
