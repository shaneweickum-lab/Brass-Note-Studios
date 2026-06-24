"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

/* ─── Ten Layers ────────────────────────────────────────── */
const TEN_LAYERS = [
  { num: "01", name: "Genre", desc: "Sets the sonic room. The broad musical category that defines the world of the track.", example: "A Cappella / R&B Ballad / Funk Soul Fusion" },
  { num: "02", name: "Sub-Genre", desc: "Refines the room. Narrows the genre to a specific stylistic pocket.", example: "Intimate Slow-Burn / Vocal Quartet / Cinematic Anthem" },
  { num: "03", name: "Vocal Character", desc: "Defines the singer. Gender, range, texture, skill level, and vocal personality.", example: "Male Tenor Lead · Female Virtuoso · Gritty Baritone · Soprano Adlib Stack" },
  { num: "04", name: "Tempo", desc: "Sets the heartbeat. Specific BPM — not 'fast' or 'slow' but an exact number.", example: "72 BPM / 92 BPM / 118 BPM Syncopated" },
  { num: "05", name: "Time Signature", desc: "Sets the meter. How the beats are grouped — the felt pulse beneath the tempo.", example: "4/4 / 3/4 Waltz / 6/8 Swung Eighths / Halftime Groove" },
  { num: "06", name: "Tension Arc", desc: "Controls the instruments' emotional journey. Is it building? Breaking? Static?", example: "Gradual Build · Sparse Arrangement · Explosive Chorus · Dynamic Breakdowns" },
  { num: "07", name: "Vocal Mood", desc: "Controls the singer's emotional state. Separate from tension — the voice feels.", example: "Bittersweet Nostalgia · Intimate Intensity · Heroic · Mythic Momentum" },
  { num: "08", name: "Negative Prompting", desc: "Tells the model what to exclude — or replaces it with a vocal equivalent.", example: "No instrumentation — replaced with: Vocal Bass · Mouth Clicks · Vocal Percussion" },
  { num: "09", name: "Weirdness", desc: "Controls model deviation. Center (0%) = predictable. Higher = experimental.", example: "Zero — kept at center for consistent professional output" },
  { num: "10", name: "Constraint", desc: "Controls how strictly the model follows the prompt. Always set to 100%.", example: "100% — zero deviation. The prompt IS the production brief." },
];

/* ─── Syntax Symbols ─────────────────────────────────────── */
const SYMBOLS = [
  { sym: "...", name: "Full Pause / Rest", what: "Complete silence — open, emotional, unmetered. The singer stops.", ex: '"I love you... but I\'m leaving"', deeper: "The longest of the pause family. Creates genuine musical silence — not a breath, not a hesitation. The phrase ends. Listeners feel the weight before the singer returns." },
  { sym: "...,", name: "Quarter Rest", what: "Short metered pause equivalent to a quarter rest. Rhythmically precise.", ex: '"Stay with me...., don\'t go"', deeper: "Unlike the full pause, this keeps time. The silence lasts exactly one beat — the model treats it as a notated rest within the rhythmic structure of the line." },
  { sym: "..;", name: "Thought Change", what: "Signals a mental pivot — vocal break with emotional direction shift.", ex: '"I thought I knew you..; maybe I never did"', deeper: "The most dramatic of the micro-pause symbols. It tells the model the speaker's internal state has shifted — the singer processes something mid-phrase and arrives somewhere new." },
  { sym: "...:", name: "Forced Breath", what: "Forces an audible inhale. You can hear the singer breathe.", ex: '"Hold on...: I need a moment"', deeper: "One of the most powerful symbols for emotional realism. An audible breath mid-phrase is something only a real singer does — it makes the AI output feel physically human." },
  { sym: "_", name: "Forced Breath (Alt)", what: "Identical to (...:). Cleaner typographic alternative.", ex: '"Hold me_ like it\'s the last time"', deeper: "Functionally identical to the colon-breath symbol but easier to type and less visually disruptive inside a lyric line. Use whichever reads more naturally in context." },
  { sym: "^", name: "Syllable Modulation", what: "Breaks a word AND adds pitch modulation at the break point.", ex: '"beau^ti^ful" — each break glows', deeper: "This is the most musically sophisticated symbol. It doesn't just split a syllable — it tells the model to ornament the break with pitch movement. The effect is a kind of shimmer or melt on the word." },
  { sym: "(( ))", name: "Whisper / Ad-lib", what: "Words inside render as whispers or ad-libs beneath the main vocal.", ex: '"I love you ((always have))"', deeper: "Creates vocal layering without needing multiple prompt passes. The main vocal carries the line; the whispered text sits underneath, audible but subordinate — like a second voice echoing the feeling." },
  { sym: "| |", name: "Syllable Hiding", what: "Hides syllables from neural processing — smoother rendering on complex words.", ex: '"em|ber|" — altered pathway', deeper: "Technically the most unusual symbol. It bypasses the model's standard tokenization of a word, forcing it through an alternate processing path. The result is smoother, less robotic rendering of multi-syllable or unusual words." },
];

