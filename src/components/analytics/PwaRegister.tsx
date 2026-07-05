"use client";

import { useEffect } from "react";

// Registers the BNS Admin service worker silently on all /admin pages.
// The install button lives on /admin/analytics only (PwaInstallButton).
export default function PwaRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // SW registration is best-effort — fail silently
      });
    }
  }, []);

  return null;
}
