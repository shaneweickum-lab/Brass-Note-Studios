"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import ChatBubble from "./ChatBubble";
import ChatPanel from "./ChatPanel";

export default function AtelierConcierge() {
  const [open, setOpen] = useState(false);
  const [bubbleVisible, setBubbleVisible] = useState(true);
  const [pendingTopic, setPendingTopic] = useState<string | null>(null);
  const pathname = usePathname();
  const heroRef = useRef<Element | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const proactiveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasOpenedRef = useRef(false);

  const openChat = useCallback((topic?: string) => {
    setOpen(true);
    hasOpenedRef.current = true;
    if (topic) setPendingTopic(topic);
  }, []);

  // Expose global open function for use by form "I'm Not Sure" buttons etc.
  useEffect(() => {
    (window as Window & { __openAtelierChat?: (topic?: string) => void }).__openAtelierChat = openChat;
    return () => {
      delete (window as Window & { __openAtelierChat?: (topic?: string) => void }).__openAtelierChat;
    };
  }, [openChat]);

  // Hero IntersectionObserver — hide bubble while hero is in view (desktop only)
  useEffect(() => {
    const hero = document.getElementById("hero-section");
    if (!hero) return;
    heroRef.current = hero;

    const isMobile = () => window.innerWidth < 768;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (isMobile()) { setBubbleVisible(true); return; }
        setBubbleVisible(!entry.isIntersecting);
      },
      { threshold: 0.2 }
    );
    observerRef.current.observe(hero);

    const onResize = () => { if (isMobile()) setBubbleVisible(true); };
    window.addEventListener("resize", onResize);
    return () => {
      observerRef.current?.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // Proactive popup on /contact after 25 seconds of inactivity
  useEffect(() => {
    if (proactiveTimerRef.current) {
      clearTimeout(proactiveTimerRef.current);
      proactiveTimerRef.current = null;
    }

    if (pathname === "/contact" && !hasOpenedRef.current) {
      proactiveTimerRef.current = setTimeout(() => {
        if (!hasOpenedRef.current) {
          openChat("contact_proactive");
        }
      }, 25000);
    }

    return () => {
      if (proactiveTimerRef.current) clearTimeout(proactiveTimerRef.current);
    };
  }, [pathname, openChat]);

  // Reset "has opened" flag on page change so proactive can fire on next /contact visit
  useEffect(() => {
    hasOpenedRef.current = open;
  }, [open]);

  return (
    <>
      <ChatBubble
        open={open}
        onClick={() => {
          setOpen((v) => !v);
          hasOpenedRef.current = true;
        }}
        visible={bubbleVisible || open}
      />

      <div
        className={[
          "fixed bottom-24 right-6 z-40",
          "w-[calc(100vw-3rem)] max-w-[400px]",
          "h-[560px] max-h-[calc(100vh-7rem)]",
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
        <ChatPanel
          onClose={() => setOpen(false)}
          pageContext={pathname}
          pendingTopic={pendingTopic}
          onTopicConsumed={() => setPendingTopic(null)}
        />
      </div>
    </>
  );
}
