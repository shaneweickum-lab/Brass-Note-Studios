"use client";

import { useMemo } from "react";
import { PlayerContext, usePlayerState } from "@/hooks/usePlaylist";
import type { Song } from "@/types";

interface PlayerProviderProps {
  children: React.ReactNode;
  initialSongs: Song[];
}

export default function PlayerProvider({
  children,
  initialSongs,
}: PlayerProviderProps) {
  const playerState = usePlayerState(initialSongs);
  const value = useMemo(() => playerState, [playerState]);

  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
}
