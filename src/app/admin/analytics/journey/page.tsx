import type { Metadata } from "next";
import { readConversations, readSessions, readLeads } from "@/lib/analytics/readLogs";
import StatCard from "@/components/analytics/StatCard";

export const metadata: Metadata = { title: "Customer Journey" };
export const dynamic = "force-dynamic";

export default function JourneyPage() {
  const conversations = readConversations();
  const sessions = readSessions();
  const leads = readLeads();

  const uniqueSessionIds = new Set(conversations.map((c) => c.sessionId));
  const totalVisitors = uniqueSessionIds.size || sessions.length;
  const engagedSessions = sessions.filter((s) => s.messageCount >= 3).length ||
    Array.from(uniqueSessionIds).filter((id) =>
      conversations.filter((c) => c.sessionId === id).length >= 3
    ).length;
  const convertedSessions = sessions.filter((s) => s.converted).length || leads.length;
  const totalLeads = leads.length;

  const stages = [
    { label: "Visitors", count: totalVisitors, desc: "Opened the concierge" },
    { label: "Engaged", count: engagedSessions, desc: "Sent 3+ messages" },
    { label: "Inquired", count: convertedSessions, desc: "Clicked to commission form" },
    { label: "Leads", count: totalLeads, desc: "Submitted commission form" },
  ];

  const maxCount = Math.max(...stages.map((s) => s.count), 1);

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="font-display text-3xl text-text-base mb-1">Customer Journey</h1>
        <p className="text-text-subtle font-body text-sm">Funnel from first touch to commission lead</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stages.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.count} sub={s.desc} />
        ))}
      </div>

      {/* Visual funnel */}
      <div className="rounded-lg border border-white/10 bg-surface p-8">
        <h2 className="font-display text-lg text-text-base mb-6">Funnel Visualization</h2>
        <div className="flex flex-col gap-3">
          {stages.map((stage, i) => {
            const width = maxCount > 0 ? (stage.count / maxCount) * 100 : 0;
            const prev = i > 0 ? stages[i - 1].count : stage.count;
            const dropOff = prev > 0 ? ((prev - stage.count) / prev * 100).toFixed(0) : "0";
            return (
              <div key={stage.label} className="flex items-center gap-4">
                <div className="w-24 text-right font-body text-xs text-text-subtle shrink-0">{stage.label}</div>
                <div className="flex-1 h-9 bg-white/5 rounded relative overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-gold/80 to-gold/40 rounded transition-all"
                    style={{ width: `${width}%` }}
                  />
                  <span className="absolute inset-0 flex items-center px-3 font-body text-sm text-text-base font-semibold">
                    {stage.count}
                  </span>
                </div>
                {i > 0 && (
                  <div className="w-16 text-right font-body text-xs text-red-400 shrink-0">
                    -{dropOff}%
                  </div>
                )}
                {i === 0 && <div className="w-16" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Page entry breakdown */}
      <div className="rounded-lg border border-white/10 bg-surface p-6">
        <h2 className="font-display text-lg text-text-base mb-4">Entry Points</h2>
        {conversations.length === 0 ? (
          <p className="text-text-subtle font-body text-sm">No conversation data yet.</p>
        ) : (
          (() => {
            const pageMap = new Map<string, number>();
            for (const c of conversations) {
              const pg = c.pageContext || "/";
              pageMap.set(pg, (pageMap.get(pg) ?? 0) + 1);
            }
            const sorted = Array.from(pageMap.entries()).sort((a, b) => b[1] - a[1]);
            const total = sorted.reduce((sum, [, n]) => sum + n, 0);
            return (
              <div className="flex flex-col gap-2">
                {sorted.map(([page, count]) => (
                  <div key={page} className="flex items-center gap-3">
                    <span className="font-mono text-xs text-text-muted w-28 shrink-0">{page}</span>
                    <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gold/60 rounded-full"
                        style={{ width: `${(count / total) * 100}%` }}
                      />
                    </div>
                    <span className="font-body text-xs text-gold w-8 text-right">{count}</span>
                  </div>
                ))}
              </div>
            );
          })()
        )}
      </div>
    </div>
  );
}
