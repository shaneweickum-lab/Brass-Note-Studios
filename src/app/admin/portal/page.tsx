export const dynamic = "force-dynamic";

import Link from "next/link";
import { kvGetAllCommissions, getUnreadClientMessageCount, getUnreadCountsByClient, kvGetDashboardFinancials, kvGetLabsResultBreakdown } from "@/lib/supabase/queries";
import StatCard from "@/components/analytics/StatCard";
import RevenueAreaChart from "@/components/analytics/RevenueAreaChart";
import PipelineDonutChart from "@/components/analytics/PipelineDonutChart";
import LabsOutcomeChart from "@/components/analytics/LabsOutcomeChart";
import type { Commission } from "@/types/commission";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function isThisMonth(iso: string): boolean {
  const d = new Date(iso);
  const now = new Date();
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

export default async function AdminPortalPage() {
  const [commissions, unreadMessages, unreadCounts, financials, labsOutcomes] = await Promise.all([
    kvGetAllCommissions(),
    getUnreadClientMessageCount(),
    getUnreadCountsByClient(),
    kvGetDashboardFinancials(),
    kvGetLabsResultBreakdown(),
  ]);

  // Revenue by month from commissions with payment data
  const revenueByMonth: Record<string, number> = {};
  for (const c of commissions) {
    if (!c.datePurchased || !c.totalPayment) continue;
    const month = c.datePurchased.slice(0, 7);
    revenueByMonth[month] = (revenueByMonth[month] ?? 0) + c.totalPayment;
  }
  const revenueData = Object.entries(revenueByMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, revenue]) => ({ month, revenue }));

  // Pipeline breakdown by stage
  const stageCounts: Record<string, number> = {};
  for (const c of commissions) {
    const s = c.currentStage ?? "intake";
    stageCounts[s] = (stageCounts[s] ?? 0) + 1;
  }
  const stageOrder = ["intake", "production", "revision", "delivered"];
  const pipelineData = stageOrder
    .filter((s) => stageCounts[s])
    .map((stage) => ({ stage, count: stageCounts[stage] }));

  const sorted = [...commissions].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  const active       = commissions.filter((c) => (c.currentStage ?? "intake") !== "delivered");
  const inProduction = commissions.filter((c) => c.currentStage === "production");
  const inRevision   = commissions.filter((c) => c.currentStage === "revision");
  const deliveredThisMonth = commissions.filter(
    (c) => c.currentStage === "delivered" && isThisMonth(c.updatedAt)
  );

  return (
    <div className="space-y-4 sm:space-y-8">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-xl sm:text-3xl text-text-base leading-tight">Commission Portal</h1>
          <p className="text-text-muted font-body text-xs sm:text-sm mt-0.5 sm:mt-1">
            Manage client commissions and production stages
          </p>
        </div>
        <Link
          href="/admin/portal/commissions/new"
          className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 sm:px-4 sm:py-2 bg-gold text-background font-body text-xs sm:text-sm font-medium rounded hover:bg-gold-light transition-colors"
        >
          + New
        </Link>
      </div>

      {/* Pipeline Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4">
        <StatCard label="Active" value={active.length} accent />
        <StatCard label="In Production" value={inProduction.length} />
        <StatCard label="Revision" value={inRevision.length} />
        <StatCard label="Delivered" value={deliveredThisMonth.length} />
        <StatCard label="Unread" value={unreadMessages} accent={unreadMessages > 0} />
      </div>

      {/* Financial KPIs */}
      <div>
        <h2 className="font-display text-base sm:text-lg text-text-base mb-2 sm:mb-3">Financials</h2>
        <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4">
          {[
            { label: "Revenue", value: `$${financials.totalRevenue.toFixed(0)}`, cls: "text-gold" },
            { label: "This Month", value: `$${financials.revenueThisMonth.toFixed(0)}`, cls: "text-text-base" },
            { label: "Expenses", value: `$${financials.totalMonthlyExpenses.toFixed(0)}`, cls: "text-text-muted" },
            { label: "Net", value: `$${financials.netThisMonth.toFixed(0)}`, cls: financials.netThisMonth >= 0 ? "text-emerald-400" : "text-red-400" },
            { label: "Labs", value: String(financials.totalLabsExperiments), cls: "text-text-base" },
            { label: "Pass Rate", value: `${financials.labsPassRate.toFixed(0)}%`, cls: "text-emerald-400" },
          ].map(({ label, value, cls }) => (
            <div key={label} className="bg-surface border border-white/10 rounded-lg px-2.5 py-2.5 sm:px-4 sm:py-4">
              <p className="font-body text-[9px] sm:text-xs text-text-subtle uppercase tracking-[0.05em] sm:tracking-[0.1em] mb-0.5 sm:mb-1 leading-tight">{label}</p>
              <p className={`font-display text-base sm:text-xl leading-none ${cls}`}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Charts — desktop only to keep mobile view tight */}
      <div className="hidden sm:grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface border border-white/10 rounded-lg px-5 py-5">
          <h2 className="font-display text-base text-text-base mb-4">Revenue by Month</h2>
          <RevenueAreaChart data={revenueData} />
        </div>
        <div className="bg-surface border border-white/10 rounded-lg px-5 py-5">
          <h2 className="font-display text-base text-text-base mb-4">Pipeline</h2>
          <PipelineDonutChart data={pipelineData} />
        </div>
        <div className="bg-surface border border-white/10 rounded-lg px-5 py-5">
          <h2 className="font-display text-base text-text-base mb-4">Labs Outcomes</h2>
          <LabsOutcomeChart data={labsOutcomes} />
        </div>
      </div>

      {/* Recent Commissions */}
      <div className="bg-surface border border-white/10 rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="font-display text-lg text-text-base">All Commissions</h2>
          <span className="text-text-subtle font-body text-xs">{commissions.length} total</span>
        </div>

        {sorted.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="text-text-muted font-body text-sm">No commissions yet.</p>
            <Link
              href="/admin/portal/commissions/new"
              className="mt-3 inline-block text-gold font-body text-sm hover:text-gold-light transition-colors"
            >
              Create your first commission →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-5 py-3 text-left font-body text-xs text-text-subtle uppercase tracking-[0.1em]">Portal Login ID</th>
                  <th className="px-5 py-3 text-left font-body text-xs text-text-subtle uppercase tracking-[0.1em]">Client Name</th>
                  <th className="px-5 py-3 text-left font-body text-xs text-text-subtle uppercase tracking-[0.1em]">Package</th>
                  <th className="px-5 py-3 text-left font-body text-xs text-text-subtle uppercase tracking-[0.1em]">Songs</th>
                  <th className="px-5 py-3 text-left font-body text-xs text-text-subtle uppercase tracking-[0.1em]">Updated</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((c: Commission) => (
                  <tr
                    key={c.fullCommissionId}
                    className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="space-y-0.5">
                        <Link
                          href={`/admin/portal/commissions/${c.fullCommissionId}`}
                          className="font-mono text-sm text-gold hover:text-gold-light transition-colors block"
                        >
                          {c.permanentId}
                        </Link>
                        <span className="font-mono text-xs text-text-subtle/60 block">
                          {c.fullCommissionId}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/portal/commissions/${c.fullCommissionId}`}
                          className="font-body text-sm text-text-base hover:text-gold transition-colors"
                        >
                          {c.clientName}
                        </Link>
                        {(unreadCounts[c.permanentId] ?? 0) > 0 && (
                          <Link
                            href={`/admin/portal/messages/${c.permanentId}`}
                            className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-gold text-background font-body text-[10px] font-bold hover:bg-gold-light transition-colors"
                          >
                            {unreadCounts[c.permanentId]}
                          </Link>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-body text-sm text-text-muted capitalize">{c.packageType}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-body text-sm text-text-muted">{c.totalSongs}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-body text-sm text-text-subtle">{formatDate(c.updatedAt)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
