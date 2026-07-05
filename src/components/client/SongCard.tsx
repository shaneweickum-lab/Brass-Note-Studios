"use client";

import { useState } from "react";
import type { ClientSong } from "@/types/commission";
import { STAGE_LABELS } from "@/types/commission";
import StageTracker from "./StageTracker";
import RevisionCard from "./RevisionCard";

interface SongCardProps {
  song: ClientSong;
}

const STAGE_PILL_COLORS: Record<string, string> = {
  intake: "bg-white/5 text-text-muted border-white/10",
  writing: "bg-teal/5 text-teal border-teal/20",
  production: "bg-teal/5 text-teal border-teal/20",
  review: "bg-gold/5 text-gold border-gold/20",
  revision: "bg-gold/5 text-gold border-gold/20",
  delivered: "bg-teal/10 text-teal border-teal/30",
};

export default function SongCard({ song }: SongCardProps) {
  const [expanded, setExpanded] = useState(false);

  const trackLabel = `Track ${String(song.trackNumber).padStart(2, "0")}`;
  const pillColor = STAGE_PILL_COLORS[song.productionStage] ?? "bg-white/5 text-text-muted border-white/10";

  return (
    <div className="bg-surface border border-white/8 rounded-sm overflow-hidden transition-all duration-200">
      {/* Card header — always visible */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 hover:bg-white/2 transition-colors focus:outline-none focus:ring-1 focus:ring-gold/30 focus:ring-inset"
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-4 min-w-0">
          {/* Track number */}
          <span className="font-display text-gold text-lg font-semibold flex-shrink-0">
            {trackLabel}
          </span>

          {/* Title */}
          <span className="font-body text-text-base truncate">
            {song.title || "Untitled"}
          </span>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Stage pill */}
          <span className={`font-body text-xs tracking-wide px-2.5 py-1 rounded-full border ${pillColor}`}>
            {STAGE_LABELS[song.productionStage]}
          </span>

          {/* Revisions badge */}
          <span className="font-mono text-xs text-text-subtle">
            {song.revisionsRemaining} rev
          </span>

          {/* Chevron */}
          <svg
            className={`w-4 h-4 text-text-subtle transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-white/8 px-6 py-6 space-y-8">
          {/* Stage tracker */}
          <section>
            <h3 className="font-display text-text-muted text-sm tracking-widest uppercase mb-4">
              Production Stage
            </h3>
            <StageTracker currentStage={song.productionStage} />
          </section>

          {/* Revisions */}
          <section>
            <h3 className="font-display text-text-muted text-sm tracking-widest uppercase mb-4">
              Revisions
            </h3>
            <RevisionCard revisionsRemaining={song.revisionsRemaining} />
          </section>

          {/* Lyrics */}
          {song.lyricsReady && song.lyrics && (
            <section>
              <h3 className="font-display text-text-muted text-sm tracking-widest uppercase mb-4">
                Your Lyrics
              </h3>
              <div className="px-4 sm:px-8 py-6 text-center">
                <p
                  className="font-display text-text-base text-lg leading-loose whitespace-pre-line"
                  style={{ fontWeight: 400 }}
                >
                  {song.lyrics}
                </p>
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
