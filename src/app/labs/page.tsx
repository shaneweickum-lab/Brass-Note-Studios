import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Music2, Mic2, Volume2, Ruler, Repeat2, Target } from "lucide-react";
import GoldDivider from "@/components/ui/GoldDivider";
import LabsBarChart from "@/components/labs/LabsBarChart";

export const metadata: Metadata = {
  title: "Preludio Labs — Research & Development",
  description:
    "The research division behind every Brass Note Studios production. Every generation analyzed. Every result documented. Every insight raises the floor.",
};

// ── Data ─────────────────────────────────────────────────────────────────────

const PIPELINE = [
  {
    num: "01",
    name: "Brief",
    desc: "Every production begins with a documented creative brief — the occasion, the emotion, the intended listener, the desired outcome. Nothing enters the pipeline without a clear target.",
  },
  {
    num: "02",
    name: "Architecture",
    desc: "The production architecture is built using our proprietary multi-layer framework. Each decision — from the macro structure of the track down to individual performance moments — is deliberate and documented before a single generation is run.",
  },
  {
    num: "03",
    name: "Generation",
    desc: "Production is run through the Suno AI platform under controlled conditions — consistent parameters, documented settings, deliberate configuration. Multiple generations are produced per project. Each one is logged, not just listened to.",
  },
  {
    num: "04",
    name: "Analysis",
    desc: "Every generation that reaches the selection stage is analyzed across multiple dimensions — emotional register, tonal quality, structural integrity, vocal performance, and alignment with the original brief. What works is documented. What doesn't work is documented equally.",
  },
  {
    num: "05",
    name: "Integration",
    desc: "Insights from every production cycle are integrated back into the framework. This is what makes our output improve over time — not accumulated experience alone, but accumulated documented evidence applied systematically to every future production.",
  },
];

const METRICS = [
  {
    Icon: Music2,
    name: "Emotional Resonance",
    desc: "Does the track produce the intended emotional response in an uninvested listener — someone with no context for the brief?",
  },
  {
    Icon: Mic2,
    name: "Vocal Integrity",
    desc: "Does the vocal performance maintain consistency, clarity, and intentionality throughout the full duration of the track?",
  },
  {
    Icon: Volume2,
    name: "Tonal Balance",
    desc: "Does the frequency distribution across the production feel natural and intentional, with no element overwhelming the others?",
  },
  {
    Icon: Ruler,
    name: "Structural Fidelity",
    desc: "Does the arrangement follow the intended arc — building, resolving, and landing where the brief specified?",
  },
  {
    Icon: Repeat2,
    name: "Repeatability",
    desc: "Can the same configuration produce consistent quality across multiple generations, or is the result a one-time occurrence?",
  },
  {
    Icon: Target,
    name: "Brief Alignment",
    desc: "Does the final delivered track match the original creative brief — not just in genre and style, but in emotional intent and outcome?",
  },
];

const FINDINGS = [
  {
    num: "001",
    title: "Specificity and Output Quality",
    body: "We have consistently observed that productions built on highly specific, multi-dimensional architectural briefs outperform productions built on broad or minimal direction — not occasionally, but in every documented case across our production archive.",
  },
  {
    num: "002",
    title: "Replacement vs Restriction",
    body: "Attempts to restrict the AI model from producing certain sonic elements through exclusion language alone produce inconsistent results. Productions that replace excluded elements with specified alternatives — giving the model something to reach for rather than something to avoid — produce dramatically more reliable outcomes.",
  },
  {
    num: "003",
    title: "The Repeatability Standard",
    body: "A result that cannot be reproduced is not a production technique — it is an accident. Every method documented in our production framework has been stress tested across multiple generations and multiple genres before being adopted as a standard. If it doesn't repeat, it doesn't make the framework.",
  },
];

