"use client";

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
}

export default function StatCard({ label, value, sub, accent }: StatCardProps) {
  return (
    <div
      className={`rounded-lg border px-3 py-3 sm:p-5 flex flex-col gap-0.5 sm:gap-1 ${
        accent
          ? "border-gold/40 bg-gold/5"
          : "border-white/10 bg-surface"
      }`}
    >
      <p className="text-text-subtle font-body text-[10px] sm:text-xs uppercase tracking-[0.05em] sm:tracking-[0.15em] leading-tight">{label}</p>
      <p className={`font-display text-2xl sm:text-3xl leading-none ${accent ? "text-gold" : "text-text-base"}`}>
        {value}
      </p>
      {sub && <p className="text-text-subtle font-body text-xs">{sub}</p>}
    </div>
  );
}
