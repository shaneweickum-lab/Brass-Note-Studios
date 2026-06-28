"use client";

import { Play, Pause } from "lucide-react";
import { usePlayer } from "@/hooks/usePlaylist";
import { cn } from "@/lib/utils";
import type { Song } from "@/types";

// ── Waveform placeholder ────────────────────────────────────────────────────
const WAVE_HEIGHTS = [10, 22, 36, 28, 44, 32, 48, 38, 28, 18, 30, 12];
const WAVE_DELAYS  = [0, 0.1, 0.05, 0.15, 0.08, 0.12, 0.03, 0.18, 0.07, 0.14, 0.09, 0.16];

function Waveform({ color }: { color: string }) {
  return (
    <div className="flex items-end justify-center gap-[3px] h-12 relative z-10">
      {WAVE_HEIGHTS.map((h, i) => (
        <div
          key={i}
          className="w-[3px] rounded-sm"
          style={{
            height: h,
            background: color,
            opacity: 0.7,
            animation: "wave-bar 1s ease-in-out infinite alternate",
            animationDelay: `${WAVE_DELAYS[i]}s`,
          }}
        />
      ))}
    </div>
  );
}

// ── Props ───────────────────────────────────────────────────────────────────
interface TrackCardProps {
  song: Song;
  allSongs: Song[];
  wide?: boolean; // hero/featured layout — side-by-side on md+
}

