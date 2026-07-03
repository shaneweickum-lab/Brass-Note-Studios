"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import ChatBubble from "./ChatBubble";
import ChatPanel from "./ChatPanel";

export default function AtelierConcierge() {
  const [open, setOpen] = useState(false);
  const [bubbleVisible, setBubbleVisible] = useState(true);
  const [pendingTopic, setPendingTopic] = useState<string | null>(null);
  const pathname = usePathname();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const proactiveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasOpenedRef = useRef(false);

  const openChat = useCallback((topic?: string) => {
    setOpen(true);
    hasOpenedRef.current = true;
    if (topic) setPendingTopic(topic);
  }, []);

  // Expose global open function for "I'm Not Sure" buttons etc.
  useEffect(() => {
    (window as Window & { __openAtelierChat?: (topic?: string) => void }).__openAtelierChat = openChat;
    return () => {
      delete (window as Window & { __openAtelierChat?: (topic?: string) => void }).__openAtelierChat;
    };
  }, [openChat]);

  // Lock body scroll on mobile when open
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile && open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Hero IntersectionObserver — hide bubble while hero is in view (desktop only)
  useEffect(() => {
    const hero = document.getElementById("hero-section");
    if (!hero) return;

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

  // Proactive popup on /contact after 25 s of inactivity
  useEffect(() => {
    if (proactiveTimerRef.current) clearTimeout(proactiveTimerRef.current);
    if (pathname === "/contact" && !hasOpenedRef.current) {
      proactiveTimerRef.current = setTimeout(() => {
        if (!hasOpenedRef.current) openChat("contact_proactive");
      }, 25000);
    }
    return () => { if (proactiveTimerRef.current) clearTimeout(proactiveTimerRef.current); };
  }, [pathname, openChat]);

  useEffect(() => { hasOpenedRef.current = open; }, [open]);

  const closeChat = useCallback(() => setOpen(false), []);

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 md:hidden transition-opacity duration-300",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={closeChat}
        aria-hidden
      />

      <ChatBubble
        open={open}
        onClick={() => { setOpen((v) => !v); hasOpenedRef.current = true; }}
        visible={bubbleVisible || open}
      />

      {/* Chat panel — bottom sheet on mobile, corner widget on desktop */}
      <div
        className={cn(
          "fixed z-50 flex flex-col overflow-hidden bg-background",
          "transition-all duration-300 ease-out",
          // Mobile: full-width bottom sheet that slides up
          "inset-x-0 bottom-0 rounded-t-2xl border-t border-border-subtle",
          "h-[92dvh] max-h-[92dvh]",
          // Desktop: corner floating widget
          "md:inset-auto md:bottom-24 md:right-6 md:rounded-none md:border",
          "md:w-[400px] md:h-[560px] md:max-h-[calc(100vh-7rem)]",
          "md:shadow-2xl md:shadow-black/60 md:origin-bottom-right",
          // Open / closed states
          open
            ? "translate-y-0 md:scale-100 md:opacity-100 pointer-events-auto shadow-2xl"
            : "translate-y-full md:translate-y-0 md:scale-95 md:opacity-0 pointer-events-none"
        )}
        role="dialog"
        aria-label="Atelier Concierge chat"
        aria-hidden={!open}
        aria-modal={open}
      >
        <ChatPanel
          onClose={closeChat}
          pageContext={pathname}
          pendingTopic={pendingTopic}
          onTopicConsumed={() => setPendingTopic(null)}
        />
      </div>
    </>
  );
}
