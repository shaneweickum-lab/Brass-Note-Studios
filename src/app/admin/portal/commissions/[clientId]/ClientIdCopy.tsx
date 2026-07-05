"use client";

import { useState } from "react";

interface Props {
  clientId: string;
  /** Compact = inline button with ID; full = stacked with larger type */
  compact?: boolean;
}

export default function ClientIdCopy({ clientId, compact }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(clientId);
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
        title="Copy Client ID"
        className="inline-flex items-center gap-2 px-3 py-1.5 bg-gold/10 border border-gold/30 rounded font-mono text-sm text-gold hover:bg-gold/20 transition-colors"
      >
        {clientId}
        <span className="font-body text-xs text-gold/70">
          {copied ? "Copied!" : "Copy"}
        </span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3 mt-2">
      <code className="font-mono text-xl text-gold tracking-wide">{clientId}</code>
      <button
        onClick={handleCopy}
        className="px-3 py-1 border border-gold/40 text-gold font-body text-xs rounded hover:bg-gold/10 transition-colors"
      >
        {copied ? "Copied!" : "Copy Client ID"}
      </button>
    </div>
  );
}
