import type { Metadata } from "next";
import { readPageViews } from "@/lib/analytics/readLogs";
import StatCard from "@/components/analytics/StatCard";

export const metadata: Metadata = { title: "Website Analytics" };
export const dynamic = "force-dynamic";

export default function WebsiteAnalyticsPage() {
  const pageViews = readPageViews();

  const totalViews = pageViews.length;
  const uniqueVisitors = new Set(pageViews.map((p) => p.sessionId)).size;

  // By page
  const pageMap = new Map<string, number>();
  for (const pv of pageViews) {
    pageMap.set(pv.path, (pageMap.get(pv.path) ?? 0) + 1);
  }
  const byPage = Array.from(pageMap.entries())
    .map(([page, views]) => ({ page, views }))
    .sort((a, b) => b.views - a.views);

  // Last 30 days daily
  const dailyMap = new Map<string, number>();
  for (const pv of pageViews) {
    const d = pv.ts.slice(0, 10);
    dailyMap.set(d, (dailyMap.get(d) ?? 0) + 1);
  }
  const daily = Array.from(dailyMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-30);

  const maxViews = byPage[0]?.views ?? 1;
  const dailyMax = Math.max(...daily.map(([, v]) => v), 1);

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="font-display text-3xl text-text-base mb-1">Website Analytics</h1>
        <p className="text-text-subtle font-body text-sm">Page views tracked by BNSignal — last 30 days</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <StatCard label="Total Page Views" value={totalViews.toLocaleString()} accent />
        <StatCard label="Unique Visitors" value={uniqueVisitors.toLocaleString()} />
        <StatCard label="Pages Tracked" value={byPage.length} />
      </div>

      {/* Daily sparkline */}
      {daily.length > 0 && (
        <div className="rounded-lg border border-white/10 bg-surface p-6">
          <h2 className="font-display text-lg text-text-base mb-4">Daily Views</h2>
          <div className="flex items-end gap-1 h-20">
            {daily.map(([date, count]) => (
              <div key={date} className="flex-1 flex flex-col items-center gap-1 group relative">
                <div
                  className="w-full bg-gold/40 hover:bg-gold/70 rounded-t transition-colors"
                  style={{ height: `${(count / dailyMax) * 100}%`, minHeight: 2 }}
                />
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-body text-gold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {count}
                </span>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            <span className="font-body text-[10px] text-text-subtle">{daily[0]?.[0]}</span>
            <span className="font-body text-[10px] text-text-subtle">{daily[daily.length - 1]?.[0]}</span>
          </div>
        </div>
      )}

      {/* Top pages */}
      {byPage.length > 0 ? (
        <div className="rounded-lg border border-white/10 bg-surface p-6">
          <h2 className="font-display text-lg text-text-base mb-6">Top Pages</h2>
          <div className="flex flex-col gap-3">
            {byPage.map(({ page, views }) => (
              <div key={page} className="flex items-center gap-3">
                <span className="font-mono text-xs text-text-muted w-36 shrink-0 truncate">{page}</span>
                <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-gold/80 to-gold/30 rounded-full"
                    style={{ width: `${(views / maxViews) * 100}%` }}
                  />
                </div>
                <span className="font-body text-xs text-gold w-8 text-right shrink-0">{views}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-white/10 bg-surface p-8 text-center">
          <p className="text-text-subtle font-body text-sm">
            No page views recorded yet — data populates as visitors browse the site.
          </p>
        </div>
      )}
    </div>
  );
}
