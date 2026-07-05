"use client";

import { useState } from "react";
import Link from "next/link";
import type { Commission } from "@/types/commission";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

interface Props {
  commissions: Commission[];
}

export default function CommissionTable({ commissions }: Props) {
  const [query, setQuery] = useState("");

  const filtered = query.trim()
    ? commissions.filter(
        (c) =>
          c.clientName.toLowerCase().includes(query.toLowerCase()) ||
          c.clientId.toLowerCase().includes(query.toLowerCase()) ||
          c.email.toLowerCase().includes(query.toLowerCase())
      )
    : commissions;

  return (
    <div className="space-y-4">
      {/* Search input */}
      <input
        type="text"
        placeholder="Search by name, client ID, or email…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full sm:max-w-sm bg-surface border border-white/10 rounded px-3 py-2 font-body text-sm text-text-base placeholder:text-text-subtle focus:outline-none focus:border-gold/50 transition-colors"
      />

      <div className="bg-surface border border-white/10 rounded-lg overflow-hidden">
        {filtered.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="text-text-muted font-body text-sm">
              {query
                ? "No commissions match your search."
                : "No commissions yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-5 py-3 text-left font-body text-xs text-text-subtle uppercase tracking-[0.1em]">
                    Client ID
                  </th>
                  <th className="px-5 py-3 text-left font-body text-xs text-text-subtle uppercase tracking-[0.1em]">
                    Client Name
                  </th>
                  <th className="px-5 py-3 text-left font-body text-xs text-text-subtle uppercase tracking-[0.1em]">
                    Email
                  </th>
                  <th className="px-5 py-3 text-left font-body text-xs text-text-subtle uppercase tracking-[0.1em]">
                    Package
                  </th>
                  <th className="px-5 py-3 text-left font-body text-xs text-text-subtle uppercase tracking-[0.1em]">
                    Songs
                  </th>
                  <th className="px-5 py-3 text-left font-body text-xs text-text-subtle uppercase tracking-[0.1em]">
                    Last Updated
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c: Commission) => (
                  <tr
                    key={c.clientId}
                    className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <Link
                        href={`/admin/portal/commissions/${c.clientId}`}
                        className="font-mono text-sm text-gold hover:text-gold-light transition-colors"
                      >
                        {c.clientId}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5">
                      <Link
                        href={`/admin/portal/commissions/${c.clientId}`}
                        className="font-body text-sm text-text-base hover:text-gold transition-colors"
                      >
                        {c.clientName}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-body text-sm text-text-muted">{c.email}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-body text-sm text-text-muted capitalize">
                        {c.packageType}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-body text-sm text-text-muted">{c.totalSongs}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-body text-sm text-text-subtle">
                        {formatDate(c.updatedAt)}
                      </span>
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
