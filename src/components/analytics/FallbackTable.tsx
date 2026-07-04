"use client";

import type { FallbackStat } from "@/lib/analytics/types";

interface Props {
  fallbacks: FallbackStat[];
}

export default function FallbackTable({ fallbacks }: Props) {
  if (!fallbacks.length) {
    return <p className="text-text-subtle font-body text-sm text-center py-8">No unanswered questions yet.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-white/10">
      <table className="w-full font-body text-sm">
        <thead>
          <tr className="border-b border-white/10 text-text-subtle text-xs uppercase tracking-[0.1em]">
            <th className="text-left px-4 py-2">Question</th>
            <th className="text-right px-4 py-2 w-16">Count</th>
            <th className="text-left px-4 py-2 w-24">Page</th>
            <th className="text-left px-4 py-2 w-32">Last Seen</th>
          </tr>
        </thead>
        <tbody>
          {fallbacks.map((f, i) => (
            <tr key={i} className="border-b border-white/5 hover:bg-white/3 transition-colors">
              <td className="px-4 py-2 text-text-base">{f.message}</td>
              <td className="px-4 py-2 text-right text-red-400 font-semibold">{f.count}</td>
              <td className="px-4 py-2 text-text-subtle text-xs">{f.pageContext || "/"}</td>
              <td className="px-4 py-2 text-text-subtle text-xs">{f.lastSeen.slice(0, 10)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
