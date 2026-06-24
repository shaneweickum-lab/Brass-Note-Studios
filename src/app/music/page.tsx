import type { Metadata } from "next";
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

export default function MusicPage() {
  const songs = songsData.songs as Song[];

  return (
    <div>
      {/* Page hero */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 60% 50% at 50% 0%, #C9921A33, transparent 70%)",
          }}
        />
        <div className="max-w-7xl mx-auto relative z-10">
          <SectionHeading
            eyebrow="Commissioned Songs"
            title="Our Work"
            subtitle="Every song on this page was commissioned through Brass Note Studios and produced for the client listed beneath each title."
            centered
          />
          <div className="mt-4 flex items-center justify-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-gold" />
            <p className="text-gold-light text-sm italic font-body">
              All music written &amp; produced by Brass Note Studios
            </p>
          </div>
        </div>
      </section>

      <GoldDivider className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12" />

      {/* Track list */}
      <section className="px-4 sm:px-6 lg:px-8 pb-32 max-w-7xl mx-auto">
        <TrackListClient songs={songs} />
      </section>
    </div>
  );
}
