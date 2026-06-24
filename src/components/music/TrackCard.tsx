"use client";

import { Play, Pause, ExternalLink, Music } from "lucide-react";
import { usePlayer } from "@/hooks/usePlaylist";
import { cn } from "@/lib/utils";
import type { Song } from "@/types";

interface TrackCardProps {
  song: Song;
  allSongs: Song[];
}

export default function TrackCard({ song, allSongs }: TrackCardProps) {
  const { currentSongId, playerState, play, pause, resume } = usePlayer();

  const isCurrentSong = currentSongId === song.id;
  const isPlaying =
    isCurrentSong && (playerState === "playing" || playerState === "loading");
  const hasError = isCurrentSong && playerState === "error";
  const hasAudio = Boolean(song.audioSource.mp3Url);
  const hasSunoLink = Boolean(song.audioSource.sunoUrl);

  const handleToggle = () => {
    if (isCurrentSong) {
      if (playerState === "playing") pause();
      else resume();
    } else {
      play(song.id, allSongs);
    }
  };

  return (
    <div
      className={cn(
        "group relative bg-surface rounded-lg p-5 border transition-all duration-300",
        isCurrentSong
          ? "border-gold/50 shadow-lg shadow-gold/10"
          : "border-white/5 hover:border-gold/25"
      )}
    >
      {/* Now playing indicator */}
      {isPlaying && (
        <div className="absolute top-3 right-3 flex gap-0.5 items-end h-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-0.5 bg-gold rounded-full animate-bounce"
              style={{
                height: `${[60, 100, 40][i - 1]}%`,
                animationDelay: `${(i - 1) * 0.15}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="flex gap-4">
        {/* Cover art */}
        <div className="w-16 h-16 rounded-md bg-gold-shimmer border border-gold/10 flex items-center justify-center shrink-0 overflow-hidden">
          {song.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={song.coverImage}
              alt={song.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <Music className="w-7 h-7 text-gold/40" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-lg text-text-base leading-tight truncate">
            {song.title}
          </h3>
          <p className="text-text-muted text-sm mt-0.5 truncate">
            {song.clientName}
          </p>
          <p className="text-gold text-xs italic mt-1 font-body">
            A Brass Note Studios Production
          </p>
          {song.genre && (
            <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-gold/10 text-gold-light font-body">
              {song.genre}
            </span>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/5">
        {hasAudio && !hasError ? (
          <button
            onClick={handleToggle}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-sm text-sm font-body font-medium transition-all duration-200",
              isCurrentSong
                ? "bg-gold text-background hover:bg-gold-light"
                : "border border-gold/40 text-gold hover:bg-gold/10"
            )}
            aria-label={isPlaying ? `Pause ${song.title}` : `Play ${song.title}`}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            {isPlaying ? "Pause" : "Play"}
          </button>
        ) : hasSunoLink ? (
          <a
            href={song.audioSource.sunoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-sm text-sm font-body font-medium border border-gold/40 text-gold hover:bg-gold/10 transition-all duration-200"
          >
            <ExternalLink className="w-4 h-4" />
            Listen on Suno
          </a>
        ) : null}

        {song.description && (
          <p className="text-text-subtle text-xs ml-auto text-right max-w-[40%] leading-relaxed hidden sm:block">
            {song.description}
          </p>
        )}
      </div>
    </div>
  );
}
