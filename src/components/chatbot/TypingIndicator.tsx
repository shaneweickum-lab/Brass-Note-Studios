export default function TypingIndicator() {
  return (
    <div className="flex items-end gap-2.5 mb-4">
      <div className="w-6 h-6 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center flex-shrink-0">
        <span className="text-gold text-[8px] font-display">B</span>
      </div>
      <div className="bg-surface border border-border-subtle rounded-lg px-4 py-3">
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-gold/50 animate-bounce [animation-delay:0ms]" />
          <span className="w-1.5 h-1.5 rounded-full bg-gold/50 animate-bounce [animation-delay:150ms]" />
          <span className="w-1.5 h-1.5 rounded-full bg-gold/50 animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}
