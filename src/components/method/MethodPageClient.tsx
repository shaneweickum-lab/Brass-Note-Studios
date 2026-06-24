"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Lock } from "lucide-react";

/* ─── Tier 1 — Ten Layers ────────────────────────────────── */
const TEN_LAYERS = [
  { num: "01", name: "Genre", governs: "The broad sonic world of the track. More than a label — a behavioral directive that shapes every decision the model makes downstream." },
  { num: "02", name: "Sub-Genre", governs: "The specific pocket within the genre. Narrows the model's creative space to a precise stylistic zone." },
  { num: "03", name: "Vocal Character", governs: "The complete identity of the singer — range, texture, skill level, and tonal personality. This layer has more variables than any other, and most prompts use fewer than half of them." },
  { num: "04", name: "Tempo", governs: "The precise rhythmic heartbeat. Not fast, not slow — a number. And the number is not arbitrary." },
  { num: "05", name: "Time Signature", governs: "The felt meter of the track. This layer is absent from virtually every published Suno prompting guide. Its absence is why most AI music feels rhythmically flat." },
  { num: "06", name: "Tension Arc", governs: "The emotional journey of the instrumentation — separate from mood, separate from genre. This is the architectural directive for how the arrangement breathes over time." },
  { num: "07", name: "Vocal Mood", governs: "The singer's internal emotional state — distinct from the tension arc. Tension governs the instruments. Mood governs the voice. They are not the same instruction." },
  { num: "08", name: "Negative Prompting", governs: "The most misunderstood layer. Standard negative prompting restricts. The Brass Note Method uses this layer differently — in a way that changes what the model can produce." },
  { num: "09", name: "Weirdness", governs: "The model's deviation parameter. Its role in the framework is specific, its default setting is deliberate, and its interaction with Layer 10 is not obvious." },
  { num: "10", name: "Constraint", governs: "The compliance parameter. Always set the same way. The reason why is the foundation of the entire method." },
];

/* ─── Tier 2 — Symbols ───────────────────────────────────── */
const SYMBOLS_PUBLIC = [
  {
    sym: "...",
    what: "Creates a pause or rest in the vocal delivery. The model interprets this as a silence instruction — but the duration, behavior, and musical context of that silence is specific to how it's used within the framework.",
  },
  {
    sym: "(( ))",
    what: "Words placed inside this symbol receive a different vocal treatment — a hushed, intimate delivery distinct from the main vocal line. How and when to use it is what changes results.",
  },
];

const SYMBOLS_LOCKED = [
  "Controls metered silence with rhythmic precision — different from the pause symbol in ways that matter to groove and feel.",
  "Signals a shift in vocal direction — not a pause, not a breath, but a change in thought that the model renders as a physical performance event.",
  "Forces a specific physical vocal sound that no other prompt element can produce. Audible in the output on every generation.",
  "An alternate form of the previous symbol. Same behavior, different typographic application — used in specific contexts within the lyric structure.",
  "Breaks a word and adds something to the break that a hyphen cannot. The difference between a split and a performance.",
  "Alters how the neural network processes specific syllables — affecting rendering smoothness on complex phonetic patterns.",
];

