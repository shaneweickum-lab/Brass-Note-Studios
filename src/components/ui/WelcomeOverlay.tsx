"use client";

import { useEffect, useState } from "react";
import { Volume2 } from "lucide-react";
import { usePlayer } from "@/hooks/usePlaylist";

const ANTHEM_ID = "song-007";
const STORAGE_KEY = "bns-welcome-seen";

export default function WelcomeOverlay() {
  const [visible, setVisible] = useState(false);
  const { play } = usePlayer();

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  const dismiss = (withMusic: boolean) => {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
    if (withMusic) play(ANTHEM_ID);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center px-6"
      style={{ background: "rgba(13,10,11,0.97)", backdropFilter: "blur(6px)" }}
    >
      <div className="text-center max-w-sm mx-auto">

        {/* Pulsing volume icon */}
        <div className="relative w-20 h-20 mx-auto mb-8">
          <span className="absolute inset-0 rounded-full bg-gold/20 animate-ping" style={{ animationDuration: "1.8s" }} />
          <div className="relative w-20 h-20 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center">
            <Volume2 className="w-9 h-9 text-gold" />
          </div>
        </div>

        {/* Eyebrow */}
        <p className="text-gold font-body text-[10px] uppercase tracking-[0.25em] font-semibold mb-3">
          Welcome to Brass Note Studios
        </p>

        {/* Headline */}
        <h2 className="font-display text-3xl md:text-4xl text-text-base font-bold leading-tight mb-4">
          Turn up your volume.
        </h2>

        {/* Subtext */}
        <p className="text-text-muted font-body text-sm leading-relaxed mb-10">
          For the best experience, turn up your volume before you enter.
          We have music to share.
        </p>

        {/* Primary CTA */}
        <button
          onClick={() => dismiss(true)}
          className="inline-flex items-center gap-3 bg-gold text-background font-body font-semibold px-8 py-4 rounded-sm hover:bg-gold-light transition-colors duration-200 text-sm tracking-wide w-full justify-center"
        >
          <Volume2 className="w-4 h-4" />
          I&apos;m Ready — Turn It Up
        </button>

        {/* Skip */}
        <button
          onClick={() => dismiss(false)}
          className="block mx-auto mt-4 text-text-subtle/50 text-xs font-body hover:text-text-subtle transition-colors"
        >
          Skip
        </button>

      </div>
    </div>
  );
}