export default function TrackCard({ song, allSongs, wide = false }: TrackCardProps) {
  const { currentSongId, playerState, play, pause, resume } = usePlayer();

  const isCurrentSong = currentSongId === song.id;
  const isPlaying     = isCurrentSong && (playerState === "playing" || playerState === "loading");
  const hasAudio      = Boolean(song.audioFile);
  const hasSunoLink   = Boolean(song.sunoUrl);
  const isPlayable    = hasAudio || hasSunoLink;

  const handleToggle = () => {
    if (!isPlayable) return;
    if (!hasAudio) {
      window.open(song.sunoUrl, "_blank", "noopener,noreferrer");
      return;
    }
    if (isCurrentSong) {
      playerState === "playing" ? pause() : resume();
    } else {
      play(song.id, allSongs);
    }
  };

  // ── Art area (shared between both variants) ─────────────────────────────
  const artArea = (
    <div
      className={cn(
        "relative overflow-hidden flex items-center justify-center shrink-0",
        wide ? "h-[220px] md:h-auto md:w-[300px]" : "h-[180px]"
      )}
      style={{ background: "linear-gradient(135deg, #0a1525, #111827)" }}
    >
      {/* Radial glow pool */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-48 h-48 rounded-full blur-2xl"
          style={{ background: wide ? "rgba(13,148,136,0.12)" : "rgba(212,168,67,0.12)" }}
        />
      </div>

      {/* Cover image OR waveform */}
      {song.coverImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={song.coverImage}
          alt={song.title}
          className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-[1.04] transition-all duration-500"
        />
      ) : (
        <Waveform color={wide ? "#0D9488" : "#D4A843"} />
      )}

      {/* Bottom fade overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(8,13,24,0.3) 60%, rgba(8,13,24,0.85) 100%)",
        }}
      />

      {/* Description hover overlay — standard cards only */}
      {!wide && song.description && (
        <div className="absolute inset-0 flex items-end p-4 z-10 pointer-events-none">
          <div
            className="w-full translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300"
            style={{ background: "linear-gradient(to top, rgba(8,13,24,0.97) 0%, rgba(8,13,24,0.85) 70%, transparent 100%)" }}
          >
            <p className="text-text-muted font-body text-xs leading-relaxed line-clamp-4 pt-6">
              {song.description}
            </p>
          </div>
        </div>
      )}

      {/* Hover play / active pause button */}
      {isPlayable && (
        <button
          onClick={handleToggle}
          className={cn(
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
            "w-[52px] h-[52px] rounded-full flex items-center justify-center z-20",
            "transition-all duration-250 shadow-[0_4px_20px_rgba(212,168,67,0.4)]",
            "bg-gold hover:bg-gold-light",
            isPlaying
              ? "opacity-100 scale-100"
              : "opacity-0 scale-[0.85] group-hover:opacity-100 group-hover:scale-100"
          )}
          aria-label={isPlaying ? `Pause ${song.title}` : `Play ${song.title}`}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 text-background" />
          ) : (
            <Play className="w-5 h-5 text-background ml-0.5" />
          )}
        </button>
      )}

      {/* Now-playing bars (top-right, shown when active) */}
      {isPlaying && (
        <div className="absolute top-3 right-3 flex items-end gap-[2px] h-4 z-10">
          {[60, 100, 40].map((pct, i) => (
            <div
              key={i}
              className="w-[3px] rounded-full bg-gold"
              style={{
                height: `${pct}%`,
                animation: "wave-bar 0.6s ease-in-out infinite alternate",
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );

  // ── Card body (shared between both variants) ────────────────────────────
  const cardBody = (
    <div className={cn("relative", wide ? "p-7 md:p-8 flex flex-col justify-center" : "p-5")}>
      {/* Thin brass / teal rule at top */}
      <div
        className="h-px mb-4"
        style={{
          background: `linear-gradient(to right, ${
            wide ? "rgba(13,148,136,0.4)" : "rgba(212,168,67,0.35)"
          }, transparent)`,
        }}
      />

      {/* Production label */}
      <div className="flex items-center gap-1.5 mb-2">
        <div
          className="w-4 h-px shrink-0"
          style={{ background: wide ? "rgba(13,148,136,0.7)" : "rgba(212,168,67,0.7)" }}
        />
        <p className="text-gold font-body text-[10px] font-semibold uppercase tracking-[0.18em]">
          A Brass Note Studios Production
        </p>
      </div>

      {/* Title */}
      <h3
        className={cn(
          "font-display text-text-base leading-tight",
          wide ? "text-2xl mb-2" : "text-lg mb-1.5"
        )}
      >
        {song.title}
      </h3>

      {/* Client name */}
      <p
        className={cn(
          "font-body font-medium text-teal",
          wide ? "text-base mb-4" : "text-sm mb-3"
        )}
      >
        {song.clientName}
      </p>

      {/* Description — wide variant only (standard cards show it on art hover) */}
      {wide && song.description && (
        <p className="text-text-muted font-body text-sm leading-relaxed mb-5 max-w-[520px]">
          {song.description}
        </p>
      )}

      {/* Divider */}
      <div className="h-px bg-white/[0.06] mb-3" />

      {/* Footer: tags only — no Suno link */}
      <div className="flex gap-1.5 flex-wrap">
        {song.genre && (
          <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-gold bg-gold/[0.08] border border-gold/[0.25] px-2.5 py-1 rounded-full group-hover:bg-gold/[0.14] group-hover:border-gold/40 transition-colors">
            {song.genre}
          </span>
        )}
        <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-teal bg-teal/[0.08] border border-teal/[0.25] px-2.5 py-1 rounded-full group-hover:bg-teal/[0.14] group-hover:border-teal/40 transition-colors">
          {song.category}
        </span>
      </div>
    </div>
  );

  // ── Wide (hero) card ────────────────────────────────────────────────────
  if (wide) {
    return (
      <div
        className="group relative rounded-[10px] overflow-hidden border border-white/[0.06] transition-all duration-300 hover:border-teal/40 hover:shadow-[0_16px_48px_rgba(0,0,0,0.5),0_0_32px_rgba(13,148,136,0.1)] flex flex-col md:grid md:grid-cols-[300px_1fr]"
        style={{ background: "linear-gradient(160deg, #0d1f2a 0%, #0d1a22 60%, #080e15 100%)" }}
      >
        {/* Teal top accent stripe */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-teal z-10" />
        {artArea}
        {cardBody}
      </div>
    );
  }

  // ── Standard card ───────────────────────────────────────────────────────
  return (
    <div
      className={cn(
        "group relative rounded-[10px] overflow-hidden border border-white/[0.06] transition-all duration-300",
        "hover:-translate-y-1.5 hover:border-gold/40 hover:shadow-[0_16px_48px_rgba(0,0,0,0.5),0_0_28px_rgba(212,168,67,0.08)]",
        isCurrentSong && !isPlaying && "border-gold/30 shadow-[0_0_16px_rgba(212,168,67,0.1)]",
        isPlaying && "border-gold/50 shadow-[0_0_24px_rgba(212,168,67,0.18)]"
      )}
      style={{ background: "linear-gradient(160deg, #131d30 0%, #0F172A 60%, #080d18 100%)" }}
    >
      {/* Gold top accent stripe */}
      <div className="h-[2px] w-full bg-gold" />
      {artArea}
      {cardBody}
    </div>
  );
}
