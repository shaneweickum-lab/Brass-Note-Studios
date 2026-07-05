"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

// Captures the beforeinstallprompt event and surfaces a discreet install
// button. Only renders when the browser supports PWA installation and the
// app hasn't already been installed.
export default function PwaInstallButton() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);

    // Hide if already running as installed PWA
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setInstalled(true);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!prompt || installed) return null;

  const handleInstall = async () => {
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === "accepted") {
      setPrompt(null);
      setInstalled(true);
    }
  };

  return (
    <button
      onClick={handleInstall}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded font-body text-xs border border-gold/30 text-gold/70 hover:text-gold hover:border-gold/60 hover:bg-gold/5 transition-colors"
      title="Install BNS Admin as an app"
    >
      <Download className="w-3 h-3 shrink-0" />
      Install Admin App
    </button>
  );
}
