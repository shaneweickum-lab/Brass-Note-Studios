"use client";

import type { PatternStat } from "@/lib/analytics/types";

interface Props {
  patterns: PatternStat[];
  title?: string;
}

export default function PatternTable({ patterns, title = "Top Matched Patterns" }: Props) {
  if (!patterns.length) {
    return <p className="text-text-subtle font-body text-sm text-center py-8">No data yet.</p>;
  }

  const max = patterns[0].count;

  return (
    <div>
      {title && <h3 className="font-display text-lg text-text-base mb-4">{title}</h3>}
      <div className="overflow-x-auto rounded-lg border border-white/10">
        <table className="w-full font-body text-sm">
          <thead>
            <tr className="border-b border-white/10 text-text-subtle text-xs uppercase tracking-[0.1em]">
              <th className="text-left px-4 py-2">Pattern</th>
              <th className="text-right px-4 py-2 w-16">Count</th>
              <th className="text-left px-4 py-2 w-32">Last Seen</th>
              <th className="text-left px-4 py-2">Frequency</th>
            </tr>
          </thead>
          <tbody>
            {patterns.map((p, i) => (
              <tr key={i} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                <td className="px-4 py-2 text-text-base font-mono text-xs">{p.pattern}</td>
                <td className="px-4 py-2 text-right text-gold font-semibold">{p.count}</td>
                <td className="px-4 py-2 text-text-subtle text-xs">{p.lastSeen.slice(0, 10)}</td>
                <td className="px-4 py-2">
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden w-full max-w-[120px]">
                    <div
                      className="h-full bg-gold rounded-full"
                      style={{ width: `${(p.count / max) * 100}%` }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
