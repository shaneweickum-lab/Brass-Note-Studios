"use client";

import { useState } from "react";

interface Props {
  id: string;
  label?: string;
  /** Compact = inline chip; full = stacked with label and larger monospace */
  compact?: boolean;
  /** Muted = taupe/warm-white color instead of gold (full commission ID) */
  muted?: boolean;
}

export default function ClientIdCopy({ id, label, compact, muted }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available — silent fail
    }
  }

  if (compact) {
    return (
      <button
        onClick={handleCopy}
        title={`Copy ${label ?? "ID"}`}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded border font-mono text-sm transition-colors ${
          muted
            ? "bg-white/5 border-white/10 text-text-muted hover:bg-white/10"
            : "bg-gold/10 border-gold/30 text-gold hover:bg-gold/20"
        }`}
      >
        {id}
        <span className={`font-body text-xs ${muted ? "text-text-subtle" : "text-gold/70"}`}>
          {copied ? "Copied!" : "Copy"}
        </span>
      </button>
    );
  }

  return (
    <div className="space-y-1.5">
      {label && (
        <p className="font-body text-xs text-text-subtle uppercase tracking-[0.15em]">{label}</p>
      )}
      <div className="flex items-center gap-3">
        <code
          className={`font-mono tracking-wide ${
            muted ? "text-base text-text-muted" : "text-xl text-gold"
          }`}
        >
          {id}
        </code>
        <button
          onClick={handleCopy}
          className={`px-3 py-1 border font-body text-xs rounded transition-colors ${
            muted
              ? "border-white/20 text-text-muted hover:bg-white/10"
              : "border-gold/40 text-gold hover:bg-gold/10"
          }`}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
}
