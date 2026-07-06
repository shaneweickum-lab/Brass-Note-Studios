export const dynamic = "force-dynamic";

import Link from "next/link";
import { kvGetAllCommissions } from "@/lib/commissions/kv";
import StatCard from "@/components/analytics/StatCard";
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
  const commissions = await kvGetAllCommissions();

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
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-text-base">Commission Portal</h1>
          <p className="text-text-muted font-body text-sm mt-1">
            Manage client commissions and production stages
          </p>
        </div>
        <Link
          href="/admin/portal/commissions/new"
          className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 bg-gold text-background font-body text-sm font-medium rounded hover:bg-gold-light transition-colors"
        >
          + New Commission
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Commissions" value={active.length} accent />
        <StatCard label="In Production" value={inProduction.length} />
        <StatCard label="Awaiting Revision" value={inRevision.length} />
        <StatCard label="Delivered This Month" value={deliveredThisMonth.length} accent />
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
                      <Link
                        href={`/admin/portal/commissions/${c.fullCommissionId}`}
                        className="font-body text-sm text-text-base hover:text-gold transition-colors"
                      >
                        {c.clientName}
                      </Link>
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
