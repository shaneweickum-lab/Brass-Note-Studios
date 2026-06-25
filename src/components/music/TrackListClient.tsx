"use client";

import { useState } from "react";
import TrackCard from "./TrackCard";
import type { Song } from "@/types";
import { FlaskConical } from "lucide-react";

type Category = "All" | Song["category"];

const CATEGORIES: Category[] = [
  "All",
  "Personal Lyrics",
  "Song Production",
  "Comprehensive Services",
  "Method Development",
];

interface TrackListClientProps {
  songs: Song[];
}

export default function TrackListClient({ songs }: TrackListClientProps) {
  const [activeCategory, setActiveCategory] = useState<Category>("All");

  // First featured song gets the wide hero treatment
  const heroSong = songs.find((s) => s.featured) ?? null;

  const filtered =
    activeCategory === "All"
      ? songs
      : songs.filter((s) => s.category === activeCategory);

  return (
    <div>
      {/* ── Wide hero card for first featured song ─────────────────────── */}
      {heroSong && (
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-5">
            <div className="h-px flex-1 bg-white/[0.05]" />
            <p className="text-teal font-body text-[10px] font-semibold uppercase tracking-[0.22em]">
              Featured Production
            </p>
            <div className="h-px flex-1 bg-white/[0.05]" />
          </div>
          <TrackCard song={heroSong} allSongs={songs} wide />
        </div>
      )}

      {/* ── Portfolio section label ─────────────────────────────────────── */}
      <div className="flex items-center gap-4 mb-6">
        <div className="h-px flex-1 bg-white/[0.05]" />
        <p className="text-text-subtle font-body text-[10px] font-semibold uppercase tracking-[0.22em]">
          Commission Portfolio
        </p>
        <div className="h-px flex-1 bg-white/[0.05]" />
      </div>

      {/* ── Filter tabs ─────────────────────────────────────────────────── */}
      <div className="flex overflow-x-auto gap-2 mb-6 pb-1 -mx-1 px-1 hide-scrollbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap shrink-0 px-4 py-2 rounded-sm text-sm font-body font-semibold transition-all ${
              activeCategory === cat
                ? "bg-gold text-background"
                : "border border-white/10 text-text-muted hover:border-gold/30 hover:text-text-base"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Method Development info banner */}
      {activeCategory === "Method Development" && (
        <div className="flex items-start gap-3 bg-surface border border-gold/20 rounded-lg px-5 py-4 mb-8">
          <FlaskConical className="w-5 h-5 text-gold shrink-0 mt-0.5" />
          <div>
            <p className="text-gold font-body text-xs uppercase tracking-[0.15em] font-semibold mb-1">
              Method Development
            </p>
            <p className="text-text-muted font-body text-sm leading-relaxed">
              These tracks are technical productions created during the research and development of the Brass Note Method — stress tests, experiments, and proof-of-concept generations used to discover and verify the framework&apos;s capabilities.
            </p>
          </div>
        </div>
      )}

      {/* ── Track grid ──────────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <p className="text-text-muted text-center py-16">
          No songs in this category yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((song) => (
            <TrackCard key={song.id} song={song} allSongs={filtered} />
          ))}
        </div>
      )}
    </div>
  );
}
