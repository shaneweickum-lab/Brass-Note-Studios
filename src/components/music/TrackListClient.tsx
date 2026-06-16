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
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={
              activeCategory === cat
                ? "px-4 py-2 rounded-sm text-sm font-body font-semibold bg-gold text-background"
                : "px-4 py-2 rounded-sm text-sm font-body font-medium border border-white/10 text-text-muted hover:border-gold/30 hover:text-text-base transition-all"
            }
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
