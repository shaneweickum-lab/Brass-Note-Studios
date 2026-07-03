"use client";

import { MessageCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onClick: () => void;
  visible: boolean;
}

export default function ChatBubble({ open, onClick, visible }: Props) {
  return (
    <button
      onClick={onClick}
      aria-label={open ? "Close chat" : "Open chat"}
      // bottom-10 on mobile clears the iPhone home indicator (≈34px safe area)
      // bottom-6 on desktop is fine
      className={cn(
        "fixed bottom-10 right-5 z-40 md:bottom-6 md:right-6",
        "w-14 h-14 rounded-full",
        "bg-gold shadow-lg shadow-gold/25",
        "flex items-center justify-center",
        "hover:bg-gold/90 active:scale-95",
        "transition-all duration-300",
        // Touch-friendly: explicit tap highlight removal
        "touch-none select-none",
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      )}
    >
      {open ? (
        <X className="w-5 h-5 text-background" />
      ) : (
        <MessageCircle className="w-5 h-5 text-background" />
      )}
    </button>
  );
}