/* ─── Before/After ───────────────────────────────────────── */
const BEFORE_AFTER = [
  { sound: "Snare Drum", standard: "snare drum", method: '[Mouth Percussion: heavy "pht-k" snare]' },
  { sound: "Hi-Hat", standard: "hi-hat cymbal", method: '[Mouth Percussion: crisp "t-t-t" hi-hat]' },
  { sound: "Bass Guitar", standard: "bass guitar", method: '[Vocal Bass: Deep driving chug — "dum-dum-dum-dum"]' },
  { sound: "Dist. Guitar", standard: "distorted guitar", method: '[Female Vocals: Distorted alto vocal rhythm emulation — "chugga-chugga"]' },
  { sound: "Guitar Solo", standard: "lead guitar solo", method: '[Soprano: "Wah-wah-da-na-na-reeee-oww-chugga-reeee!"]' },
  { sound: "Bass Slide", standard: "bass slide", method: "[Vocal Bass: heavy slide down]" },
  { sound: "Crash Cymbal", standard: "crash cymbal fill", method: "[Mouth Percussion: Explosive fill, driving heavy crash transient]" },
  { sound: "Wah Pedal", standard: "wah guitar effect", method: '[Soprano: High soaring squeal — "reeee-owww!"]' },
];

/* ─── Case Studies ───────────────────────────────────────── */
const CASE_STUDIES = [
  {
    num: "Case Study 01", title: "The A Cappella Breakthrough",
    summary: "Eight distinct vocal parts — leads, harmonies, vocal bass, vocal percussion, mouth clicks — zero instrument bleed. Clean. Through prompting alone. No post-processing. No stem separation.",
    result: "8 vocal parts · 0 instrument bleed · Suno v5.5",
    tag: "Community says: unreliable without external tools",
  },
  {
    num: "Case Study 02", title: "The Vocal Symphony",
    summary: "A full orchestral production using exclusively human vocal sounds. Eleven instruments replaced with phonetic vocal descriptions. Consistent output across nearly every generation. Breath and lip sounds audible throughout — the model produced physically human sound.",
    result: "11 instruments replaced · Consistent across generations · Suno v5.5",
    tag: "Community says: full vocal orchestra not achievable through prompting",
  },
  {
    num: "Case Study 03", title: "The Song That Made People Cry",
    summary: "A birthday ballad for a real person, about a real marriage, built with the ten-layer framework from the ground up. Released on YouTube. 15,000 views in under 24 hours. 100% view-through rate.",
    result: "15K views · 100% retention · 3 listeners reported tearing up",
    tag: "AI music that moves people — not just sounds good",
  },
];

