"use client";

import { useState } from "react";
import Link from "next/link";
import FloatingParticles from "@/components/ui/FloatingParticles";
import GoldDivider from "@/components/ui/GoldDivider";
import { Music2, Mic2, BookOpen, Award, Zap } from "lucide-react";

/* ─── Data ───────────────────────────────────────────────── */

const LEARN_PATHS = [
  {
    icon: <Music2 className="w-6 h-6" />,
    title: "The Songwriting Track",
    desc: "Master lyric architecture, emotional structure, and narrative songwriting — then learn to translate that craft into AI-readable prompt language.",
    bullets: [
      "Lyric structure & narrative arc",
      "Chord-emotion mapping",
      "The 10-Layer prompt framework",
      "Building vocal characters through language",
    ],
  },
  {
    icon: <Mic2 className="w-6 h-6" />,
    title: "The Production Track",
    desc: "Learn how professional producers think about sound — and how to encode that thinking into syntax the model understands perfectly.",
    bullets: [
      "Tension arc engineering",
      "Negative prompting & constraint control",
      "Vocal replacement techniques",
      "The 8 undocumented symbols",
    ],
  },
];

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

/* ─── Page ───────────────────────────────────────────────── */
export default function AcademyPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[75vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-navy-gradient" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(26,107,138,0.2) 0%, transparent 70%)",
          }}
        />
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
            <a
              href="#waitlist"
              className="inline-flex items-center justify-center font-body font-semibold tracking-wide bg-gold text-background hover:bg-gold-light rounded-sm px-8 py-4 text-lg transition-colors duration-200 w-full sm:w-auto"
            >
              Join the Waitlist
            </a>
            <Link
              href="/method"
              className="inline-flex items-center justify-center font-body font-semibold tracking-wide border border-gold text-gold hover:bg-gold/10 rounded-sm px-8 py-4 text-lg transition-colors duration-200 w-full sm:w-auto"
            >
              See the Method
            </Link>
          </div>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-gold font-body text-xs uppercase tracking-[0.2em] font-semibold mb-3">
              Curriculum
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-text-base">
              What You&apos;ll Learn
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {LEARN_PATHS.map((path) => (
              <div
                key={path.title}
                className="bg-surface-elevated border border-white/5 rounded-sm p-8"
              >
                <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold mb-5">
                  {path.icon}
                </div>
                <h3 className="font-display text-2xl text-text-base mb-3">{path.title}</h3>
                <p className="text-text-muted font-body leading-relaxed mb-5">{path.desc}</p>
                <ul className="flex flex-col gap-2">
                  {path.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm font-body text-text-muted">
                      <span className="text-gold mt-0.5">→</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Full Method Track */}
          <div className="bg-surface-elevated border border-gold/25 rounded-sm p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gold-gradient" />
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold shrink-0">
                  <Music2 className="w-6 h-6" />
                </div>
                <h3 className="font-display text-2xl text-text-base">The Full Method Track</h3>
              </div>
              <span className="text-gold font-body text-xs uppercase tracking-[0.15em] font-semibold shrink-0 sm:mt-2">Both Paths</span>
            </div>
            <p className="text-text-muted font-body leading-relaxed mb-5">
              Both tracks taken together as one complete path through the Brass Note Method. Songwriting craft and production technique taught simultaneously — the way they work in practice, not in isolation.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                "Everything in the Songwriting Track",
                "Everything in the Production Track",
                "Cross-track integration sessions",
                "Full method applied to a real commission",
              ].map((b) => (
                <li key={b} className="flex items-start gap-2 text-sm font-body text-text-muted">
                  <span className="text-gold mt-0.5">→</span>
                  {b}
                </li>
              ))}
            </ul>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                <a
                  href="#waitlist"
                  className={`inline-flex items-center justify-center font-body font-semibold tracking-wide rounded-sm px-6 py-3 text-sm transition-colors duration-200 ${
                    tier.accent
                      ? "bg-gold text-background hover:bg-gold-light"
                      : "border border-gold text-gold hover:bg-gold/10"
                  }`}
                >
                  Join Waitlist
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Waitlist */}
      <section id="waitlist" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
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
