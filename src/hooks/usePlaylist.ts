"use client";

import {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
  useEffect,
} from "react";
import type { Song, PlayerState, PlayerContextType } from "@/types";

export const PlayerContext = createContext<PlayerContextType | null>(null);

export function usePlayer(): PlayerContextType {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used inside PlayerProvider");
  return ctx;
}

export function usePlayerState(songs: Song[]) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [queue, setQueue] = useState<Song[]>(songs);
  const queueRef = useRef<Song[]>(songs); // always current — avoids stale closure in onEnded
  const [currentSongId, setCurrentSongId] = useState<string | null>(null);
  const [playerState, setPlayerState] = useState<PlayerState>("idle");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);

  useEffect(() => { queueRef.current = queue; }, [queue]);

  useEffect(() => {
    const audio = new Audio();
    audio.volume = 0.8;
    audioRef.current = audio;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onDurationChange = () => setDuration(audio.duration);
    const onEnded = () => {
      setCurrentSongId((id) => {
        const q = queueRef.current;
        const idx = q.findIndex((s) => s.id === id);
        if (idx < q.length - 1) {
          const next = q[idx + 1];
          audio.src = next.audioSource.mp3Url;
          audio.play().catch(() => setPlayerState("error"));
          setPlayerState("playing");
          return next.id;
        }
        setPlayerState("idle");
        return null;
      });
    };
    const onError = () => setPlayerState("error");
    const onPlaying = () => setPlayerState("playing");
    const onPause = () =>
      setPlayerState((s) => (s === "playing" ? "paused" : s));
    const onWaiting = () => setPlayerState("loading");

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("durationchange", onDurationChange);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);
    audio.addEventListener("playing", onPlaying);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("waiting", onWaiting);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("durationchange", onDurationChange);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
      audio.removeEventListener("playing", onPlaying);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("waiting", onWaiting);
      audio.pause();
      audio.src = "";
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const currentSong = queue.find((s) => s.id === currentSongId) ?? null;

  const play = useCallback(
    (songId: string, newQueue?: Song[]) => {
      const audio = audioRef.current;
      if (!audio) return;
      if (newQueue) setQueue(newQueue);
      const targetQueue = newQueue ?? queue;
      const song = targetQueue.find((s) => s.id === songId);
      if (!song) return;

      if (!song.audioSource.mp3Url) {
        if (song.audioSource.sunoUrl) {
          window.open(song.audioSource.sunoUrl, "_blank");
        }
        return;
      }

      // Set up Web Audio API on first play (must be inside user gesture)
      if (!audioCtxRef.current) {
        try {
          const AudioContextClass =
            window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          const ctx = new AudioContextClass();
          const node = ctx.createAnalyser();
          node.fftSize = 2048;
          node.smoothingTimeConstant = 0.85;
          const source = ctx.createMediaElementSource(audio);
          source.connect(node);
          node.connect(ctx.destination);
          audioCtxRef.current = ctx;
          setAnalyser(node);
        } catch {
          // Web Audio not available — visualizer simply won't draw real data
        }
      }
      audioCtxRef.current?.resume();

      setCurrentSongId(songId);
      setPlayerState("loading");
      audio.src = song.audioSource.mp3Url;
      audio.play().catch(() => setPlayerState("error"));
    },
    [queue]
  );

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const resume = useCallback(() => {
    audioRef.current?.play().catch(() => setPlayerState("error"));
  }, []);

  const next = useCallback(() => {
    const idx = queue.findIndex((s) => s.id === currentSongId);
    if (idx < queue.length - 1) play(queue[idx + 1].id);
  }, [queue, currentSongId, play]);

  const prev = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    const idx = queue.findIndex((s) => s.id === currentSongId);
    if (idx > 0) play(queue[idx - 1].id);
  }, [queue, currentSongId, play]);

  const seek = useCallback((time: number) => {
    if (audioRef.current) audioRef.current.currentTime = time;
  }, []);

  const setVolume = useCallback((vol: number) => {
    setVolumeState(vol);
    if (audioRef.current) audioRef.current.volume = vol;
  }, []);

  return {
    queue,
    currentSongId,
    playerState,
    currentTime,
    duration,
    volume,
    play,
    pause,
    resume,
    next,
    prev,
    seek,
    setVolume,
    currentSong,
    analyser,
  };
}
