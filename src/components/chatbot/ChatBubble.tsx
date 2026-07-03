"use client";

import { MessageCircle, X } from "lucide-react";

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
      className={[
        "fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full",
        "bg-gold border-2 border-gold shadow-lg shadow-gold/20",
        "flex items-center justify-center",
        "hover:bg-gold/90 hover:shadow-gold/40",
        "transition-all duration-300",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none",
      ].join(" ")}
    >
      {open ? (
        <X className="w-5 h-5 text-background" />
      ) : (
        <MessageCircle className="w-5 h-5 text-background" />
      )}
    </button>
  );
}