const COINED_TERMS = [
  {
    num: "001",
    term: "Syntax Fatigue",
    pos: "/noun phrase/",
    year: "2026",
    definition:
      "When you overload the lyrical input of a generative audio AI with syntax symbols placed too close together — without giving the model adequate space to process each instruction before receiving the next — you force the model into a chaotic generative state. The output deviates completely from the intended prompt: vocals become random, structure collapses, and elements that were explicitly excluded may appear. The result bears no resemblance to what was directed. Coined from direct observation during production at Preludio Labs.",
  },
  {
    num: "002",
    term: "Lyrical Bypass",
    pos: "/noun phrase/",
    year: "2026",
    definition:
      "During a state of Syntax Fatigue — or when the lyrical input exceeds the model's processing capacity — the model abandons the written lyrics entirely. It does not produce a degraded version of the intended lyric. It bypasses the lyrical channel and generates vocal content autonomously, ignoring written words, dynamic syntax instructions, and song structure. The output may sound musically coherent while being completely disconnected from what was directed. Coined from direct observation during production at Preludio Labs.",
  },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function TealEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-6 h-px bg-teal shrink-0" />
      <p className="text-teal font-body text-[11px] font-semibold uppercase tracking-[0.22em]">
        {children}
      </p>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function LabsPage() {
  return (
    <div>

      {/* ── 01 Hero — IMG_5117 ───────────────────────────────────────────── */}
      <section className="relative py-24 lg:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <Image
          src="/images/IMG_5117.png"
          alt=""
          fill
          className="object-cover object-center"
          priority
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          {/* Preludio Labs logo */}
          <div className="flex justify-center mb-8">
            <Image
              src="/images/Preludio.png"
              alt="Preludio Labs"
              width={220}
              height={80}
              className="h-16 w-auto"
              style={{ objectFit: "contain" }}
            />
          </div>
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-6 h-px bg-teal shrink-0" />
            <p className="text-teal font-body text-[11px] font-semibold uppercase tracking-[0.22em]">
              Preludio Labs · A Division of Brass Note Studios
            </p>
            <div className="w-6 h-px bg-teal shrink-0" />
          </div>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-text-base font-bold leading-[1.1] mb-6">
            We don&apos;t guess.
            <br />
            <em className="text-teal not-italic italic">We measure.</em>
          </h1>
          <p className="text-text-muted font-body text-lg leading-relaxed max-w-2xl mx-auto mb-12">
            Preludio Labs is the research division behind every Brass Note Studios production.
            Every generation is evaluated. Every result is documented. Every insight raises the
            floor on the next one.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {["Every Generation Analyzed", "Documented Production Pipeline", "Continuously Refined"].map((pill) => (
              <span
                key={pill}
                className="border border-teal/40 text-teal bg-teal/[0.06] font-body font-semibold text-xs uppercase tracking-[0.14em] px-5 py-2.5 rounded-full"
              >
                {pill}
              </span>
            ))}
          </div>
        </div>
      </section>

      <GoldDivider className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16" />

      {/* ── 02 What We Do Here — IMG_5120 right column ───────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
          {/* Left — copy */}
          <div>
            <TealEyebrow>The Mission</TealEyebrow>
            <h2 className="font-display text-3xl md:text-4xl text-text-base font-bold leading-tight mb-8">
              A scientific approach
              <br />
              <em className="text-gold not-italic italic">to music production.</em>
            </h2>
            <div className="flex flex-col gap-5 text-text-muted font-body text-sm leading-[1.85]">
              <p>
                Most music production — even AI-assisted production — relies on intuition and
                iteration. Try something. Listen. Adjust. Try again. At Preludio Labs, we do
                something different. We treat every generation as a data point. We ask not just
                whether it sounds good, but <em className="text-text-base not-italic">why</em> it
                sounds good, what conditions produced it, and whether those conditions can be
                reproduced reliably.
              </p>
              <p>
                The result is a production pipeline built on documented observations rather than
                assumptions. When we find something that works — a configuration, a technique, a
                combination of elements that produces consistent professional output — we capture it,
                stress test it, and build it into our standard process. That process is what makes
                Brass Note Studios productions different from every other AI music operation.
              </p>
            </div>
          </div>

          {/* Right — IMG_5120 photo (no overlay) + bar chart */}
          <div className="pt-2 lg:pt-10 flex flex-col gap-5">
            <div className="relative h-52 rounded-[8px] overflow-hidden border border-white/[0.06]">
              <Image
                src="/images/IMG_5120.png"
                alt="Preludio Labs research desk"
                fill
                className="object-cover object-center"
              />
            </div>
            <LabsBarChart />
          </div>
        </div>
      </section>

      <GoldDivider className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-0" />

      {/* ── 03 Production Pipeline — IMG_5118 background ─────────────────── */}
      <section className="relative overflow-hidden py-24 px-4 sm:px-6 lg:px-8">
        <Image
          src="/images/IMG_5118.png"
          alt=""
          fill
          className="object-cover object-center"
          aria-hidden="true"
        />
        <div className="absolute inset-0" style={{ background: "rgba(10,14,26,0.85)" }} />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <TealEyebrow>Our Process</TealEyebrow>
            <h2 className="font-display text-3xl md:text-4xl text-text-base font-bold mb-4">
              Five stages. Every song. No exceptions.
            </h2>
            <p className="text-text-muted font-body text-sm leading-relaxed max-w-2xl mx-auto">
              Every track produced at Brass Note Studios passes through the same five-stage production
              pipeline before it leaves the Labs. Not every stage is visible in the final product. All
              of them are present in it.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-stretch gap-0">
            {PIPELINE.map((stage, i) => (
              <div key={stage.num} className="flex flex-col md:flex-row items-stretch flex-1 min-w-0">
                <div
                  className="group flex-1 rounded-[8px] border border-white/[0.06] border-l-2 border-l-teal p-5 transition-all duration-250 hover:-translate-y-1 hover:border-teal/50 hover:shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_20px_rgba(13,148,136,0.08)]"
                  style={{ background: "linear-gradient(160deg, rgba(13,31,42,0.9) 0%, rgba(10,20,31,0.9) 60%, rgba(8,13,24,0.9) 100%)" }}
                >
                  <p className="text-teal font-body text-xs font-bold tracking-[0.2em] mb-2">{stage.num}</p>
                  <h3 className="font-display text-text-base text-base font-bold mb-3">{stage.name}</h3>
                  <p className="text-text-muted font-body text-[12px] leading-[1.75]">{stage.desc}</p>
                </div>
                {i < PIPELINE.length - 1 && (
                  <>
                    <div className="hidden md:flex items-center px-1 shrink-0">
                      <div className="w-4 h-px bg-gold/40" />
                      <div className="w-0 h-0" style={{ borderTop: "4px solid transparent", borderBottom: "4px solid transparent", borderLeft: "6px solid rgba(212,168,67,0.4)" }} />
                    </div>
                    <div className="flex md:hidden justify-center py-2">
                      <div className="flex flex-col items-center">
                        <div className="w-px h-4 bg-gold/40" />
                        <div className="w-0 h-0" style={{ borderLeft: "4px solid transparent", borderRight: "4px solid transparent", borderTop: "6px solid rgba(212,168,67,0.4)" }} />
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <GoldDivider className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-0" />

      {/* ── 04 Metrics We Track — IMG_5121 background ────────────────────── */}
      <section className="relative overflow-hidden py-24 px-4 sm:px-6 lg:px-8">
        <Image
          src="/images/IMG_5121.png"
          alt=""
          fill
          className="object-cover object-center"
          aria-hidden="true"
        />
        <div className="absolute inset-0" style={{ background: "rgba(10,14,26,0.82)" }} />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <TealEyebrow>What We Measure</TealEyebrow>
            <h2 className="font-display text-3xl md:text-4xl text-text-base font-bold mb-4">
              If we can&apos;t measure it, we can&apos;t improve it.
            </h2>
            <p className="text-text-muted font-body text-sm leading-relaxed max-w-2xl mx-auto">
              Every generation produced at Preludio Labs is evaluated across a consistent set of
              dimensions. These aren&apos;t subjective opinions. They are documented observations
              measured against a defined standard — the same standard, every time.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {METRICS.map(({ Icon, name, desc }) => (
              <div
                key={name}
                className="border border-white/[0.08] border-l-2 border-l-teal rounded-r-[6px] p-5 transition-colors hover:border-teal/30"
                style={{ background: "rgba(13,31,42,0.85)" }}
              >
                <div className="w-9 h-9 rounded-lg bg-teal/10 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-teal" />
                </div>
                <h3 className="font-display text-text-base text-base font-semibold mb-2">{name}</h3>
                <p className="text-text-muted font-body text-[13px] leading-[1.7]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <GoldDivider className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-0" />

      {/* ── 05 Findings & Observations — IMG_5119 background ─────────────── */}
      <section className="relative overflow-hidden py-24 px-4 sm:px-6 lg:px-8">
        <Image
          src="/images/IMG_5119.png"
          alt=""
          fill
          className="object-cover object-center"
          aria-hidden="true"
        />
        <div className="absolute inset-0" style={{ background: "rgba(10,14,26,0.80)" }} />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <TealEyebrow>From the Lab</TealEyebrow>
            <h2 className="font-display text-3xl md:text-4xl text-text-base font-bold mb-4">
              What we&apos;ve learned by paying attention.
            </h2>
            <p className="text-text-muted font-body text-sm leading-relaxed max-w-2xl mx-auto">
              These are observations from the Preludio Labs production archive — documented findings
              from the analysis of hundreds of generations. They are not theories. They are results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {FINDINGS.map(({ num, title, body }) => (
              <div
                key={num}
                className="border border-white/[0.08] border-t-2 border-t-gold rounded-b-[6px] p-6"
                style={{ background: "rgba(19,29,48,0.9)" }}
              >
                <p className="text-teal font-body text-[10px] font-bold uppercase tracking-[0.2em] mb-3">
                  Finding {num}
                </p>
                <h3 className="font-display text-text-base text-lg font-bold mb-3">{title}</h3>
                <p className="text-text-muted font-body text-sm leading-[1.8]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <GoldDivider className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-0" />

      {/* ── 06 Coined Terms from the Lab ─────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 py-24" id="coined-terms">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <TealEyebrow>From the Lab · Coined Terminology</TealEyebrow>
            <h2 className="font-display text-3xl md:text-4xl text-text-base font-bold mb-5">
              Terms we named because they{" "}
              <em className="not-italic italic">needed names.</em>
            </h2>
            <p className="text-text-muted font-body text-sm leading-relaxed max-w-2xl mx-auto">
              At Preludio Labs, we document everything — including the phenomena we encounter
              that don&apos;t yet have names. When a behavior is observed, confirmed through
              repeated testing, and distinct enough to matter, we coin a term for it. These are ours.
            </p>
            <p
              className="font-body italic text-center mx-auto mt-4 max-w-2xl"
              style={{ fontSize: "0.78rem", color: "#8A9BB0", marginBottom: "32px" }}
            >
              All coined terms on this page were observed and confirmed exclusively on Suno AI. Suno AI is the only generative audio platform used by Brass Note Studios and Preludio Labs.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            {COINED_TERMS.map(({ num, term, pos, year, definition }) => (
              <div
                key={num}
                className="rounded-[10px] border border-white/[0.06] border-t-2 border-t-teal max-w-3xl mx-auto w-full"
                style={{
                  background: "linear-gradient(160deg, #0d1f2a 0%, #0a141f 60%, #080d18 100%)",
                  padding: "36px 40px",
                }}
              >
                {/* Badge */}
                <div className="mb-5">
                  <span className="inline-block bg-teal text-white font-body font-semibold uppercase rounded-full px-3 py-1"
                    style={{ fontSize: "0.62rem", letterSpacing: "0.15em" }}>
                    Term {num} · Coined by Preludio Labs · {year}
                  </span>
                </div>

                {/* Term name */}
                <h3
                  className="font-display font-bold text-text-base leading-[1.1] mb-1.5"
                  style={{ fontSize: "2.4rem" }}
                >
                  {term}
                </h3>

                {/* Part of speech */}
                <p className="font-body italic text-text-muted text-sm mb-6">{pos}</p>

                {/* Teal rule */}
                <div className="h-px bg-teal/40 mb-6" />

                {/* Definition — verbatim */}
                <p className="font-body text-text-base leading-[1.8]" style={{ fontSize: "0.92rem" }}>
                  {definition}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <GoldDivider className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-0" />

      {/* ── 07 The Standard We Hold ──────────────────────────────────────── */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-24 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(212,168,67,0.04) 0%, transparent 70%)" }}
        />
        <div className="max-w-3xl mx-auto relative z-10 text-center">
          <div className="h-px w-32 mx-auto mb-10" style={{ background: "linear-gradient(to right, transparent, #D4A843, transparent)" }} />
          <h2 className="font-display text-2xl md:text-3xl text-text-base font-bold leading-[1.3] mb-8">
            The standard at Preludio Labs is simple:{" "}
            <em className="text-gold not-italic italic">
              if we wouldn&apos;t be proud to put our name on it, it doesn&apos;t leave the pipeline.
            </em>
          </h2>
          <p className="text-text-muted font-body text-sm leading-[1.85]">
            Every track commissioned through Brass Note Studios goes through the full Labs pipeline
            before delivery. Every generation is analyzed. Every decision is documented. Every
            delivery meets the same standard — not because we got lucky, but because we built a
            system that makes luck unnecessary.
          </p>
          <div className="h-px w-32 mx-auto mt-10" style={{ background: "linear-gradient(to right, transparent, #D4A843, transparent)" }} />
        </div>
      </section>

      {/* ── 08 Labs CTA ──────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 pb-32 max-w-7xl mx-auto">
        <div
          className="relative rounded-[10px] overflow-hidden border border-white/[0.06] border-t-2 border-t-teal p-10 md:p-14 text-center"
          style={{ background: "linear-gradient(160deg, #0d1f2a 0%, #0a141f 60%, #080d18 100%)" }}
        >
          <div className="flex justify-center mb-6">
            <Image
              src="/images/Preludio_favicon.png"
              alt="Preludio Labs"
              width={48}
              height={48}
              className="w-12 h-12 object-contain opacity-80"
            />
          </div>
          <TealEyebrow>Work With Us</TealEyebrow>
          <h2 className="font-display text-3xl md:text-4xl text-text-base font-bold mb-5">
            Ready to commission something
            <br />
            <em className="text-gold not-italic italic">built to this standard?</em>
          </h2>
          <p className="text-text-muted font-body text-sm leading-relaxed max-w-xl mx-auto mb-10">
            Every song commissioned through Brass Note Studios goes through the full Labs pipeline
            before it reaches you. The science is already in the production. Commission your song
            and hear the difference.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center font-body font-semibold tracking-wide bg-gold text-background hover:bg-gold-light rounded-sm px-8 py-4 text-base transition-colors duration-200"
          >
            Commission a Song
          </Link>
        </div>
      </section>
    </div>
  );
}