/* ─── Case Studies ───────────────────────────────────────── */
const CASE_STUDIES = [
  {
    num: "Case Study 01",
    title: "The A Cappella Breakthrough",
    wikiQuote: "Many music producers are struggling to consistently create clean acapella tracks using Suno AI. Even with specific prompts like 'acapella' or 'only vocal,' the results often include background noise or instruments.",
    wikiSource: "Suno AI Wiki, sunoaiwiki.com · June 2024",
    result: "The community's own documentation confirms what every serious Suno user already knows: clean a cappella — voices only, zero instrument bleed — is not reliably achievable through standard prompting. The recommended fix is external post-processing: stem separation tools, vocal isolation software, multiple processing passes. Suno's own technical notes acknowledge that users should expect bleed between stems. Using the Brass Note Method on Suno v5.5, a complete eight-part a cappella arrangement was produced — male tenor lead, female quartet, vocal bass, vocal percussion, mouth clicks — with zero instrument bleed. No external tools. No post-processing. Clean through prompting alone. Consistently, across multiple generations.",
  },
  {
    num: "Case Study 02",
    title: "The Vocal Symphony",
    wikiQuote: "Sometimes, even with the right prompts, you might get a mix of vocals and instruments. Consistent testing and tweaking of prompts are necessary. Version 3 does acapella half of the time but not always. I am yet to get 3.5 to do purely vocals. Highly frustrating.",
    wikiSource: "Suno AI Wiki community documentation · sunoaiwiki.com",
    result: "The frustration documented above is real and widespread. Even experienced producers cannot reliably get Suno to produce purely vocal output — across any version. The Brass Note Method's third tier addresses this at a level the community has not reached: not by restricting the model from using instruments, but by replacing every instrument role with a phonetic vocal description before the model can reach for one. The result on Suno v5.5: a complete vocal symphony. Eleven distinct instrument roles — bass, rhythm guitar, lead guitar, crash cymbal, snare, hi-hat, wah effects — each rendered entirely by human voices. Audible breath and lip sounds throughout, confirming the model produced physically human performance rather than synthesized approximation. Consistent output. Nearly every generation.",
  },
];

/* ─── Lock Block ─────────────────────────────────────────── */
function LockBlock({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 bg-background border-l-4 border-red-500/70 rounded-r-lg px-5 py-4 mt-8">
      <Lock className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
      <p className="text-text-muted font-body text-sm leading-relaxed">{children}</p>
    </div>
  );
}

