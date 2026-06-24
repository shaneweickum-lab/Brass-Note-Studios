"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import FloatingParticles from "@/components/ui/FloatingParticles";
import GoldDivider from "@/components/ui/GoldDivider";
import SamCartModal, { SAMCART_URLS } from "@/components/ui/SamCartModal";
import { Music2, Mic2, BookOpen, Award, Zap } from "lucide-react";

/* ─── Data ───────────────────────────────────────────────── */


const ADVENTURE_PATHS = [
  { step: "1", label: "Choose Your Track", sub: "Songwriter or Producer" },
  { step: "2A", label: "Songwriting Foundations", sub: "Lyric · Structure · Arc" },
  { step: "2B", label: "Production Foundations", sub: "Sound · Tension · Syntax" },
  { step: "3", label: "The 10-Layer Framework", sub: "Core methodology" },
  { step: "4", label: "Symbol Mastery", sub: "8 undocumented symbols" },
  { step: "5", label: "Live Case Studies", sub: "Real commissions dissected" },
  { step: "6", label: "Capstone Project", sub: "Commission a real song" },
];

const CREDENTIALS = [
  { icon: <Award className="w-5 h-5" />, label: "30+ Years as a Musician", sub: "Songwriter, performer, arranger" },
  { icon: <Music2 className="w-5 h-5" />, label: "2 Studio Albums on Spotify", sub: "Original songs produced with Suno AI" },
  { icon: <Zap className="w-5 h-5" />, label: "Pioneer in Vocal Prompting", sub: "The method the AI community says is impossible" },
  { icon: <BookOpen className="w-5 h-5" />, label: "Commissions Across Industries", sub: "Personal, nonprofit, brand, creator" },
  { icon: <Mic2 className="w-5 h-5" />, label: "Brass Note Method Creator", sub: "The 10-layer prompting framework" },
];


const PRICING_TIERS = [
  {
    name: "Foundations",
    price: "Coming Soon",
    desc: "The 10-layer framework, explained in full. Everything you need to produce professional AI music from scratch.",
    features: ["10-Layer Framework deep dive", "Symbol reference guide", "Prompt templates", "Community access"],
    accent: false,
  },
  {
    name: "Masterclass",
    price: "Coming Soon",
    desc: "Live case studies, live feedback, and the full production methodology — including techniques the community says don't exist.",
    features: ["Everything in Foundations", "3 full case study breakdowns", "Live feedback sessions", "Private Discord channel", "Capstone project review"],
    accent: true,
  },
  {
    name: "Private Coaching",
    price: "Coming Soon",
    desc: "One-on-one sessions with Shane. Bring your current project. Leave with a working prompt stack.",
    features: ["1:1 sessions with Shane", "Real-time prompt building", "Project-specific guidance", "Lifetime resource access"],
    accent: false,
  },
];

/* ─── Waitlist Form ──────────────────────────────────────── */
function WaitlistForm() {
  const [form, setForm] = useState({ name: "", email: "", track: "" });
  const [done, setDone] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire to Formspree or email backend
    setDone(true);
  };

  if (done) {
    return (
      <div className="text-center py-8">
        <p className="text-gold font-display text-2xl mb-2">You&apos;re on the list.</p>
        <p className="text-text-muted font-body">I&apos;ll reach out when the Academy opens its doors.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md mx-auto">
      <input
        type="text"
        placeholder="Your name"
        required
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="w-full bg-surface border border-white/10 rounded-sm px-4 py-3 text-text-base font-body placeholder:text-text-muted focus:outline-none focus:border-gold/50 transition-colors"
      />
      <input
        type="email"
        placeholder="Your email"
        required
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="w-full bg-surface border border-white/10 rounded-sm px-4 py-3 text-text-base font-body placeholder:text-text-muted focus:outline-none focus:border-gold/50 transition-colors"
      />
      <select
        required
        value={form.track}
        onChange={(e) => setForm({ ...form, track: e.target.value })}
        className="w-full bg-surface border border-white/10 rounded-sm px-4 py-3 text-text-base font-body focus:outline-none focus:border-gold/50 transition-colors"
      >
        <option value="" disabled>Select your track</option>
        <option value="songwriting">Songwriting Track</option>
        <option value="production">Production Track</option>
        <option value="both">Both — I&apos;m all in</option>
      </select>
      <button
        type="submit"
        className="w-full bg-gold text-background font-body font-semibold tracking-wide rounded-sm px-6 py-3 hover:bg-gold-light transition-colors duration-200"
      >
        Join the Waitlist
      </button>
    </form>
  );
}

