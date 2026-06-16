import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import TrackCard from "@/components/music/TrackCard";
import type { Song } from "@/types";

interface FeaturedMusicProps {
  songs: Song[];
}

export default function FeaturedMusic({ songs }: FeaturedMusicProps) {
  if (songs.length === 0) return null;

  return (
    <section className="py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-surface">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <SectionHeading
            eyebrow="Commissioned Songs"
            title="Featured Work"
            subtitle="Every song I produce is added to this growing playlist — each one a unique story brought to life."
          />
          <Link
            href="/music"
            className="flex items-center gap-2 text-gold hover:text-gold-light font-body text-sm font-medium transition-colors whitespace-nowrap group"
          >
            View all songs{" "}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {songs.map((song) => (
            <TrackCard key={song.id} song={song} allSongs={songs} />
          ))}
        </div>
      </div>
    </section>
  );
}
