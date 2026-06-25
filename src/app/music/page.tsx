import type { Metadata } from "next";
import Image from "next/image";
import { Music2, Layers, Zap } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import GoldDivider from "@/components/ui/GoldDivider";
import TrackListClient from "@/components/music/TrackListClient";
import songsData from "@/data/songs.json";
import type { Song } from "@/types";

export const metadata: Metadata = {
  title: "Our Work — Commissioned Songs",
  description:
    "Browse all commissioned songs written and produced by Brass Note Studios. Each song represents a unique story brought to life through music.",
};

const PILLARS = [
  {
    icon: Music2,
    title: "Musicianship First",
    body: "Thirty years of musical craft drives every production decision. The technology serves the emotion — never the other way around.",
  },
  {
    icon: Layers,
    title: "Proprietary Framework",
    body: "Our production methodology is built on a multi-layer system developed and refined through hundreds of generations. Consistent. Repeatable. Professional.",
  },
  {
    icon: Zap,
    title: "Human · AI Collaboration",
    body: "We work with Suno AI at a level most producers haven't reached — pushing the platform past what the community considers possible.",
  },
];

export default function MusicPage() {
  const songs = songsData.songs as Song[];

  return (
    <div>
      {/* Page hero */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background photo */}
        <Image
          src="/images/IMG_5107.png"
          alt=""
          fill
          className="object-cover object-center"
          priority
          aria-hidden="true"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
        <div className="max-w-7xl mx-auto relative z-10">
          <SectionHeading
            eyebrow="Commissioned Songs"
            title="Our Work"
            subtitle="A portfolio of songs commissioned through Brass Note Studios — each one produced for the client listed beneath the title. Not all commissions are included."
            centered
          />
          <div className="mt-4 flex items-center justify-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-gold" />
            <p className="text-gold-light text-sm italic font-body">
              All songs in this portfolio produced through Brass Note Studios
            </p>
          </div>
        </div>
      </section>

      <GoldDivider className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12" />

      {/* Track list */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <TrackListClient songs={songs} />
      </section>

      <GoldDivider className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-20" />

      {/* Photo strip */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative h-64 sm:h-80 rounded-[10px] overflow-hidden border border-white/[0.06]">
            <Image
              src="/images/IMG_5098.png"
              alt="Brass Note Studios"
              fill
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
          <div className="relative h-64 sm:h-80 rounded-[10px] overflow-hidden border border-white/[0.06]">
            <Image
              src="/images/IMG_5099.png"
              alt="Brass Note Studios"
              fill
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        </div>
      </section>

      {/* Our Method panel */}
      <section className="px-4 sm:px-6 lg:px-8 pb-32 max-w-7xl mx-auto">
        <div
          className="relative rounded-[10px] overflow-hidden border border-white/[0.06] border-t-2 border-t-teal p-10 md:p-14"
          style={{ background: "linear-gradient(160deg, #131d30 0%, #0F172A 60%, #080d18 100%)" }}
        >
          {/* Teal background glow — top right */}
          <div
            className="absolute pointer-events-none"
            style={{
              width: 400,
              height: 400,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(13,148,136,0.07) 0%, transparent 70%)",
              top: -100,
              right: -80,
            }}
          />

          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-6 h-px bg-teal shrink-0" />
            <p className="text-teal font-body text-[11px] font-semibold uppercase tracking-[0.22em]">
              Our Method
            </p>
          </div>

          {/* Headline */}
          <h2 className="font-display text-3xl md:text-[2rem] text-text-base font-bold leading-[1.15] mb-8 max-w-xl">
            We reverse engineer our best work
            <br />
            <em className="text-gold not-italic italic">
              so every song we make is better than the last.
            </em>
          </h2>

          {/* Body copy — two columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <p className="text-text-muted font-body text-sm leading-[1.8]">
              At Brass Note Studios, we don&apos;t rely on intuition alone. Every track we produce
              gets analyzed — what worked emotionally, what worked technically, and why. We take
              that knowledge and build it back into the next production, systematically raising the
              floor on quality and consistency with every song we deliver.
            </p>
            <p className="text-text-muted font-body text-sm leading-[1.8]">
              Our team developed a proprietary production framework through years of stress testing,
              reverse engineering, and deep collaboration with Suno AI. The result is a methodology
              that consistently produces professional-level emotional output — music that doesn&apos;t
              just sound good, but moves people.
            </p>
          </div>

          {/* Three pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PILLARS.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="bg-white/[0.03] border border-white/[0.06] border-l-2 border-l-gold rounded-r-[6px] p-5"
              >
                <div className="w-9 h-9 rounded-lg bg-gold/10 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-gold" />
                </div>
                <h3 className="font-display text-base text-text-base font-semibold mb-2">
                  {title}
                </h3>
                <p className="text-text-muted font-body text-[13px] leading-[1.65]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
