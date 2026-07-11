export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { kvAllocateLabsId, kvCreateLabsExperiment } from "@/lib/supabase/queries";
import type { LabsExperiment, ResultCode } from "@/types/studio";
import { EXPERIMENT_IDS } from "@/types/studio";
import LabsExperimentForm from "../LabsExperimentForm";

export default function NewLabsExperimentPage() {
  async function createExperiment(formData: FormData) {
    "use server";
    const now = new Date().toISOString();
    const experimentId = (formData.get("experimentId") as string) || "EXP001";
    const { bnlId, globalNumber } = await kvAllocateLabsId(experimentId, now);

    const exp: LabsExperiment = {
      bnlId,
      studioId: "bns",
      experimentId,
      experimentName: ((formData.get("experimentName") as string) || "").trim() || undefined,
      labsGlobalNumber: globalNumber,
      displayNumber: String(globalNumber).padStart(3, "0"),
      sunoVersion: ((formData.get("sunoVersion") as string) || "").trim() || undefined,
      weirdnessPct: parseInt(formData.get("weirdnessPct") as string, 10) || undefined,
      constraintPct: parseInt(formData.get("constraintPct") as string, 10) || undefined,
      stylePrompt: ((formData.get("stylePrompt") as string) || "").trim() || undefined,
      lyricPrompt: ((formData.get("lyricPrompt") as string) || "").trim() || undefined,
      tier2SymbolsUsed: ((formData.get("tier2SymbolsUsed") as string) || "").trim() || undefined,
      tier3Applied: formData.get("tier3Applied") === "on",
      hypothesis: ((formData.get("hypothesis") as string) || "").trim() || undefined,
      expectedResult: ((formData.get("expectedResult") as string) || "").trim() || undefined,
      actualResult: ((formData.get("actualResult") as string) || "").trim() || undefined,
      resultCode: ((formData.get("resultCode") as string) || "") as ResultCode || undefined,
      keyFinding: ((formData.get("keyFinding") as string) || "").trim() || undefined,
      integrationStatus: ((formData.get("integrationStatus") as string) || "").trim() || undefined,
      notes: ((formData.get("notes") as string) || "").trim() || undefined,
      createdAt: now,
      updatedAt: now,
    };

    await kvCreateLabsExperiment(exp);
    revalidatePath("/admin/portal/labs");
    redirect(`/admin/portal/labs/${encodeURIComponent(bnlId)}`);
  }

  return (
    <div className="max-w-3xl space-y-8">
      <Link href="/admin/portal/labs" className="inline-flex items-center gap-1.5 text-text-subtle font-body text-sm hover:text-text-muted transition-colors">
        ← BN Labs
      </Link>
      <div>
        <h1 className="font-display text-3xl text-text-base">New Experiment</h1>
        <p className="text-text-muted font-body text-sm mt-1">Log a new Labs experiment entry</p>
      </div>
      <div className="bg-surface border border-white/10 rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-white/10">
          <h2 className="font-display text-lg text-text-base">Experiment Details</h2>
        </div>
        <div className="px-5 py-5">
          <LabsExperimentForm action={createExperiment} />
        </div>
      </div>
    </div>
  );
}
