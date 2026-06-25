"use client";

import { usePlayer } from "@/hooks/usePlaylist";
import { formatTime } from "@/lib/utils";
import { SkipBack, SkipForward, Play, Pause, Volume2, VolumeX, Music } from "lucide-react";
import { cn } from "@/lib/utils";

const WAVE_HEIGHTS = [8, 14, 18, 12, 10];
const WAVE_DELAYS  = [0.18, 0.30, 0.42, 0.30, 0.18];

export default function PlaylistPlayer() {
  const {
    currentSong,
    playerState,
    currentTime,
    duration,
    volume,
    pause,
    resume,
    next,
    prev,
    seek,
    setVolume,
  } = usePlayer();

  if (!currentSong || playerState === "idle") return null;

  const isPlaying = playerState === "playing" || playerState === "loading";
  const progress  = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-md border-t border-gold/20">
      {/* Full-width scrubber at the very top of the bar */}
      <div className="relative h-1 w-full">
        <div className="absolute inset-0 bg-white/10" />
        <div
          className="absolute inset-y-0 left-0 bg-gold transition-none"
          style={{ width: `${progress}%` }}
        />
        <input
          type="range"
          min={0}
          max={duration || 0}
          value={currentTime}
          step={0.1}
          onChange={(e) => seek(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
          aria-label="Seek"
        />
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-3">
        {/* ── Single row: info · controls · volume ── */}
        <div className="flex items-center gap-2 sm:gap-4">

          {/* Track info — shrinks on mobile, full on sm+ */}
          <div className="flex items-center gap-2 min-w-0 flex-1 sm:flex-none sm:w-52">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded bg-gold-shimmer flex items-center justify-center shrink-0 border border-gold/20">
              <Music className="w-4 h-4 sm:w-5 sm:h-5 text-gold/60" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-text-base text-xs sm:text-sm font-medium font-display truncate">
                  {currentSong.title}
                </p>
                {/* Animated waveform */}
                <div className="flex items-end gap-[2px] h-3.5 shrink-0">
                  {WAVE_HEIGHTS.map((h, i) => (
                    <div
                      key={i}
                      className="w-[2px] sm:w-[3px] rounded-full bg-gold"
                      style={{
                        height: h,
                        animation: "wave-bar 0.7s ease-in-out infinite alternate",
                        animationDelay: `${WAVE_DELAYS[i]}s`,
                        animationPlayState: isPlaying ? "running" : "paused",
                      }}
                    />
                  ))}
                </div>
              </div>
              <p className="text-text-muted text-[10px] sm:text-xs truncate">
                {currentSong.clientName}
              </p>
            </div>
          </div>

          {/* Controls — centered */}
          <div className="flex items-center gap-3 sm:gap-5 shrink-0 mx-auto sm:mx-0 sm:flex-1 sm:justify-center">
            {/* Timestamps — hidden on mobile, shown sm+ */}
            <span className="hidden sm:block text-text-subtle text-xs w-8 text-right shrink-0">
              {formatTime(currentTime)}
            </span>

            <button
              onClick={prev}
              className="text-text-muted hover:text-gold transition-colors"
              aria-label="Previous track"
            >
              <SkipBack className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <button
              onClick={isPlaying ? pause : resume}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gold hover:bg-gold-light flex items-center justify-center transition-colors shrink-0"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 sm:w-5 sm:h-5 text-background" />
              ) : (
                <Play className="w-4 h-4 sm:w-5 sm:h-5 text-background translate-x-0.5" />
              )}
            </button>

            <button
              onClick={next}
              className="text-text-muted hover:text-gold transition-colors"
              aria-label="Next track"
            >
              <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <span className="hidden sm:block text-text-subtle text-xs w-8 shrink-0">
              {formatTime(duration)}
            </span>
          </div>

          {/* Volume — hidden on mobile */}
          <div className="hidden sm:flex items-center gap-2 w-28 shrink-0">
            <button
              onClick={() => setVolume(volume === 0 ? 0.8 : 0)}
              className="text-text-muted hover:text-gold transition-colors"
              aria-label={volume === 0 ? "Unmute" : "Mute"}
            >
              {volume === 0 ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <div className="flex-1 relative h-1">
              <div className="absolute inset-0 bg-white/10 rounded-full" />
              <div
                className="absolute inset-y-0 left-0 bg-gold/60 rounded-full"
                style={{ width: `${volume * 100}%` }}
              />
              <input
                type="range"
                min={0}
                max={1}
                step={0.02}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className={cn("absolute inset-0 w-full opacity-0 cursor-pointer h-full")}
                aria-label="Volume"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
