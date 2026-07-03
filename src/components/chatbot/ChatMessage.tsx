import NavigationCard from "./NavigationCard";
import { cn } from "@/lib/utils";

interface NavigationCardData {
  label: string;
  href: string;
  description?: string;
}

interface Props {
  role: "user" | "bot";
  text: string;
  navigationCard?: NavigationCardData;
  quickReplies?: string[];
  onQuickReply?: (reply: string) => void;
}

export default function ChatMessage({
  role,
  text,
  navigationCard,
  quickReplies,
  onQuickReply,
}: Props) {
  if (role === "user") {
    return (
      <div className="flex justify-end mb-3">
        <div className="max-w-[80%] bg-gold/12 border border-gold/22 rounded-2xl rounded-br-sm px-4 py-2.5">
          <p className="text-text-base text-[13px] md:text-sm font-body leading-relaxed">
            {text}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2.5 mb-3">
      {/* Avatar */}
      <div className="w-7 h-7 rounded-full bg-gold/20 border border-gold/35 flex items-center justify-center flex-shrink-0 mt-0.5">
        <span className="text-gold text-[9px] font-display font-medium">B</span>
      </div>

      <div className="flex-1 min-w-0">
        {/* Bubble */}
        <div className="bg-surface border border-border-subtle rounded-2xl rounded-tl-sm px-4 py-3">
          <p className="text-text-base text-[13px] md:text-sm font-body leading-relaxed whitespace-pre-line">
            {text}
          </p>
        </div>

        {/* Navigation card */}
        {navigationCard && (
          <NavigationCard
            label={navigationCard.label}
            href={navigationCard.href}
            description={navigationCard.description}
          />
        )}

        {/* Quick replies */}
        {quickReplies && quickReplies.length > 0 && onQuickReply && (
          // Relative wrapper so the gradient can be absolutely positioned
          <div className="relative mt-2">
            <div className="flex gap-2 overflow-x-auto pb-1 md:flex-wrap md:overflow-visible [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {quickReplies.map((reply) => (
                <button
                  key={reply}
                  onClick={() => onQuickReply(reply)}
                  className={cn(
                    "flex-shrink-0",
                    "text-[10px] md:text-[11px] font-body tracking-[0.1em] uppercase",
                    "border border-gold/30 text-gold/75 bg-transparent",
                    "px-3.5 py-2 min-h-[38px] flex items-center",
                    "hover:border-gold hover:text-gold active:bg-gold/10",
                    "transition-all duration-150 rounded-full",
                    "whitespace-nowrap select-none"
                  )}
                >
                  {reply}
                </button>
              ))}
            </div>
            {/* Right-side fade — hints at horizontal scroll on mobile */}
            <div
              className="absolute right-0 top-0 bottom-1 w-8 pointer-events-none md:hidden"
              style={{
                background: "linear-gradient(to left, var(--color-background, #0D0A0B), transparent)",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
