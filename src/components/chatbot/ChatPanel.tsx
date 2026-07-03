"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { X, Send, ClipboardList } from "lucide-react";
import { useRouter } from "next/navigation";
import ChatMessage from "./ChatMessage";
import LeadCapture from "./LeadCapture";
import TypingIndicator from "./TypingIndicator";
import { chatbotConfig } from "../../../chatbot/config";

interface NavigationCardData {
  label: string;
  href: string;
  description?: string;
  autoNavigate?: boolean;
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
  pageContext?: string;
  pendingTopic?: string | null;
  onTopicConsumed?: () => void;
}

function getGreeting(pageContext?: string): Message {
  if (pageContext === "/contact") {
    return {
      id: "greeting",
      role: "bot",
      text: "You're on the commission form — I'm here to help. I can walk you through each section, explain what any field means, or guide you through the whole thing step by step. What would you like to do?",
      quickReplies: [
        "Walk me through the form",
        "What do I put for the story?",
        "Which commission type is right for me?",
        "What package should I choose?",
      ],
    };
  }
  if (pageContext === "/services") {
    return {
      id: "greeting",
      role: "bot",
      text: "Welcome to our pricing page. I can help you choose the right commission type and package, explain what's included, or take you straight to the form. What would you like to know?",
      quickReplies: [
        "Individual pricing",
        "Organization pricing",
        "Content creator pricing",
        "Help me choose a package",
      ],
    };
  }
  return {
    id: "greeting",
    role: "bot",
    text: "Welcome to Brass Note Studios — a bespoke atelier for original music. I'm the Atelier Concierge, here to help you explore commissions, pricing, and everything in between. What brings you here today?",
    quickReplies: ["Commission a song", "View pricing", "About the studio"],
  };
}

const PROACTIVE_CONTACT_MSG: Message = {
  id: "proactive",
  role: "bot",
  text: "Still with us? If you need help filling out the form — or aren't sure where to start — I can walk you through it step by step. No pressure.",
  quickReplies: [
    "Walk me through the form",
    "Which commission type is right for me?",
    "No thanks, I've got it",
  ],
};

const FORM_HELP_MSG: Message = {
  id: "form_help",
  role: "bot",
  text: "Happy to help! I can explain any section of the form, walk you through the whole thing, or help you figure out which options are right for you. What do you need?",
  quickReplies: [
    "Walk me through the form",
    "What does each commission type mean?",
    "What should I put in the story field?",
    "Help me choose a package",
  ],
};

export default function ChatPanel({
  onClose,
  pageContext,
  pendingTopic,
  onTopicConsumed,
}: Props) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    getGreeting(pageContext),
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [sessionId] = useState(() => Math.random().toString(36).slice(2));
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle pending topics from parent (proactive or "I'm not sure" triggers)
  useEffect(() => {
    if (!pendingTopic) return;
    onTopicConsumed?.();

    let msg: Message | null = null;
    if (pendingTopic === "contact_proactive") {
      msg = { ...PROACTIVE_CONTACT_MSG, id: Date.now().toString() };
    } else if (pendingTopic === "form_help") {
      msg = { ...FORM_HELP_MSG, id: Date.now().toString() };
    } else if (pendingTopic === "form_walk") {
      // Directly trigger form walk
      sendToApi("", true);
      return;
    }

    if (msg) {
      setMessages((prev) => [...prev, msg!]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingTopic]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendToApi = useCallback(
    async (text: string, formWalk = false) => {
      setTyping(true);
      try {
        await new Promise((r) => setTimeout(r, chatbotConfig.TYPING_DELAY_MS));
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: text || "[form walk]",
            sessionId,
            formWalk,
          }),
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

        // Auto-navigate if instructed
        if (data.navigationCard?.autoNavigate && data.navigationCard.href) {
          setTimeout(() => {
            router.push(data.navigationCard!.href);
            onClose();
          }, 1400);
        }
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
    [sessionId, router, onClose]
  );

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
      await sendToApi(text.trim());
    },
    [sendToApi]
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
        <div className="flex items-center gap-2">
          {/* Quick form walk button */}
          {pageContext === "/contact" && (
            <button
              onClick={() => sendToApi("", true)}
              title="Walk me through the form"
              className="text-gold/60 hover:text-gold p-1.5 transition-colors"
              aria-label="Walk me through the form"
            >
              <ClipboardList className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-base p-1.5 transition-colors"
            aria-label="Close chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 min-h-0">
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
          placeholder="Ask about commissions, pricing, the form…"
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
