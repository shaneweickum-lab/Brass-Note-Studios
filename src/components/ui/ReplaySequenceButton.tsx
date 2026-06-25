"use client";

import { Zap } from "lucide-react";

export default function ReplaySequenceButton() {
  return (
    <button
      onClick={() => window.dispatchEvent(new CustomEvent("bns-replay-sequence"))}
      className="inline-flex items-center gap-1.5 text-teal/40 hover:text-teal text-xs font-body transition-colors duration-200 group"
    >
      <Zap className="w-3 h-3 group-hover:scale-110 transition-transform duration-200" />
      Replay the launch sequence
    </button>
  );
}
