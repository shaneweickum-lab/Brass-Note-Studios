import NavigationCard from "./NavigationCard";

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
      <div className="flex justify-end mb-4">
        <div className="max-w-[80%] bg-gold/10 border border-gold/20 rounded-lg px-4 py-2.5">
          <p className="text-text-base text-sm font-body leading-relaxed">{text}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-end gap-2.5 mb-4">
      <div className="w-6 h-6 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center flex-shrink-0 self-start mt-0.5">
        <span className="text-gold text-[8px] font-display">B</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="bg-surface border border-border-subtle rounded-lg px-4 py-3">
          <p className="text-text-base text-sm font-body leading-relaxed whitespace-pre-line">
            {text}
          </p>
        </div>
        {navigationCard && (
          <NavigationCard
            label={navigationCard.label}
            href={navigationCard.href}
            description={navigationCard.description}
          />
        )}
        {quickReplies && quickReplies.length > 0 && onQuickReply && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {quickReplies.map((reply) => (
              <button
                key={reply}
                onClick={() => onQuickReply(reply)}
                className="text-[10px] font-body tracking-[0.12em] uppercase border border-gold/30 text-gold/70 px-3 py-1.5 hover:border-gold hover:text-gold transition-all duration-150 rounded-sm"
              >
                {reply}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
