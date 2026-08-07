"use client";

import { useState } from "react";
import { Play, Pause, Download } from "lucide-react";
import { usePlayer } from "@/hooks/usePlaylist";
import type { Song } from "@/types";

interface StoreGridProps {
  songs: Song[];
}

export default function StoreGrid({ songs }: StoreGridProps) {
  if (songs.length === 0) {
    return (
      <p className="text-text-muted text-center py-20 font-body">
        No tracks available for purchase yet — check back soon.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {songs.map((song) => (
        <StoreCard key={song.id} song={song} allSongs={songs} />
      ))}
    </div>
  );
}

function StoreCard({ song, allSongs }: { song: Song; allSongs: Song[] }) {
  const { currentSongId, playerState, play, pause, resume } = usePlayer();
  const [buyLoading, setBuyLoading] = useState(false);

  const isCurrentSong = currentSongId === song.id;
  const isPlaying = isCurrentSong && (playerState === "playing" || playerState === "loading");
  const hasAudio = Boolean(song.audioFile);

  const handleToggle = () => {
    if (!hasAudio) return;
    if (isCurrentSong) {
      playerState === "playing" ? pause() : resume();
    } else {
      play(song.id, allSongs);
    }
  };

  const handleBuy = async () => {
    if (buyLoading) return;
    setBuyLoading(true);
    try {
      const res = await fetch("/api/checkout/song", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ songId: song.id }),
      });
      const data = (await res.json()) as { url?: string };
      if (data.url) window.location.href = data.url;
    } catch {
      // silent
    } finally {
      setBuyLoading(false);
    }
  };

  return (
    <div
      className="group flex flex-col rounded-[10px] overflow-hidden border border-white/[0.06] transition-all duration-300 hover:border-gold/40 hover:shadow-[0_16px_48px_rgba(0,0,0,0.5),0_0_28px_rgba(212,168,67,0.08)]"
      style={{ background: "linear-gradient(160deg, #131d30 0%, #0F172A 60%, #080d18 100%)" }}
    >
      {/* Gold top accent */}
      <div className="h-[2px] w-full bg-gold shrink-0" />

      {/* Art + preview */}
      <div
        className="relative h-[160px] flex items-center justify-center shrink-0"
        style={{ background: "linear-gradient(135deg, #0a1525, #111827)" }}
      >
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-40 h-40 rounded-full blur-2xl" style={{ background: "rgba(212,168,67,0.1)" }} />
        </div>

        {/* Waveform bars */}
        <div className="flex items-end justify-center gap-[3px] h-10">
          {[10, 22, 36, 28, 44, 32, 48, 38, 28, 18, 30, 12].map((h, i) => (
            <div
              key={i}
              className="w-[3px] rounded-sm"
              style={{
                height: h,
                background: "#D4A843",
                opacity: isPlaying ? 0.9 : 0.4,
                animation: isPlaying ? "wave-bar 1s ease-in-out infinite alternate" : undefined,
                animationDelay: isPlaying ? `${i * 0.08}s` : undefined,
              }}
            />
          ))}
        </div>

        {/* Play/pause button */}
        {hasAudio && (
          <button
            onClick={handleToggle}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gold hover:bg-gold-light flex items-center justify-center shadow-[0_4px_20px_rgba(212,168,67,0.4)] transition-all duration-250 opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100"
            aria-label={isPlaying ? `Pause ${song.title}` : `Preview ${song.title}`}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-background" />
            ) : (
              <Play className="w-5 h-5 text-background ml-0.5" />
            )}
          </button>
        )}

        {/* "Preview" label */}
        {hasAudio && (
          <span className="absolute bottom-3 left-3 text-[9px] font-body font-semibold uppercase tracking-[0.15em] text-gold/50">
            Preview available
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <div>
          <h3 className="font-display text-lg text-text-base leading-tight mb-1">{song.title}</h3>
          <p className="text-teal font-body text-sm font-medium">{song.clientName}</p>
        </div>

        {song.description && (
          <p className="text-text-muted font-body text-xs leading-relaxed line-clamp-3">{song.description}</p>
        )}

        <div className="flex gap-1.5 flex-wrap mt-auto pt-2">
          {song.genre && (
            <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-gold bg-gold/[0.08] border border-gold/[0.25] px-2.5 py-1 rounded-full">
              {song.genre}
            </span>
          )}
          <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-teal bg-teal/[0.08] border border-teal/[0.25] px-2.5 py-1 rounded-full">
            Personal Use
          </span>
        </div>

        {/* Buy button — full width, prominent */}
        <button
          onClick={handleBuy}
          disabled={buyLoading}
          className="w-full flex items-center justify-center gap-2 bg-gold hover:bg-gold-light text-background font-body font-semibold text-sm py-3 rounded-sm transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-1"
        >
          <Download className="w-4 h-4" />
          {buyLoading ? "Loading…" : `Buy MP3 — $${song.downloadPrice!.toFixed(2)}`}
        </button>
      </div>
    </div>
  );
}
