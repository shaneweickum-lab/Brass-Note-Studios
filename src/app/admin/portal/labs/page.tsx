export const dynamic = "force-dynamic";

import Link from "next/link";
import { kvGetAllLabsExperiments } from "@/lib/supabase/queries";
import type { LabsExperiment, ResultCode } from "@/types/studio";
import { RESULT_CODE_LABELS } from "@/types/studio";

function ResultBadge({ code }: { code?: ResultCode }) {
  if (!code) return <span className="text-text-subtle/50 text-xs font-body">—</span>;
  const styles: Record<ResultCode, string> = {
    PASS:    "border-emerald-400/30 bg-emerald-400/10 text-emerald-400",
    FAIL:    "border-red-400/30 bg-red-400/10 text-red-400",
    PARTIAL: "border-amber-400/30 bg-amber-400/10 text-amber-400",
    ANOMALY: "border-purple-400/30 bg-purple-400/10 text-purple-400",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-body ${styles[code]}`}>
      {RESULT_CODE_LABELS[code]}
    </span>
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default async function LabsListPage() {
  const experiments = await kvGetAllLabsExperiments();

  const total = experiments.length;
  const passed  = experiments.filter((e) => e.resultCode === "PASS").length;
  const failed  = experiments.filter((e) => e.resultCode === "FAIL").length;
  const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl text-text-base">BN Labs</h1>
          <p className="text-text-muted font-body text-sm mt-1">
            Experiment log — {total} entries
          </p>
        </div>
        <Link
          href="/admin/portal/labs/new"
          className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 bg-gold text-background font-body text-sm font-medium rounded hover:bg-gold-light transition-colors"
        >
          + New Experiment
        </Link>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Experiments", value: total },
          { label: "Pass", value: passed, gold: true },
          { label: "Fail", value: failed },
          { label: "Pass Rate", value: `${passRate}%`, gold: passRate >= 50 },
        ].map(({ label, value, gold }) => (
          <div key={label} className="bg-surface border border-white/10 rounded-lg px-4 py-4">
            <p className="font-body text-xs text-text-subtle uppercase tracking-[0.1em] mb-1">{label}</p>
            <p className={`font-display text-2xl ${gold ? "text-gold" : "text-text-base"}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Experiment table */}
      <div className="bg-surface border border-white/10 rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-white/10">
          <h2 className="font-display text-lg text-text-base">All Experiments</h2>
        </div>
        {experiments.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="text-text-muted font-body text-sm">No experiments logged yet.</p>
            <Link href="/admin/portal/labs/new" className="mt-3 inline-block text-gold font-body text-sm hover:text-gold-light transition-colors">
              Log your first experiment →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {["BNL ID", "Experiment", "Suno Ver", "Weirdness", "Constraint", "Result", "Key Finding", "Date"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-body text-xs text-text-subtle uppercase tracking-[0.1em] whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {experiments.map((exp: LabsExperiment) => (
                  <tr key={exp.bnlId} className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/admin/portal/labs/${encodeURIComponent(exp.bnlId)}`}
                        className="font-mono text-xs text-gold hover:text-gold-light transition-colors whitespace-nowrap">
                        {exp.bnlId}
                      </Link>
                    </td>
                    <td className="px-4 py-3 font-body text-sm text-text-muted whitespace-nowrap">{exp.experimentId ?? "—"}</td>
                    <td className="px-4 py-3 font-body text-sm text-text-muted">{exp.sunoVersion ?? "—"}</td>
                    <td className="px-4 py-3 font-body text-sm text-text-muted">{exp.weirdnessPct != null ? `${exp.weirdnessPct}%` : "—"}</td>
                    <td className="px-4 py-3 font-body text-sm text-text-muted">{exp.constraintPct != null ? `${exp.constraintPct}%` : "—"}</td>
                    <td className="px-4 py-3"><ResultBadge code={exp.resultCode} /></td>
                    <td className="px-4 py-3 font-body text-xs text-text-subtle max-w-[220px] truncate">{exp.keyFinding ?? "—"}</td>
                    <td className="px-4 py-3 font-body text-xs text-text-subtle whitespace-nowrap">{formatDate(exp.createdAt)}</td>
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
