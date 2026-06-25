"use client";

const BARS = [
  { label: "Emotional Resonance",      pct: 75 },
  { label: "Vocal Clarity",            pct: 88 },
  { label: "Production Consistency",   pct: 92 },
  { label: "Tonal Balance",            pct: 80 },
  { label: "Structural Integrity",     pct: 85 },
];

export default function LabsBarChart() {
  return (
    <div
      className="rounded-[10px] border border-teal/10 p-6 space-y-5"
      style={{ background: "linear-gradient(160deg, #081018 0%, #0a141f 100%)" }}
    >
      {BARS.map(({ label, pct }, i) => (
        <div key={label}>
          <div className="h-2 rounded-full overflow-hidden mb-2" style={{ background: "rgba(255,255,255,0.06)" }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${pct}%`,
                background: "#0D9488",
                transformOrigin: "left",
                animation: `bar-fill 1.4s cubic-bezier(0.25,0.46,0.45,0.94) ${i * 0.15}s both,
                            bar-pulse 3s ease-in-out ${1.4 + i * 0.15}s infinite`,
              }}
            />
          </div>
          <p className="text-[10px] font-body text-text-subtle uppercase tracking-[0.12em]">
            {label}
          </p>
        </div>
      ))}
      <p className="text-[9px] text-text-subtle/50 font-body uppercase tracking-[0.1em] pt-2 border-t border-white/[0.04]">
        Illustrative — relative measurement only
      </p>
    </div>
  );
}
