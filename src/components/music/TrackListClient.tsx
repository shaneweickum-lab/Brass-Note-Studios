"use client";

import { useState } from "react";
import TrackCard from "./TrackCard";
import type { Song } from "@/types";

type Category = "All" | Song["category"];

const CATEGORIES: Category[] = [
  "All",
  "Personal Lyrics",
  "Song Production",
  "Comprehensive Services",
];

interface TrackListClientProps {
  songs: Song[];
}

export default function TrackListClient({ songs }: TrackListClientProps) {
  const [activeCategory, setActiveCategory] = useState<Category>("All");

  const filtered =
    activeCategory === "All"
      ? songs
      : songs.filter((s) => s.category === activeCategory);

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex overflow-x-auto gap-2 mb-8 pb-1 -mx-1 px-1">
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

      {/* Track grid */}
      {filtered.length === 0 ? (
        <p className="text-text-muted text-center py-16">
          No songs in this category yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((song) => (
            <TrackCard key={song.id} song={song} allSongs={filtered} />
          ))}
        </div>
      )}
    </div>
  );
}
