import type { Metadata } from "next";
import { kvGetConversations, kvGetFallbacks, KV_AVAILABLE } from "@/lib/analytics/kv";
import { readLeads } from "@/lib/analytics/readLogs";
import { aggregateOverview } from "@/lib/analytics/aggregator";
import StatCard from "@/components/analytics/StatCard";
import DailyLineChart from "@/components/analytics/DailyLineChart";
import PageBarChart from "@/components/analytics/PageBarChart";
import PatternTable from "@/components/analytics/PatternTable";
import FallbackTable from "@/components/analytics/FallbackTable";

export const metadata: Metadata = { title: "Overview" };
export const dynamic = "force-dynamic";

function pct(n: number) {
  return `${(n * 100).toFixed(1)}%`;
}

export default async function AnalyticsOverviewPage() {
  const [conversations, fallbacks, leads] = await Promise.all([
    kvGetConversations(),
    kvGetFallbacks(),
    Promise.resolve(readLeads()),
  ]);

  const data = aggregateOverview(conversations, fallbacks, [], leads);

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="font-display text-3xl text-text-base mb-1">Overview</h1>
        <p className="text-text-subtle font-body text-sm">BNSignal — Brass Note Studios analytics</p>
      </div>

      {!KV_AVAILABLE && (
        <div className="rounded-lg border border-gold/30 bg-gold/5 p-4">
          <p className="font-body text-sm text-gold font-semibold mb-1">KV store not connected</p>
          <p className="font-body text-xs text-text-muted">
            Create a KV database in Vercel dashboard → Storage, connect it to this project. All env vars are added automatically — no manual config needed.
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard label="Sessions" value={data.totalSessions} />
        <StatCard label="Messages" value={data.totalMessages} />
        <StatCard label="Fallbacks" value={data.totalFallbacks} sub={pct(data.fallbackRate)} />
        <StatCard label="Leads" value={data.totalLeads} accent />
        <StatCard label="Fallback Rate" value={pct(data.fallbackRate)} />
        <StatCard label="Conversion Rate" value={pct(data.conversionRate)} accent />
      </div>

      <div className="rounded-lg border border-white/10 bg-surface p-6">
        <h2 className="font-display text-lg text-text-base mb-4">Activity — Last 30 Days</h2>
        <DailyLineChart data={data.daily} />
      </div>

      <div className="rounded-lg border border-white/10 bg-surface p-6">
        <h2 className="font-display text-lg text-text-base mb-4">Activity by Page</h2>
        <PageBarChart data={data.byPage} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="rounded-lg border border-white/10 bg-surface p-6">
          <PatternTable patterns={data.topPatterns} title="Top Matched Patterns" />
        </div>
        <div className="rounded-lg border border-white/10 bg-surface p-6">
          <h3 className="font-display text-lg text-text-base mb-4">Top Unanswered Questions</h3>
          <FallbackTable fallbacks={data.topFallbacks} />
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <a href="/api/analytics/export?type=conversations" className="text-gold font-body text-xs border border-gold/40 rounded px-3 py-1.5 hover:bg-gold/10 transition-colors">Export Conversations CSV</a>
        <a href="/api/analytics/export?type=fallbacks" className="text-gold font-body text-xs border border-gold/40 rounded px-3 py-1.5 hover:bg-gold/10 transition-colors">Export Fallbacks CSV</a>
        <a href="/api/analytics/export?type=leads" className="text-gold font-body text-xs border border-gold/40 rounded px-3 py-1.5 hover:bg-gold/10 transition-colors">Export Leads CSV</a>
      </div>
    </div>
  );
}
