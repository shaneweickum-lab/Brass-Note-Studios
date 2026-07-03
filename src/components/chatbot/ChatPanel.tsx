"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { X, Send } from "lucide-react";
import ChatMessage from "./ChatMessage";
import LeadCapture from "./LeadCapture";
import TypingIndicator from "./TypingIndicator";
import { chatbotConfig } from "../../../chatbot/config";

interface NavigationCardData {
  label: string;
  href: string;
  description?: string;
}

interface Message {
  id: string;
  role: "user" | "bot";
  text: string;
  navigationCard?: NavigationCardData;
  quickReplies?: string[];
  showLeadCapture?: boolean;
}

interface Props {
  onClose: () => void;
}

const GREETING: Message = {
  id: "greeting",
  role: "bot",
  text: "Welcome to Brass Note Studios — a bespoke atelier for original music. I'm the Atelier Concierge, here to help you explore commissions, pricing, and everything in between. What brings you here today?",
  quickReplies: ["Commission a song", "View pricing", "About the studio"],
};

export default function ChatPanel({ onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [sessionId] = useState(() => Math.random().toString(36).slice(2));
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      const userMsg: Message = {
        id: Date.now().toString(),
        role: "user",
        text: text.trim(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setTyping(true);

      try {
        await new Promise((r) =>
          setTimeout(r, chatbotConfig.TYPING_DELAY_MS)
        );

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text.trim(), sessionId }),
        });

        const data = (await res.json()) as {
          text: string;
          navigationCard?: NavigationCardData;
          quickReplies?: string[];
          leadCapture?: boolean;
        };

        const botMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: "bot",
          text: data.text,
          navigationCard: data.navigationCard,
          quickReplies: data.quickReplies,
          showLeadCapture: data.leadCapture,
        };
        setMessages((prev) => [...prev, botMsg]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "bot",
            text: "I'm having trouble connecting right now. Please try again or reach us directly via our contact form.",
          },
        ]);
      } finally {
        setTyping(false);
      }
    },
    [sessionId]
  );

  async function handleLeadSubmit(data: {
    name: string;
    email: string;
    interest?: string;
  }) {
    await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle bg-surface flex-shrink-0">
        <div>
          <p className="font-display text-text-base text-sm font-medium">
            Atelier Concierge
          </p>
          <p className="text-text-muted text-[10px] font-body tracking-[0.15em] uppercase mt-0.5">
            Brass Note Studios
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-text-muted hover:text-text-base p-1.5 transition-colors"
          aria-label="Close chat"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-0 min-h-0">
        {messages.map((msg) => (
          <div key={msg.id}>
            <ChatMessage
              role={msg.role}
              text={msg.text}
              navigationCard={msg.navigationCard}
              quickReplies={msg.quickReplies}
              onQuickReply={sendMessage}
            />
            {msg.showLeadCapture && (
              <div className="pl-8">
                <LeadCapture onSubmit={handleLeadSubmit} />
              </div>
            )}
          </div>
        ))}
        {typing && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 border-t border-border-subtle px-4 py-3 flex items-center gap-2">
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about commissions, pricing…"
          className="flex-1 bg-background border border-border-subtle text-text-base text-sm font-body px-3 py-2.5 placeholder-text-muted/50 focus:outline-none focus:border-gold/50 transition-colors min-w-0"
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || typing}
          className="flex-shrink-0 border border-gold/40 text-gold p-2.5 hover:bg-gold/8 hover:border-gold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
