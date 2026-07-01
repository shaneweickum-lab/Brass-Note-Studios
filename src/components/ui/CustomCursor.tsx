"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onMove = (e: MouseEvent) => {
      dot.style.transform = `translate(${e.clientX - 3}px, ${e.clientY - 3}px)`;
    };
    const onLeave = () => { dot.style.opacity = "0"; };
    const onEnter = () => { dot.style.opacity = "1"; };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
    };
  }, []);

  return (
    <div
      ref={dotRef}
      className="custom-cursor-dot"
      style={{ opacity: 0 }}
      aria-hidden="true"
    />
  );
}