/* ─── Component ──────────────────────────────────────────── */
export default function MethodPageClient() {
  const [activeTab, setActiveTab] = useState("tier1");
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistDone, setWaitlistDone] = useState(false);

  const tierRefs = {
    tier1: useRef<HTMLElement>(null),
    tier2: useRef<HTMLElement>(null),
    tier3: useRef<HTMLElement>(null),
    casestudies: useRef<HTMLElement>(null),
  };

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    Object.entries(tierRefs).forEach(([key, ref]) => {
      if (!ref.current) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveTab(key); },
        { threshold: 0.2 }
      );
      obs.observe(ref.current);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      {/* ── What the Method Is ──────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-surface">
        <div className="max-w-3xl mx-auto">
          <p className="text-gold font-body text-xs uppercase tracking-[0.2em] font-semibold mb-4">
            What the Method Is
          </p>
          <p className="text-text-muted font-body leading-relaxed mb-5">
            The Brass Note Method is a three-tier proprietary framework for AI music production using Suno AI. It was developed through systematic reverse engineering of high-performing prompts — not through theory, but through results. Tracks produced with the method consistently achieve what the Suno community considers unreliable or impossible through standard prompting approaches.
          </p>
          <p className="text-text-muted font-body leading-relaxed mb-5">
            The method operates at three distinct levels simultaneously. The first tier governs the architecture of the entire track — the macro-level decisions that shape everything before a lyric is written. The second tier governs individual vocal performance moments — controlling breath, pause, emotional color, and syllabic rendering at the micro level. The third tier operates at the neural level — a technique for bypassing the model's instrumental training associations to force purely vocal output in ways the community has not documented.
          </p>
          <p className="text-text-base font-body leading-relaxed font-medium">
            No other published Suno framework addresses all three tiers. Most address one, partially.
          </p>
        </div>
      </section>

      {/* ── Sticky Tier Navigation ───────────────────────────── */}
      <div className="sticky top-16 md:top-20 z-40 bg-surface border-b border-gold/10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto hide-scrollbar">
            {[
              { id: "tier1", label: "TIER 1: The Ten Layers" },
              { id: "tier2", label: "TIER 2: Lyrical Syntax" },
              { id: "tier3", label: "TIER 3: Neural Bypass" },
              { id: "casestudies", label: "Case Studies" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => scrollTo(tab.id)}
                className={`whitespace-nowrap px-5 py-4 font-body text-xs font-semibold uppercase tracking-[0.12em] transition-all border-b-2 ${
                  activeTab === tab.id
                    ? "text-background bg-gold border-gold"
                    : "text-text-muted border-transparent hover:text-gold hover:border-gold/30"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tier 1: Ten Layers ───────────────────────────────── */}
      <section ref={tierRefs.tier1} id="tier1" className="scroll-mt-32 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-gold font-body text-xs uppercase tracking-[0.2em] font-semibold mb-2">
            TIER 1 — ARCHITECTURAL DECISIONS
          </p>
          <h2 className="font-display text-3xl md:text-4xl text-text-base mb-4">
            The Ten-Layer Framework
          </h2>
          <p className="text-text-muted font-body leading-relaxed max-w-2xl mb-3">
            Every track built with the Brass Note Method begins with ten architectural decisions. These are not suggestions or a checklist — they are a sequential framework where each layer builds on the previous one, and the absence of any single layer creates a gap the model will fill on its own terms.
          </p>
          <p className="text-text-muted font-body leading-relaxed max-w-2xl mb-10">
            The order matters. The specificity matters. The relationship between layers matters. How they interact is what the masterclass teaches.
          </p>

          {/* Mobile: stacked cards */}
          <div className="flex flex-col gap-3 md:hidden mb-8">
            {TEN_LAYERS.map((layer) => (
              <div key={layer.num} className="bg-surface rounded-lg border border-white/5 p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-start gap-3">
                    <span className="font-display text-2xl text-gold shrink-0 leading-none">{layer.num}</span>
                    <span className="font-body font-semibold text-text-base mt-0.5">{layer.name}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-900/20 border border-red-500/30 text-red-400 text-xs font-body font-semibold whitespace-nowrap shrink-0">
                    <Lock className="w-3 h-3" /> Masterclass
                  </span>
                </div>
                <p className="text-text-muted text-sm leading-relaxed">{layer.governs}</p>
              </div>
            ))}
          </div>

          {/* Desktop: table */}
          <div className="hidden md:block rounded-lg border border-white/8 overflow-hidden mb-8">
            <div className="grid grid-cols-[48px_140px_1fr_160px] bg-surface-elevated px-6 py-3 border-b border-white/8 gap-4">
              <span className="text-gold font-body text-xs uppercase tracking-[0.12em] font-semibold">#</span>
              <span className="text-gold font-body text-xs uppercase tracking-[0.12em] font-semibold">Layer</span>
              <span className="text-gold font-body text-xs uppercase tracking-[0.12em] font-semibold">What It Governs</span>
              <span className="text-gold font-body text-xs uppercase tracking-[0.12em] font-semibold">Application</span>
            </div>
            {TEN_LAYERS.map((layer, i) => (
              <div
                key={layer.num}
                className={`grid grid-cols-[48px_140px_1fr_160px] items-start px-6 py-4 border-b border-white/5 last:border-0 gap-4 ${
                  i % 2 === 0 ? "bg-surface" : "bg-surface/60"
                }`}
              >
                <span className="font-display text-xl text-gold leading-tight">{layer.num}</span>
                <span className="font-body font-semibold text-text-base text-sm pt-0.5">{layer.name}</span>
                <span className="text-text-muted font-body text-sm leading-relaxed">{layer.governs}</span>
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-red-900/20 border border-red-500/30 text-red-400 text-xs font-body font-semibold self-start">
                  <Lock className="w-3 h-3 shrink-0" /> In Masterclass
                </span>
              </div>
            ))}
          </div>

          <LockBlock>
            The specific parameters, ordering logic, interaction rules, and application methodology for each layer are proprietary to the Brass Note Method and are taught exclusively inside Brass Syntax Academy.
          </LockBlock>
        </div>
      </section>

      {/* ── Tier 2: Lyrical Syntax ──────────────────────────── */}
      <section ref={tierRefs.tier2} id="tier2" className="scroll-mt-32 py-20 px-4 sm:px-6 lg:px-8 bg-surface">
        <div className="max-w-7xl mx-auto">
          <p className="text-gold font-body text-xs uppercase tracking-[0.2em] font-semibold mb-2">
            TIER 2 — PERFORMANCE DECISIONS
          </p>
          <h2 className="font-display text-3xl md:text-4xl text-text-base mb-4">
            The Undocumented Lyrical Syntax
          </h2>
          <p className="text-text-muted font-body leading-relaxed max-w-2xl mb-4">
            Standard Suno prompting controls the track at the macro level — genre, mood, instrumentation. What it doesn't control is the performance moment. The breath before a phrase. The pause between thoughts. The whisper beneath a declaration. The vocal modulation on a single syllable.
          </p>
          <p className="text-text-muted font-body leading-relaxed max-w-2xl mb-4">
            Through systematic stress testing of Suno v5.5's lyrical processing engine, I discovered a set of symbols that operate at the micro level of vocal performance — controlling elements of delivery that no published guide addresses. These symbols are not documented in Suno's official resources. They are not in the community wikis. They were found by testing, confirmed through repetition, and verified across multiple genres.
          </p>
          <p className="text-text-base font-body font-medium mb-10">
            Eight symbols. Each one repeatable. Each one confirmed on Suno v5.5 as of June 2026.
          </p>

          {/* Symbol table — mobile */}
          <div className="flex flex-col gap-3 md:hidden mb-8">
            {/* Public symbols */}
            {SYMBOLS_PUBLIC.map((sym) => (
              <div key={sym.sym} className="bg-surface-elevated rounded-lg border border-white/8 p-4">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <code className="font-mono text-xl text-gold font-bold">{sym.sym}</code>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-900/20 border border-emerald-500/30 text-emerald-400 text-xs font-body font-semibold">
                    ✓ Public
                  </span>
                </div>
                <p className="text-text-muted font-body text-sm leading-relaxed">{sym.what}</p>
              </div>
            ))}
            {/* Redacted symbols */}
            {SYMBOLS_LOCKED.map((desc, i) => (
              <div key={i} className="bg-surface-elevated rounded-lg border border-white/5 p-4 opacity-60">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <span
                    className="font-mono text-xl font-bold select-none"
                    style={{ filter: "blur(6px)", color: "#C9A84C", userSelect: "none" }}
                    aria-hidden="true"
                  >
                    ████
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-900/20 border border-red-500/30 text-red-400 text-xs font-body font-semibold">
                    <Lock className="w-3 h-3" /> Masterclass
                  </span>
                </div>
                <p
                  className="font-body text-sm leading-relaxed select-none"
                  style={{ filter: "blur(4px)", color: "#8A9BB0", userSelect: "none" }}
                  aria-hidden="true"
                >
                  {desc}
                </p>
              </div>
            ))}
          </div>

          {/* Symbol table — desktop */}
          <div className="hidden md:block rounded-lg border border-white/8 overflow-hidden mb-8">
            <div className="grid grid-cols-[120px_1fr_160px] bg-surface-elevated px-6 py-3 border-b border-white/8 gap-6">
              <span className="text-gold font-body text-xs uppercase tracking-[0.12em] font-semibold">Symbol</span>
              <span className="text-gold font-body text-xs uppercase tracking-[0.12em] font-semibold">What It Controls</span>
              <span className="text-gold font-body text-xs uppercase tracking-[0.12em] font-semibold">Access</span>
            </div>

            {/* Public rows */}
            {SYMBOLS_PUBLIC.map((sym, i) => (
              <div
                key={sym.sym}
                className={`grid grid-cols-[120px_1fr_160px] items-start px-6 py-4 border-b border-white/5 gap-6 ${
                  i % 2 === 0 ? "bg-surface" : "bg-surface/60"
                }`}
              >
                <code className="font-mono text-xl text-gold font-bold">{sym.sym}</code>
                <p className="text-text-muted font-body text-sm leading-relaxed">{sym.what}</p>
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-emerald-900/20 border border-emerald-500/30 text-emerald-400 text-xs font-body font-semibold self-start">
                  ✓ Public
                </span>
              </div>
            ))}

            {/* Redacted rows */}
            {SYMBOLS_LOCKED.map((desc, i) => (
              <div
                key={i}
                className={`grid grid-cols-[120px_1fr_160px] items-start px-6 py-4 border-b border-white/5 last:border-0 gap-6 opacity-60 ${
                  (i + 2) % 2 === 0 ? "bg-surface" : "bg-surface/60"
                }`}
              >
                <span
                  className="font-mono text-xl font-bold select-none"
                  style={{ filter: "blur(6px)", color: "#C9A84C", userSelect: "none" }}
                  aria-hidden="true"
                >
                  ████
                </span>
                <p
                  className="font-body text-sm leading-relaxed select-none"
                  style={{ filter: "blur(4px)", color: "#8A9BB0", userSelect: "none" }}
                  aria-hidden="true"
                >
                  {desc}
                </p>
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-red-900/20 border border-red-500/30 text-red-400 text-xs font-body font-semibold self-start">
                  <Lock className="w-3 h-3 shrink-0" /> Full Reference in Masterclass
                </span>
              </div>
            ))}
          </div>

          <LockBlock>
            The complete eight-symbol reference — including full behavioral descriptions, musical equivalents, combination usage, and application methodology — is available exclusively inside Brass Syntax Academy.
          </LockBlock>
        </div>
      </section>

      {/* ── Tier 3: Neural Bypass ─────────────────────────────── */}
      <section ref={tierRefs.tier3} id="tier3" className="scroll-mt-32 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <p className="text-gold font-body text-xs uppercase tracking-[0.2em] font-semibold mb-2">
            TIER 3 — NEURAL BYPASS
          </p>
          <h2 className="font-display text-3xl md:text-4xl text-text-base mb-6">
            Phonetic Instrument Description
          </h2>
          <p className="text-text-muted font-body leading-relaxed mb-5">
            When a prompt contains an instrument name, the model's training creates a direct behavioral pathway to that instrument — regardless of what else the prompt says. This is why "no drums" still produces drums. This is why "vocals only" still produces instrumentation. The word itself is the trigger.
          </p>
          <p className="text-text-muted font-body leading-relaxed mb-5">
            The third tier of the Brass Note Method addresses this at the source. By replacing instrument names with descriptions of what those instruments sound like — phonetically, physically, acoustically — the trigger word is removed. The model receives a sound to produce rather than an instrument to reach for. When the model's only pathway is vocal, it produces vocal.
          </p>
          <p className="text-text-muted font-body leading-relaxed mb-5">
            This is not prompt engineering. This is understanding how language models process training associations and deliberately routing around them. The technique requires knowing what instruments actually do — the function they serve, the acoustic space they occupy, the physical sound they produce. That knowledge comes from musicianship, not from technology.
          </p>
          <p className="text-text-base font-body font-medium leading-relaxed">
            The result: full vocal symphonies. Beatbox percussion with audible breath and lip sounds. Eight-part a cappella arrangements with zero instrument bleed — clean, through prompting alone, consistently across nearly every generation. All documented. All timestamped. All produced on Suno v5.5.
          </p>

          <LockBlock>
            The complete instrument-to-voice translation methodology, phonetic description library, and genre circumvention techniques are proprietary to the Brass Note Method and taught exclusively inside Brass Syntax Academy.
          </LockBlock>
        </div>
      </section>

      {/* ── Case Studies ──────────────────────────────────────── */}
      <section ref={tierRefs.casestudies} id="casestudies" className="scroll-mt-32 py-20 px-4 sm:px-6 lg:px-8 bg-surface">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <p className="text-gold font-body text-xs uppercase tracking-[0.2em] font-semibold mb-2">
              PROOF OF CONCEPT
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-text-base mb-4">
              Two Documented Breakthroughs
            </h2>
          </div>
          <p className="text-text-muted font-body leading-relaxed text-center max-w-2xl mx-auto mb-14">
            Each case study below documents a result the Suno AI community considers unreliable or impossible through standard prompting. These are not one-off generations. They are consistent, repeatable outcomes produced by applying all three tiers of the Brass Note Method simultaneously. The results are documented. The prompts are proprietary.
          </p>

          <div className="flex flex-col gap-12">
            {CASE_STUDIES.map((cs) => (
              <div key={cs.num} className="border-t-[3px] border-gold pt-8">
                <span className="font-display text-xl text-gold block mb-1">{cs.num}</span>
                <h3 className="font-display text-2xl text-text-base mb-6">{cs.title}</h3>

                {/* Wiki quote block */}
                <blockquote className="bg-background border border-white/8 rounded-lg px-6 py-5 mb-6">
                  <p className="text-text-muted font-body text-sm leading-relaxed italic mb-3">
                    &ldquo;{cs.wikiQuote}&rdquo;
                  </p>
                  <footer className="text-text-subtle font-body text-xs">— {cs.wikiSource}</footer>
                </blockquote>

                {/* Result copy */}
                <p className="text-text-muted font-body leading-relaxed">{cs.result}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Masterclass CTA ───────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <p className="text-gold font-body text-xs uppercase tracking-[0.2em] font-semibold mb-4">
            What&rsquo;s Inside the Masterclass
          </p>
          <p className="text-text-muted font-body leading-relaxed mb-5">
            The public overview of the Brass Note Method tells you what each tier governs. It does not tell you how to apply the framework — because application is where the value lives, and application is what the masterclass teaches.
          </p>
          <p className="text-text-muted font-body leading-relaxed mb-5">
            Inside Brass Syntax Academy, you'll learn the specific parameters for all ten layers and why the order is not interchangeable. You'll get the complete eight-symbol lyrical syntax reference with full behavioral descriptions, musical equivalents, and combination usage. You'll learn the phonetic instrument description library — the exact vocal language that bypasses training associations for every major instrument category. You'll walk through all three case studies prompt by prompt, decision by decision. And you'll learn how to apply the method from scratch — even if you've never written a song, never used Suno, and don't have a technical background.
          </p>
          <p className="text-text-base font-body font-medium leading-relaxed mb-10">
            Three paths. Your pace. Every topic has a surface level and a deep dive — you choose how far you go on each one.
          </p>

          {/* Path cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="bg-surface border border-white/8 rounded-lg p-6">
              <h4 className="font-display text-lg text-text-base mb-2">Songwriting Track</h4>
              <p className="text-text-muted font-body text-sm leading-relaxed">Lyric structure, narrative arc, chord-emotion mapping, and the prompt language that captures all of it.</p>
            </div>
            <div className="bg-surface border border-white/8 rounded-lg p-6">
              <h4 className="font-display text-lg text-text-base mb-2">Production Track</h4>
              <p className="text-text-muted font-body text-sm leading-relaxed">Sound architecture, tension engineering, neural bypass technique, and the complete symbol reference.</p>
            </div>
          </div>
          <div className="mb-10">
            <div className="bg-surface border border-gold/25 rounded-lg p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gold-gradient" />
              <div className="flex items-start justify-between gap-4 mb-2">
                <h4 className="font-display text-lg text-text-base">Full Method Track</h4>
                <span className="text-gold font-body text-xs uppercase tracking-[0.15em] font-semibold shrink-0 mt-1">Both Paths</span>
              </div>
              <p className="text-text-muted font-body text-sm leading-relaxed">Everything in the Songwriting Track and the Production Track — taken together as one complete path through the Brass Note Method. The full picture, from first lyric to final output.</p>
            </div>
          </div>

          {/* Waitlist */}
          <div className="bg-surface border border-gold/15 rounded-lg p-8" id="waitlist">
            <p className="text-gold font-body text-xs uppercase tracking-[0.2em] font-semibold mb-3">
              Not Yet Open
            </p>
            <p className="text-text-muted font-body text-sm leading-relaxed mb-6">
              The Brass Note Method masterclass is not yet open. Join the Brass Syntax Academy waitlist to receive founding member pricing when enrollment opens.
            </p>

            {waitlistDone ? (
              <div className="text-center py-4">
                <p className="text-gold font-display text-xl mb-1">You&rsquo;re on the list.</p>
                <p className="text-text-muted font-body text-sm">I&rsquo;ll reach out when the Academy opens.</p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  // TODO: wire to Formspree or email backend
                  setWaitlistDone(true);
                }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={waitlistEmail}
                  onChange={(e) => setWaitlistEmail(e.target.value)}
                  className="flex-1 bg-background border border-white/10 rounded-sm px-4 py-3 text-text-base font-body placeholder:text-text-muted focus:outline-none focus:border-gold/50 transition-colors text-sm"
                />
                <button
                  type="submit"
                  className="bg-gold text-background font-body font-semibold tracking-wide rounded-sm px-6 py-3 hover:bg-gold-light transition-colors duration-200 text-sm whitespace-nowrap"
                >
                  Join the Waitlist
                </button>
              </form>
            )}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center font-body font-semibold tracking-wide border border-gold text-gold hover:bg-gold/10 rounded-sm px-8 py-4 text-base transition-colors duration-200"
            >
              Commission a Song Instead
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
