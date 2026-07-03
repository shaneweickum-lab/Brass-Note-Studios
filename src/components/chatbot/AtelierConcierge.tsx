"use client";

import { useState, useEffect, useRef } from "react";
import ChatBubble from "./ChatBubble";
import ChatPanel from "./ChatPanel";

export default function AtelierConcierge() {
  const [open, setOpen] = useState(false);
  const [bubbleVisible, setBubbleVisible] = useState(true);
  const heroRef = useRef<Element | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const hero = document.getElementById("hero-section");
    if (!hero) return;
    heroRef.current = hero;

    // On mobile always show bubble; on desktop hide while hero is visible
    const isMobile = () => window.innerWidth < 768;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (isMobile()) {
          setBubbleVisible(true);
          return;
        }
        setBubbleVisible(!entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    observerRef.current.observe(hero);

    const handleResize = () => {
      if (isMobile()) setBubbleVisible(true);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      observerRef.current?.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <ChatBubble
        open={open}
        onClick={() => setOpen((v) => !v)}
        visible={bubbleVisible || open}
      />

      {/* Chat panel */}
      <div
        className={[
          "fixed bottom-24 right-6 z-40",
          "w-[calc(100vw-3rem)] max-w-[380px]",
          "h-[520px] max-h-[calc(100vh-7rem)]",
          "bg-background border border-border-subtle shadow-2xl shadow-black/60",
          "flex flex-col overflow-hidden",
          "transition-all duration-300 origin-bottom-right",
          open
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none",
        ].join(" ")}
        role="dialog"
        aria-label="Atelier Concierge chat"
        aria-hidden={!open}
      >
        <ChatPanel onClose={() => setOpen(false)} />
      </div>
    </>
  );
}
