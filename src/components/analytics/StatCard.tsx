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
      className={`rounded-lg border p-5 flex flex-col gap-1 ${
        accent
          ? "border-gold/40 bg-gold/5"
          : "border-white/10 bg-surface"
      }`}
    >
      <p className="text-text-subtle font-body text-xs uppercase tracking-[0.15em]">{label}</p>
      <p className={`font-display text-3xl ${accent ? "text-gold" : "text-text-base"}`}>
        {value}
      </p>
      {sub && <p className="text-text-subtle font-body text-xs">{sub}</p>}
    </div>
  );
}
