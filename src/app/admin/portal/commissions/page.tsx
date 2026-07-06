export const dynamic = "force-dynamic";

import Link from "next/link";
import { kvGetAllCommissions, getUnreadCountsByClient } from "@/lib/supabase/queries";
import CommissionTable from "./CommissionTable";

export default async function CommissionsPage() {
  const [commissions, unreadCounts] = await Promise.all([
    kvGetAllCommissions(),
    getUnreadCountsByClient(),
  ]);
  const sorted = [...commissions].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-text-base">Commissions</h1>
          <p className="text-text-muted font-body text-sm mt-1">
            {commissions.length} commission{commissions.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <Link
          href="/admin/portal/commissions/new"
          className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 bg-gold text-background font-body text-sm font-medium rounded hover:bg-gold-light transition-colors"
        >
          + New Commission
        </Link>
      </div>

      <CommissionTable commissions={sorted} unreadCounts={unreadCounts} />
    </div>
  );
}
