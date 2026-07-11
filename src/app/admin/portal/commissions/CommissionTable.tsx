"use client";

import { useState } from "react";
import Link from "next/link";
import type { Commission } from "@/types/commission";
import { stageStyle } from "@/lib/portal/stageStyle";
import { STAGE_LABELS, formatCommissionId } from "@/types/commission";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

interface Props {
  commissions: Commission[];
  unreadCounts?: Record<string, number>;
}

export default function CommissionTable({ commissions, unreadCounts = {} }: Props) {
  const [query, setQuery] = useState("");

  const filtered = query.trim()
    ? commissions.filter(
        (c) =>
          c.clientName.toLowerCase().includes(query.toLowerCase()) ||
          c.permanentId.toLowerCase().includes(query.toLowerCase()) ||
          c.fullCommissionId.toLowerCase().includes(query.toLowerCase()) ||
          c.email.toLowerCase().includes(query.toLowerCase())
      )
    : commissions;

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Search by name, Portal Login ID, Commission ID, or email…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full sm:max-w-sm bg-surface border border-white/10 rounded px-3 py-2 font-body text-base text-text-base placeholder:text-text-subtle focus:outline-none focus:border-gold/50 transition-colors"
      />

      <div className="bg-surface border border-white/10 rounded-lg overflow-hidden">
        {filtered.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="text-text-muted font-body text-sm">
              {query ? "No commissions match your search." : "No commissions yet."}
            </p>
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
                  <th className="px-5 py-3 text-left font-body text-xs text-text-subtle uppercase tracking-[0.1em]">Stage</th>
                  <th className="px-5 py-3 text-left font-body text-xs text-text-subtle uppercase tracking-[0.1em]">Updated</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c: Commission) => (
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
                          {formatCommissionId(c.fullCommissionId, c.totalSongs)}
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
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-body ${stageStyle(c.currentStage ?? "intake")}`}
                      >
                        {STAGE_LABELS[c.currentStage ?? "intake"]}
                      </span>
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
