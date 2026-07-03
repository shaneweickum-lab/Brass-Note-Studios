export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-2.5 mb-4">
      <div className="w-7 h-7 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center flex-shrink-0 mt-0.5">
        <span className="text-gold text-[9px] font-display font-medium">B</span>
      </div>
      <div className="bg-surface border border-border-subtle rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex items-center gap-1.5 h-5">
          <span className="w-2 h-2 rounded-full bg-gold/50 animate-bounce [animation-delay:0ms]" />
          <span className="w-2 h-2 rounded-full bg-gold/50 animate-bounce [animation-delay:150ms]" />
          <span className="w-2 h-2 rounded-full bg-gold/50 animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}
