interface RevisionCardProps {
  revisionsRemaining: number;
}

export default function RevisionCard({ revisionsRemaining }: RevisionCardProps) {
  if (revisionsRemaining > 0) {
    return (
      <div className="bg-surface border border-white/8 rounded-sm p-6 flex flex-col items-center text-center gap-1">
        <span className="font-display font-semibold text-5xl text-gold leading-none">
          {revisionsRemaining}
        </span>
        <span className="font-body text-sm text-text-muted tracking-wide mt-2">
          Revision Round{revisionsRemaining !== 1 ? "s" : ""} Remaining
        </span>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-white/8 rounded-sm p-6 flex flex-col items-center text-center gap-3">
      <span className="font-body text-sm text-text-subtle">
        No revision rounds remaining
      </span>
      <a
        href="/services#revisions"
        className="
          inline-flex items-center gap-1
          font-body text-sm font-semibold tracking-wide
          border border-gold/40 text-gold
          px-5 py-2 rounded-sm
          hover:bg-gold/10 transition-colors duration-200
        "
      >
        Purchase More Revisions &rarr;
      </a>
    </div>
  );
}