// Modal config per track
const MODAL_CONFIGS = {
  shore: { title: "The Shore", subtitle: "Foundations Track — Enroll or Join Waitlist", key: "shore" },
  weeds: { title: "In The Weeds", subtitle: "Advanced Track — Enroll or Join Waitlist", key: "weeds" },
  swamp: { title: "Wading in the Swamp", subtitle: "Elite Track — Enroll or Join Waitlist", key: "swamp" },
  email: { title: "Join the Waitlist", subtitle: "Early access & founding-member pricing", key: "emailCapture" },
} as const;

type ModalKey = keyof typeof MODAL_CONFIGS;

/* ─── Page ───────────────────────────────────────────────── */
export default function AcademyPage() {
  const [activeModal, setActiveModal] = useState<ModalKey | null>(null);

  const openModal = useCallback((key: ModalKey) => setActiveModal(key), []);
  const closeModal = useCallback(() => setActiveModal(null), []);

  const activeConfig = activeModal ? MODAL_CONFIGS[activeModal] : null;

  return (
    <>
      {/* SamCart Modals */}
      {activeConfig && (
        <SamCartModal
          isOpen={!!activeModal}
          onClose={closeModal}
          title={activeConfig.title}
          subtitle={activeConfig.subtitle}
          checkoutUrl={SAMCART_URLS[activeConfig.key]}
        />
      )}

      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <Image
          src="/images/IMG_5102.png"
          alt="Empty jazz club stage with a glowing tablet on a music stand and teal holographic notation"
          fill
          priority
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
        <div className="absolute inset-0" style={{ background: "rgba(10,14,26,0.72)" }} />
        <FloatingParticles />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 text-center">
          <p className="text-gold font-body text-xs uppercase tracking-[0.3em] font-semibold mb-6">
            Brass Syntax Academy
          </p>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl text-text-base leading-[1.05] mb-6">
            Learn to Speak{" "}
            <span className="text-gold italic">Music.</span>
          </h1>
          <p className="text-text-muted font-body text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-8">
            The first academy built on the Brass Note Method — a 30-year musicianship framework
            translated into the language AI models actually understand.
          </p>

          {/* Stat pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            {["Songwriting Track", "Production Track", "1-on-1 Coaching"].map((p) => (
              <span
                key={p}
                className="inline-flex items-center px-4 py-1.5 rounded-full border border-gold/30 text-gold font-body text-sm font-medium bg-gold/5"
              >
                {p}
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => openModal("email")}
              className="inline-flex items-center justify-center font-body font-semibold tracking-wide bg-gold text-background hover:bg-gold-light rounded-sm px-8 py-4 text-lg transition-colors duration-200 w-full sm:w-auto"
            >
              Join the Waitlist
            </button>
            <Link
              href="/method"
              className="inline-flex items-center justify-center font-body font-semibold tracking-wide border border-gold text-gold hover:bg-gold/10 rounded-sm px-8 py-4 text-lg transition-colors duration-200 w-full sm:w-auto"
            >
              See the Method
            </Link>
          </div>
        </div>
      </section>

      {/* What You'll Learn — Florida Swamp Meter */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-surface">
        <div className="max-w-7xl mx-auto">

          {/* Section header */}
          <div className="text-center mb-14">
            <p className="text-teal font-body text-xs uppercase tracking-[0.25em] font-semibold mb-3">
              The Choose-Your-Depth Tracks
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-gold mb-6">
              How Deep Are You Willing to Wade?
            </h2>
            <p className="text-text-base font-body text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
              Generative audio can feel like an uncharted swamp. The platform documentation says you don&apos;t need to be a musician or an engineer, but reaching professional-grade, repeatable art requires steering the model with intention. We&apos;ve mapped out three distinct pathways through the text matrix. Pick your gear and choose your depth — whether you want to stay dry on The Shore, get your hands dirty In The Weeds, or go full-on Wading in the Swamp to uncover the deepest architectural secrets of the engine.
            </p>
          </div>

          {/* Three-card grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">

            {/* ── Card 1: The Shore ─────────────────────── */}
            <div className="bg-surface-elevated border border-white/8 rounded-lg p-8 flex flex-col relative transition-all duration-300 hover:border-gold/50 hover:shadow-[0_0_24px_rgba(212,168,67,0.18)]">
              <div className="flex items-center gap-2.5 mb-6">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-gold block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white/20 block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white/20 block" />
                </div>
                <span className="text-teal font-body text-[10px] uppercase tracking-[0.18em] font-semibold">Level 01</span>
              </div>
              <h3 className="font-display text-2xl text-gold mb-0.5">The Shore</h3>
              <p className="text-text-muted font-body text-xs uppercase tracking-[0.12em] font-semibold mb-6">The Lightweight Pass</p>

              <dl className="flex flex-col gap-4 flex-1 text-sm">
                <div>
                  <dt className="text-teal font-body text-[10px] uppercase tracking-[0.15em] font-semibold mb-1">Focus</dt>
                  <dd className="text-text-base font-body leading-relaxed">Foundations of songwriting, basic studio arrangement, and a high-level practical introduction to the 10-layer prompting method.</dd>
                </div>
                <div>
                  <dt className="text-teal font-body text-[10px] uppercase tracking-[0.15em] font-semibold mb-1">For</dt>
                  <dd className="text-text-muted font-body leading-relaxed">Traditional writers, hobbyists, and creatives who want clean, reliable tracks without getting stuck in the technical mud.</dd>
                </div>
                <div>
                  <dt className="text-teal font-body text-[10px] uppercase tracking-[0.15em] font-semibold mb-1">Homework</dt>
                  <dd className="text-text-muted font-body">Essential structure and song flow.</dd>
                </div>
              </dl>

              <button
                onClick={() => openModal("shore")}
                className="mt-8 inline-flex items-center justify-center w-full font-body font-semibold tracking-wide border border-gold text-gold hover:bg-gold hover:text-background rounded-sm px-6 py-3 text-sm transition-all duration-200"
              >
                Join The Shore Waitlist
              </button>
            </div>

            {/* ── Card 2: In The Weeds ──────────────────── */}
            <div className="bg-surface-elevated border border-white/8 rounded-lg p-8 flex flex-col relative transition-all duration-300 hover:border-teal/50 hover:shadow-[0_0_24px_rgba(13,148,136,0.22)]">
              <span className="absolute top-4 right-4 inline-flex items-center px-2.5 py-1 rounded-full bg-teal/10 border border-teal/30 text-teal font-body text-[10px] font-semibold uppercase tracking-[0.1em]">
                Advanced Track
              </span>

              <div className="flex items-center gap-2.5 mb-6">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-gold block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-teal block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white/20 block" />
                </div>
                <span className="text-teal font-body text-[10px] uppercase tracking-[0.18em] font-semibold">Level 02</span>
              </div>
              <h3 className="font-display text-2xl text-gold mb-0.5">In The Weeds</h3>
              <p className="text-text-muted font-body text-xs uppercase tracking-[0.12em] font-semibold mb-6">The Mid-Tier Pass</p>

              <dl className="flex flex-col gap-4 flex-1 text-sm">
                <div>
                  <dt className="text-teal font-body text-[10px] uppercase tracking-[0.15em] font-semibold mb-1">Focus</dt>
                  <dd className="text-text-base font-body leading-relaxed">Deep dive into text-formatting rules and lyrical syntax. Focuses heavily on inserting bracketed section tags, carets (^), and syllable pacing rules to force breath marks and sudden dynamic adjustments out of the engine.</dd>
                </div>
                <div>
                  <dt className="text-teal font-body text-[10px] uppercase tracking-[0.15em] font-semibold mb-1">For</dt>
                  <dd className="text-text-muted font-body leading-relaxed">Creators who want to systematically eliminate random variations in vocal cadence and song pacing.</dd>
                </div>
                <div>
                  <dt className="text-teal font-body text-[10px] uppercase tracking-[0.15em] font-semibold mb-1">Homework</dt>
                  <dd className="text-text-muted font-body">Master the required &ldquo;Syntax Placement&rdquo; labs.</dd>
                </div>
              </dl>

              <button
                onClick={() => openModal("weeds")}
                className="mt-8 inline-flex items-center justify-center w-full font-body font-semibold tracking-wide border border-teal text-teal hover:bg-teal hover:text-background rounded-sm px-6 py-3 text-sm transition-all duration-200"
              >
                Join The Weeds Waitlist
              </button>
            </div>

            {/* ── Card 3: Wading in the Swamp — dual gradient border ── */}
            <div
              className="rounded-lg transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,168,67,0.2),0_0_30px_rgba(13,148,136,0.2)]"
              style={{ padding: "1.5px", background: "linear-gradient(135deg, #D4A843 0%, #0D9488 100%)" }}
            >
              <div className="bg-surface-elevated rounded-[6px] p-8 flex flex-col h-full relative">
                <span
                  className="absolute top-4 right-4 inline-flex items-center px-2.5 py-1 rounded-full font-body text-[10px] font-semibold uppercase tracking-[0.1em]"
                  style={{
                    background: "linear-gradient(135deg, rgba(212,168,67,0.12) 0%, rgba(13,148,136,0.12) 100%)",
                    border: "1px solid rgba(212,168,67,0.4)",
                    color: "#D4A843",
                  }}
                >
                  Elite Track
                </span>

                <div className="flex items-center gap-2.5 mb-6">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-gold block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-teal block" />
                    <span className="w-2.5 h-2.5 rounded-full block" style={{ background: "linear-gradient(135deg, #D4A843, #0D9488)" }} />
                  </div>
                  <span className="text-teal font-body text-[10px] uppercase tracking-[0.18em] font-semibold">Level 03</span>
                </div>
                <h3 className="font-display text-2xl text-gold mb-0.5">Wading in the Swamp</h3>
                <p className="text-text-muted font-body text-xs uppercase tracking-[0.12em] font-semibold mb-6">The Full-On Depth Pass</p>

                <dl className="flex flex-col gap-4 flex-1 text-sm">
                  <div>
                    <dt className="text-teal font-body text-[10px] uppercase tracking-[0.15em] font-semibold mb-1">Focus</dt>
                    <dd className="text-text-base font-body leading-relaxed">Absolute architectural immersion. Deep in the weeds on both advanced songwriting arrangement and extreme prompt engineering. Unlocks the &ldquo;Blind Replication Labs&rdquo; — learning to reverse-engineer master audio files, isolate hidden mix tokens from complex genre grids, and shatter token matrix blocks to treat the prompt box like a programmable synthesizer.</dd>
                  </div>
                  <div>
                    <dt className="text-teal font-body text-[10px] uppercase tracking-[0.15em] font-semibold mb-1">For</dt>
                    <dd className="text-text-muted font-body leading-relaxed">Power-users and audio engineers demanding absolute repeatable control over the generative text-matrix.</dd>
                  </div>
                  <div>
                    <dt className="text-teal font-body text-[10px] uppercase tracking-[0.15em] font-semibold mb-1">Homework</dt>
                    <dd className="text-text-muted font-body">Complete structural reconstruction and reverse-engineering labs.</dd>
                  </div>
                </dl>

                <button
                  onClick={() => openModal("swamp")}
                  className="mt-8 inline-flex items-center justify-center w-full font-body font-semibold tracking-wide rounded-sm px-6 py-3 text-sm text-background transition-all duration-200 hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #D4A843 0%, #0D9488 100%)" }}
                >
                  Join The Swamp Waitlist
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      <GoldDivider className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" />

      {/* Choose Your Adventure */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-gold font-body text-xs uppercase tracking-[0.2em] font-semibold mb-3">
              Your Path
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-text-base">
              Choose Your Own Adventure
            </h2>
          </div>

          {/* Simple vertical path diagram */}
          <div className="flex flex-col items-center gap-0">
            {/* Step 1 */}
            <div className="bg-surface border border-gold/20 rounded-sm px-6 py-4 text-center w-56">
              <span className="text-gold font-body text-xs font-semibold">STEP {ADVENTURE_PATHS[0].step}</span>
              <p className="text-text-base font-display text-lg">{ADVENTURE_PATHS[0].label}</p>
              <p className="text-text-muted font-body text-xs">{ADVENTURE_PATHS[0].sub}</p>
            </div>
            <div className="w-px h-6 bg-gold/20" />
            {/* Fork */}
            <div className="grid grid-cols-2 gap-6 w-full max-w-md">
              {[ADVENTURE_PATHS[1], ADVENTURE_PATHS[2]].map((p) => (
                <div key={p.step} className="flex flex-col items-center gap-0">
                  <div className="bg-surface border border-white/10 rounded-sm px-4 py-3 text-center w-full">
                    <span className="text-gold font-body text-xs font-semibold">STEP {p.step}</span>
                    <p className="text-text-base font-display text-base leading-tight">{p.label}</p>
                    <p className="text-text-muted font-body text-xs">{p.sub}</p>
                  </div>
                  <div className="w-px h-6 bg-gold/20" />
                </div>
              ))}
            </div>
            {/* Rejoin */}
            {ADVENTURE_PATHS.slice(3).map((p, i) => (
              <div key={p.step} className="flex flex-col items-center gap-0">
                <div className={`bg-surface border rounded-sm px-6 py-4 text-center w-56 ${i === ADVENTURE_PATHS.slice(3).length - 1 ? "border-gold/30 bg-gold/5" : "border-white/10"}`}>
                  <span className="text-gold font-body text-xs font-semibold">STEP {p.step}</span>
                  <p className="text-text-base font-display text-lg">{p.label}</p>
                  <p className="text-text-muted font-body text-xs">{p.sub}</p>
                </div>
                {i < ADVENTURE_PATHS.slice(3).length - 1 && <div className="w-px h-6 bg-gold/20" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      <GoldDivider className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" />

      {/* Instructor */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-gold font-body text-xs uppercase tracking-[0.2em] font-semibold mb-3">
              Your Instructor
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-text-base mb-4">
              Shane Weickum
            </h2>
            <p className="text-text-muted font-body max-w-xl mx-auto leading-relaxed">
              Musician. Songwriter. Brass Note Studios founder. Thirty years of professional musicianship
              translated into a framework anyone can learn.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 items-start">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CREDENTIALS.map(({ icon, label, sub }) => (
                <div
                  key={label}
                  className="flex items-start gap-4 bg-surface-elevated border border-white/5 rounded-sm p-5"
                >
                  <div className="w-9 h-9 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold shrink-0">
                    {icon}
                  </div>
                  <div>
                    <p className="text-text-base font-body font-semibold text-sm">{label}</p>
                    <p className="text-text-muted font-body text-xs mt-0.5">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="hidden lg:block shrink-0">
              <Image
                src="/images/IMG_5105.png"
                alt="A weathered saxophone under a single warm spotlight — thirty years of musicianship"
                width={400}
                height={520}
                loading="lazy"
                className="rounded-lg shadow-2xl shadow-black/60"
                style={{ objectFit: "cover", maxWidth: "400px" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing preview */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-gold font-body text-xs uppercase tracking-[0.2em] font-semibold mb-3">
              Pricing
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-text-base mb-4">
              Invest in the Method
            </h2>
            <p className="text-text-muted font-body max-w-xl mx-auto">
              Exact pricing will be announced at launch. Join the waitlist for early-access pricing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRICING_TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-sm p-8 flex flex-col border ${
                  tier.accent
                    ? "border-gold/40 bg-gold/5"
                    : "border-white/5 bg-surface-elevated"
                }`}
              >
                {tier.accent && (
                  <span className="text-gold font-body text-xs uppercase tracking-[0.2em] font-semibold mb-3">
                    Most Popular
                  </span>
                )}
                <h3 className="font-display text-2xl text-text-base mb-2">{tier.name}</h3>
                <p className="text-gold font-body font-semibold text-lg mb-4">{tier.price}</p>
                <p className="text-text-muted font-body text-sm leading-relaxed mb-6">{tier.desc}</p>
                <ul className="flex flex-col gap-2 mb-8 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm font-body text-text-muted">
                      <span className="text-gold mt-0.5">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => openModal("email")}
                  className={`inline-flex items-center justify-center font-body font-semibold tracking-wide rounded-sm px-6 py-3 text-sm transition-colors duration-200 ${
                    tier.accent
                      ? "bg-gold text-background hover:bg-gold-light"
                      : "border border-gold text-gold hover:bg-gold/10"
                  }`}
                >
                  Join Waitlist
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Waitlist */}
      <section id="waitlist" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden min-h-[500px] flex items-center">
        <Image
          src="/images/IMG_5108.png"
          alt="A dark hallway with a warm brass light glowing through an open door at the end"
          fill
          loading="lazy"
          style={{ objectFit: "cover" }}
        />
        <div className="absolute inset-0" style={{ background: "rgba(10,14,26,0.82)" }} />
        <div className="max-w-2xl mx-auto text-center relative z-10 w-full">
          <p className="text-gold font-body text-xs uppercase tracking-[0.2em] font-semibold mb-4">
            Be First
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-text-base mb-4">
            Join the Waitlist
          </h2>
          <p className="text-text-muted font-body leading-relaxed mb-10">
            The Academy isn&apos;t open yet — but when it does, waitlist members get early access
            and founding-member pricing. Drop your email and tell me which track interests you.
          </p>
          <WaitlistForm />
        </div>
      </section>
    </>
  );
}
