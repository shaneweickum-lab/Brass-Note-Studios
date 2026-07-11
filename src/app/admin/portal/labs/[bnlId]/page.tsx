export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { kvGetLabsExperiment, kvUpdateLabsExperiment, kvDeleteLabsExperiment } from "@/lib/supabase/queries";
import type { ResultCode } from "@/types/studio";
import { RESULT_CODE_LABELS } from "@/types/studio";
import ClientIdCopy from "../../commissions/[clientId]/ClientIdCopy";
import LabsExperimentForm from "../LabsExperimentForm";

interface PageProps {
  params: Promise<{ bnlId: string }>;
}

export default async function LabsExperimentDetailPage({ params }: PageProps) {
  const { bnlId: encoded } = await params;
  const bnlId = decodeURIComponent(encoded);

  const experiment = await kvGetLabsExperiment(bnlId);
  if (!experiment) notFound();

  async function updateExperiment(formData: FormData) {
    "use server";
    const str = (key: string) => ((formData.get(key) as string) || "").trim() || undefined;
    const updated = {
      ...experiment!,
      experimentId: str("experimentId"),
      experimentName: str("experimentName"),
      sunoVersion: str("sunoVersion"),
      weirdnessPct: parseInt(formData.get("weirdnessPct") as string, 10) || undefined,
      constraintPct: parseInt(formData.get("constraintPct") as string, 10) || undefined,
      stylePrompt: str("stylePrompt"),
      lyricPrompt: str("lyricPrompt"),
      tier2SymbolsUsed: str("tier2SymbolsUsed"),
      tier3Applied: formData.get("tier3Applied") === "on",
      hypothesis: str("hypothesis"),
      expectedResult: str("expectedResult"),
      actualResult: str("actualResult"),
      resultCode: (str("resultCode") as ResultCode) || undefined,
      keyFinding: str("keyFinding"),
      integrationStatus: str("integrationStatus"),
      notes: str("notes"),
      updatedAt: new Date().toISOString(),
    };
    await kvUpdateLabsExperiment(updated);
    revalidatePath("/admin/portal/labs");
    revalidatePath(`/admin/portal/labs/${encodeURIComponent(bnlId)}`);
  }

  async function deleteExperiment() {
    "use server";
    await kvDeleteLabsExperiment(bnlId);
    revalidatePath("/admin/portal/labs");
    redirect("/admin/portal/labs");
  }

  const resultStyle: Record<string, string> = {
    PASS:    "text-emerald-400",
    FAIL:    "text-red-400",
    PARTIAL: "text-amber-400",
    ANOMALY: "text-purple-400",
  };

  return (
    <div className="max-w-3xl space-y-8">
      <Link href="/admin/portal/labs" className="inline-flex items-center gap-1.5 text-text-subtle font-body text-sm hover:text-text-muted transition-colors">
        ← BN Labs
      </Link>

      <div>
        <div className="mb-3">
          <ClientIdCopy id={experiment.bnlId} label="BNL ID" />
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="font-display text-3xl text-text-base">
            {experiment.experimentId ?? "Experiment"}
          </h1>
          {experiment.resultCode && (
            <span className={`font-display text-lg ${resultStyle[experiment.resultCode] ?? "text-text-muted"}`}>
              {RESULT_CODE_LABELS[experiment.resultCode]}
            </span>
          )}
        </div>
        {experiment.experimentName && (
          <p className="text-text-muted font-body text-sm mt-1">{experiment.experimentName}</p>
        )}
      </div>

      <div className="bg-surface border border-white/10 rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-white/10">
          <h2 className="font-display text-lg text-text-base">Edit Experiment</h2>
        </div>
        <div className="px-5 py-5">
          <LabsExperimentForm experiment={experiment} action={updateExperiment} />
        </div>
      </div>

      {/* Danger zone */}
      <div className="border border-red-500/20 rounded-lg px-5 py-4 space-y-3">
        <p className="font-body text-xs text-text-subtle uppercase tracking-[0.15em]">Danger Zone</p>
        <form action={deleteExperiment}>
          <button type="submit"
            className="px-4 py-2 border border-red-500/40 text-red-400 font-body text-sm rounded hover:bg-red-500/10 transition-colors"
            onClick={(e) => { if (!confirm(`Delete ${bnlId}? This cannot be undone.`)) e.preventDefault(); }}>
            Delete Experiment
          </button>
        </form>
      </div>
    </div>
  );
}
