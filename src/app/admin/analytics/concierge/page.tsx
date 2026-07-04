import type { Metadata } from "next";
import Link from "next/link";
import { kvGetConversations, kvGetFallbacks } from "@/lib/analytics/kv";
import { aggregateOverview } from "@/lib/analytics/aggregator";
import StatCard from "@/components/analytics/StatCard";
import PatternTable from "@/components/analytics/PatternTable";
import FallbackTable from "@/components/analytics/FallbackTable";

export const metadata: Metadata = { title: "Concierge Analytics" };
export const dynamic = "force-dynamic";

export default async function ConciergeAnalyticsPage() {
  const [conversations, fallbacks] = await Promise.all([
    kvGetConversations(),
    kvGetFallbacks(),
  ]);

  const totalMessages = conversations.length;
  const fallbackCount = conversations.filter((c) => c.isFallback).length + fallbacks.length;
  const fallbackRate = totalMessages > 0 ? fallbackCount / totalMessages : 0;
  const answeredRate = 1 - fallbackRate;

  const data = aggregateOverview(conversations, fallbacks, [], []);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl text-text-base mb-1">Concierge Analytics</h1>
          <p className="text-text-subtle font-body text-sm">Pattern matching performance and unanswered questions</p>
        </div>
        <Link
          href="/admin/analytics/concierge/add-pattern"
          className="inline-flex items-center gap-2 font-body text-sm font-semibold bg-gold text-background px-4 py-2 rounded hover:bg-gold-light transition-colors"
        >
          + Add Pattern
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Total Messages" value={totalMessages} />
        <StatCard label="Fallbacks" value={fallbackCount} />
        <StatCard label="Fallback Rate" value={`${(fallbackRate * 100).toFixed(1)}%`} />
        <StatCard label="Answer Rate" value={`${(answeredRate * 100).toFixed(1)}%`} accent />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="rounded-lg border border-white/10 bg-surface p-6">
          <PatternTable patterns={data.topPatterns} title="Top Matched Patterns" />
        </div>
        <div className="rounded-lg border border-white/10 bg-surface p-6">
          <h3 className="font-display text-lg text-text-base mb-4">Unanswered Questions</h3>
          <p className="text-text-subtle font-body text-xs mb-4">
            These questions hit the fallback. Add patterns to improve coverage.
          </p>
          <FallbackTable fallbacks={data.topFallbacks} />
        </div>
      </div>
    </div>
  );
}