export default function MethodPageClient() {
  const [activeSymbol, setActiveSymbol] = useState<number | null>(null);
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
        { threshold: 0.25 }
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
      {/* ── Sticky Tier Navigation ───────────────────────────── */}
      <div className="sticky top-16 md:top-20 z-40 bg-surface border-b border-gold/10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto hide-scrollbar">
            {[
              { id: "tier1", label: "TIER 1: The Ten Layers" },
              { id: "tier2", label: "TIER 2: Lyrical Syntax" },
              { id: "tier3", label: "TIER 3: Phonetic Instruments" },
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
          <p className="text-gold font-body text-xs uppercase tracking-[0.2em] font-semibold mb-2">TIER 1 — ARCHITECTURAL DECISIONS</p>
          <h2 className="font-display text-3xl md:text-4xl text-text-base mb-4">The Ten-Layer Framework</h2>
          <p className="text-text-muted font-body leading-relaxed max-w-2xl mb-12">
            Every track built with the Brass Note Method begins here. These ten layers govern the
            architecture of the entire production — the decisions that shape everything before a
            single lyric is written.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            {TEN_LAYERS.map((layer) => (
              <div key={layer.num} className="bg-surface rounded-lg p-6 border border-white/5 hover:border-gold/20 transition-colors">
                <div className="flex items-start gap-4">
                  <span className="font-display text-3xl text-gold shrink-0 leading-none">{layer.num}</span>
                  <div className="min-w-0">
                    <h3 className="font-body font-semibold text-text-base mb-1">{layer.name}</h3>
                    <p className="text-text-muted text-sm leading-relaxed mb-3">{layer.desc}</p>
                    <code className="block font-mono text-xs text-gold/80 bg-background/60 rounded px-3 py-2 leading-relaxed border border-gold/10">
                      {layer.example}
                    </code>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Callout box */}
          <div className="bg-surface-elevated border-l-4 border-gold rounded-r-lg p-6 max-w-3xl">
            <p className="text-gold font-body text-xs uppercase tracking-[0.15em] font-semibold mb-2">Key Insight — Layer 8</p>
            <p className="text-text-base font-body leading-relaxed">
              Layer 8 is the most powerful layer in the framework — not because of what it excludes,
              but because of what it <em>replaces</em>. A musician knows that every instrument serves
              a function. Remove the instrument but fill its function with a voice, and the model has
              nowhere to go but vocal.
            </p>
          </div>
        </div>
      </section>

      {/* ── Tier 2: Lyrical Syntax ──────────────────────────── */}
      <section ref={tierRefs.tier2} id="tier2" className="scroll-mt-32 py-20 px-4 sm:px-6 lg:px-8 bg-surface">
        <div className="max-w-7xl mx-auto">
          <p className="text-gold font-body text-xs uppercase tracking-[0.2em] font-semibold mb-2">TIER 2 — PERFORMANCE DECISIONS</p>
          <h2 className="font-display text-3xl md:text-4xl text-text-base mb-4">The Undocumented Lyrical Syntax</h2>
          <p className="text-text-muted font-body leading-relaxed max-w-2xl mb-8">
            These symbols were not found in any official Suno documentation, community wiki, or
            prompt engineering guide. They were discovered through systematic stress testing of
            Suno v5.5's lyrical processing engine. Each one is repeatable and confirmed.
          </p>

          {/* Discovery badge */}
          <div className="flex items-start gap-3 bg-background border border-gold/20 rounded-lg sm:rounded-full px-5 py-3 mb-10 max-w-2xl">
            <div className="w-2 h-2 rounded-full bg-gold animate-pulse shrink-0 mt-1" />
            <p className="font-body text-xs text-text-muted leading-relaxed">
              <span className="text-gold font-semibold">8 undocumented symbols</span> confirmed through stress testing on Suno v5.5.
              Not found in official documentation or any community resource as of June 23, 2026.
            </p>
          </div>

          {/* Symbol table — mobile cards */}
          <div className="flex flex-col gap-3 mb-10 md:hidden">
            {SYMBOLS.map((sym, i) => (
              <div key={sym.sym} className={`rounded-lg border border-white/8 overflow-hidden ${i % 2 === 0 ? "bg-surface" : "bg-surface/60"}`}>
                <button
                  className="w-full px-4 py-4 text-left hover:bg-gold/5 transition-colors"
                  onClick={() => setActiveSymbol(activeSymbol === i ? null : i)}
                >
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <code className="font-mono text-lg text-gold font-bold">{sym.sym}</code>
                    <span className="text-red-400 font-body text-xs font-bold uppercase tracking-wide shrink-0">UNDOC</span>
                  </div>
                  <p className="font-body font-semibold text-text-base text-sm mb-1">{sym.name}</p>
                  <p className="text-text-muted text-sm leading-relaxed">{sym.what}</p>
                </button>
                {activeSymbol === i && (
                  <div className="px-4 pb-4 bg-background/40 border-t border-gold/10 flex flex-col gap-3 pt-3">
                    <div>
                      <p className="text-gold font-body text-xs uppercase tracking-[0.12em] font-semibold mb-1">Example in context</p>
                      <code className="font-mono text-sm text-gold/90 bg-background rounded px-3 py-2 block border border-gold/10 overflow-x-auto">{sym.ex}</code>
                    </div>
                    <div>
                      <p className="text-gold font-body text-xs uppercase tracking-[0.12em] font-semibold mb-1">Deeper explanation</p>
                      <p className="text-text-muted text-sm leading-relaxed italic">{sym.deeper}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Symbol table — desktop */}
          <div className="hidden md:block rounded-lg border border-white/8 overflow-hidden mb-10">
            <div className="grid grid-cols-[80px_1fr_1.5fr_auto] bg-surface-elevated px-4 py-3 border-b border-white/8 gap-4">
              <span className="text-gold font-body text-xs uppercase tracking-[0.12em] font-semibold">Symbol</span>
              <span className="text-gold font-body text-xs uppercase tracking-[0.12em] font-semibold">Name</span>
              <span className="text-gold font-body text-xs uppercase tracking-[0.12em] font-semibold">What It Does</span>
              <span className="text-gold font-body text-xs uppercase tracking-[0.12em] font-semibold">Status</span>
            </div>
            {SYMBOLS.map((sym, i) => (
              <div key={sym.sym} className="border-b border-white/5 last:border-0">
                <button
                  className={`w-full grid grid-cols-[80px_1fr_1.5fr_auto] px-4 py-4 gap-4 text-left hover:bg-gold/5 transition-colors ${i % 2 === 0 ? "bg-surface" : "bg-surface/60"}`}
                  onClick={() => setActiveSymbol(activeSymbol === i ? null : i)}
                >
                  <code className="font-mono text-lg text-gold font-bold">{sym.sym}</code>
                  <span className="font-body font-semibold text-text-base text-sm">{sym.name}</span>
                  <span className="text-text-muted text-sm leading-relaxed">{sym.what}</span>
                  <span className="text-red-400 font-body text-xs font-bold uppercase tracking-wide shrink-0 self-start pt-0.5">UNDOC</span>
                </button>
                {activeSymbol === i && (
                  <div className="px-4 pb-4 bg-background/40 border-t border-gold/10">
                    <div className="pt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-gold font-body text-xs uppercase tracking-[0.12em] font-semibold mb-1">Example in context</p>
                        <code className="font-mono text-sm text-gold/90 bg-background rounded px-3 py-2 block border border-gold/10">{sym.ex}</code>
                      </div>
                      <div>
                        <p className="text-gold font-body text-xs uppercase tracking-[0.12em] font-semibold mb-1">Deeper explanation</p>
                        <p className="text-text-muted text-sm leading-relaxed italic">{sym.deeper}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Annotated example */}
          <div className="max-w-3xl">
            <p className="text-gold font-body text-xs uppercase tracking-[0.15em] font-semibold mb-4">Combination Example — From the A Cappella Case Study</p>
            <div className="bg-background rounded-lg border border-gold/15 p-6 font-mono text-sm leading-loose overflow-x-auto">
              <div className="mb-4">
                <p className="text-gold/90">Now for<span className="text-amber">^</span>ev<span className="text-amber">^</span>er's sleeping upstairs tonight<span className="text-amber">...</span></p>
                <p className="text-text-subtle text-xs italic font-body mt-1">^ syllable modulation on "forever" · ... full pause at line end</p>
              </div>
              <div className="mb-4">
                <p className="text-gold/90">Your touch still stops my breathing<span className="text-amber">_</span> still changes my day</p>
                <p className="text-text-subtle text-xs italic font-body mt-1">_ forced breath mid-line — audible inhale between clauses</p>
              </div>
              <div>
                <p className="text-gold/90">And after all these years <span className="text-amber">((</span>still got me<span className="text-amber">))</span> this way</p>
                <p className="text-text-subtle text-xs italic font-body mt-1">( ) whisper/ad-lib — "still got me" renders beneath the main vocal</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Tier 3: Phonetic Instruments ─────────────────────── */}
      <section ref={tierRefs.tier3} id="tier3" className="scroll-mt-32 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-gold font-body text-xs uppercase tracking-[0.2em] font-semibold mb-2">TIER 3 — NEURAL BYPASS</p>
          <h2 className="font-display text-3xl md:text-4xl text-text-base mb-4">Phonetic Instrument Description</h2>
          <p className="text-text-muted font-body leading-relaxed max-w-2xl mb-10">
            When you name an instrument, the model reaches for that instrument from its training
            data — regardless of what else you've said. When you describe what that instrument
            sounds like phonetically, the model has no anchor. It can only produce the sound with a voice.
          </p>

          {/* Core insight block */}
          <div className="bg-surface-elevated border border-teal/20 rounded-lg p-6 max-w-3xl mb-12">
            <p className="text-teal font-body text-xs uppercase tracking-[0.15em] font-semibold mb-2">The Core Insight</p>
            <p className="text-text-base font-body leading-relaxed">
              This is not prompt engineering. This is understanding how language models process
              training associations — and deliberately routing around them. The instrument name{" "}
              <em>IS</em> the trigger. Remove the name, describe the sound, and the model has
              nowhere to go but vocal.
            </p>
          </div>

          {/* Before/After table */}
          <div className="overflow-x-auto">
          <div className="rounded-lg border border-white/8 overflow-hidden">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="bg-surface-elevated border-b border-white/8">
                  <th className="text-left text-gold font-body text-xs uppercase tracking-[0.12em] font-semibold px-5 py-3 w-28">Sound</th>
                  <th className="text-left font-body text-xs uppercase tracking-[0.12em] font-semibold px-5 py-3 text-red-400/80">❌ Standard Approach</th>
                  <th className="text-left font-body text-xs uppercase tracking-[0.12em] font-semibold px-5 py-3 text-emerald-400/80">✓ Brass Note Method</th>
                </tr>
              </thead>
              <tbody>
                {BEFORE_AFTER.map((row, i) => (
                  <tr key={row.sound} className={`border-b border-white/5 last:border-0 ${i % 2 === 0 ? "bg-surface" : "bg-surface/60"}`}>
                    <td className="px-5 py-4 font-body font-semibold text-text-base text-sm">{row.sound}</td>
                    <td className="px-5 py-4">
                      <code className="font-mono text-sm text-red-300/80 bg-red-900/10 rounded px-2 py-0.5">{row.standard}</code>
                    </td>
                    <td className="px-5 py-4">
                      <code className="font-mono text-sm text-emerald-300/80 bg-emerald-900/10 rounded px-2 py-0.5">{row.method}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </div>
        </div>
      </section>

      {/* ── Case Studies ──────────────────────────────────────── */}
      <section ref={tierRefs.casestudies} id="casestudies" className="scroll-mt-32 py-20 px-4 sm:px-6 lg:px-8 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-gold font-body text-xs uppercase tracking-[0.2em] font-semibold mb-2">PROOF OF CONCEPT</p>
            <h2 className="font-display text-3xl md:text-4xl text-text-base mb-4">Three Documented Breakthroughs</h2>
            <p className="text-text-muted font-body leading-relaxed max-w-2xl mx-auto">
              Each case study below documents a result the Suno community considers unreliable or
              impossible. All three were achieved consistently using the Brass Note Method.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CASE_STUDIES.map((cs) => (
              <div key={cs.num} className="bg-background rounded-lg border-t-[3px] border-gold p-6 flex flex-col">
                <span className="font-display text-2xl text-gold mb-2">{cs.num}</span>
                <h3 className="font-body font-semibold text-text-base text-lg mb-3">{cs.title}</h3>
                <p className="text-text-muted font-body text-sm leading-relaxed flex-1 mb-4">{cs.summary}</p>
                <p className="font-body font-semibold text-gold text-sm mb-3">{cs.result}</p>
                <span className="text-text-subtle text-xs italic font-body border-t border-white/5 pt-3">{cs.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Masterclass CTA ───────────────────────────────────── */}
      <section id="masterclass" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-gold font-body text-xs uppercase tracking-[0.2em] font-semibold mb-2">COMING SOON</p>
            <h2 className="font-display text-3xl md:text-4xl text-text-base mb-4">The Brass Note Masterclass</h2>
            <p className="text-text-muted font-body leading-relaxed max-w-xl mx-auto">
              Every layer. Every symbol. Every technique. Taught from scratch — no musical
              background required. Designed for anyone who wants to go from average AI music to
              professional-level emotional production.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-12">
            {[
              { label: "PATH A", title: "Surface Level", desc: "Core fundamentals of songwriting + the ten layers. No technical background needed. Start making music immediately." },
              { label: "PATH B", title: "Technical Deep Dive", desc: "Model architecture, neural processing, why each layer works, advanced syntax, case study breakdowns." },
            ].map((path) => (
              <div key={path.label} className="bg-surface rounded-lg border border-white/5 p-6">
                <p className="text-gold font-body text-xs uppercase tracking-[0.15em] font-semibold mb-1">{path.label}</p>
                <h3 className="font-display text-xl text-text-base mb-3">{path.title}</h3>
                <p className="text-text-muted font-body text-sm leading-relaxed">{path.desc}</p>
              </div>
            ))}
          </div>

          {/* Waitlist form */}
          <div className="max-w-md mx-auto text-center">
            <p className="text-text-muted font-body text-sm mb-4">Join the waitlist — be first to know when it drops</p>
            {waitlistDone ? (
              <div className="bg-gold/10 border border-gold/30 rounded-lg px-6 py-4 text-gold font-body font-semibold">
                You're on the list. See you inside.
              </div>
            ) : (
              <form
                onSubmit={(e) => { e.preventDefault(); if (waitlistEmail) setWaitlistDone(true); }}
                className="flex gap-2"
              >
                {/* TODO: wire form action to email backend (e.g. Formspree) */}
                <input
                  type="email"
                  required
                  value={waitlistEmail}
                  onChange={(e) => setWaitlistEmail(e.target.value)}
                  placeholder="Your email address"
                  className="flex-1 bg-surface border border-white/10 rounded-sm px-4 py-3 text-text-base font-body text-sm placeholder:text-text-subtle focus:outline-none focus:border-gold/50 transition-colors"
                />
                <button
                  type="submit"
                  className="bg-gold hover:bg-gold-light text-background font-body font-semibold px-5 py-3 rounded-sm text-sm transition-colors whitespace-nowrap"
                >
                  Notify Me
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
