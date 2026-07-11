"use client";

import type { LabsExperiment, ResultCode } from "@/types/studio";
import { EXPERIMENT_IDS, RESULT_CODE_LABELS } from "@/types/studio";

interface Props {
  experiment?: LabsExperiment;
  action: (formData: FormData) => Promise<void>;
}

const input =
  "w-full bg-background border border-white/10 rounded px-3 py-2 font-body text-base text-text-base placeholder:text-text-subtle focus:outline-none focus:border-gold/50 transition-colors";

function Section({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 pt-2">
      <span className="font-body text-xs text-text-subtle uppercase tracking-[0.15em]">{label}</span>
      <span className="flex-1 h-px bg-white/5" />
    </div>
  );
}

const RESULT_CODES: ResultCode[] = ["PASS", "FAIL", "PARTIAL", "ANOMALY"];

export default function LabsExperimentForm({ experiment, action }: Props) {
  return (
    <form action={action} className="space-y-6">

      {/* ── Identity ── */}
      <div className="space-y-4">
        <Section label="Identity" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block font-body text-sm text-text-muted">Experiment ID</label>
            <select name="experimentId" defaultValue={experiment?.experimentId ?? "EXP001"} className={input}>
              {EXPERIMENT_IDS.map((id) => (
                <option key={id} value={id}>{id}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block font-body text-sm text-text-muted">
              Experiment Name <span className="text-text-subtle font-normal text-xs">(optional)</span>
            </label>
            <input name="experimentName" type="text"
              defaultValue={experiment?.experimentName ?? ""}
              placeholder="Style Isolation Test" className={input} />
          </div>
          <div className="space-y-1.5">
            <label className="block font-body text-sm text-text-muted">Suno Version</label>
            <input name="sunoVersion" type="text"
              defaultValue={experiment?.sunoVersion ?? ""}
              placeholder="v4" className={input} />
          </div>
        </div>
      </div>

      {/* ── Parameters ── */}
      <div className="space-y-4">
        <Section label="Parameters" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block font-body text-sm text-text-muted">Weirdness % (0–100)</label>
            <input name="weirdnessPct" type="number" min={0} max={100}
              defaultValue={experiment?.weirdnessPct ?? ""}
              placeholder="30" className={input} />
          </div>
          <div className="space-y-1.5">
            <label className="block font-body text-sm text-text-muted">Constraint % (0–100)</label>
            <input name="constraintPct" type="number" min={0} max={100}
              defaultValue={experiment?.constraintPct ?? ""}
              placeholder="70" className={input} />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="block font-body text-sm text-text-muted">Style Prompt Used</label>
          <textarea name="stylePrompt" rows={4}
            defaultValue={experiment?.stylePrompt ?? ""}
            placeholder="Enter the full style prompt…"
            className={`${input} resize-none`} />
        </div>
        <div className="space-y-1.5">
          <label className="block font-body text-sm text-text-muted">Lyric Prompt Used</label>
          <textarea name="lyricPrompt" rows={4}
            defaultValue={experiment?.lyricPrompt ?? ""}
            placeholder="Enter the lyric input used…"
            className={`${input} resize-none`} />
        </div>
        <div className="space-y-1.5">
          <label className="block font-body text-sm text-text-muted">
            Tier 2 Symbols Used <span className="text-text-subtle font-normal text-xs">(list any)</span>
          </label>
          <input name="tier2SymbolsUsed" type="text"
            defaultValue={experiment?.tier2SymbolsUsed ?? ""}
            placeholder="[], {}, ~…" className={input} />
        </div>
        <div className="flex items-center gap-3">
          <input name="tier3Applied" type="checkbox" id="tier3-applied"
            defaultChecked={experiment?.tier3Applied ?? false}
            className="w-4 h-4 accent-gold" />
          <label htmlFor="tier3-applied" className="font-body text-sm text-text-muted cursor-pointer">
            Tier 3 Applied
          </label>
        </div>
      </div>

      {/* ── Research ── */}
      <div className="space-y-4">
        <Section label="Research" />
        <div className="space-y-1.5">
          <label className="block font-body text-sm text-text-muted">Hypothesis</label>
          <textarea name="hypothesis" rows={2}
            defaultValue={experiment?.hypothesis ?? ""}
            placeholder="What were you testing?"
            className={`${input} resize-none`} />
        </div>
        <div className="space-y-1.5">
          <label className="block font-body text-sm text-text-muted">Expected Result</label>
          <textarea name="expectedResult" rows={2}
            defaultValue={experiment?.expectedResult ?? ""}
            placeholder="What did you expect to happen?"
            className={`${input} resize-none`} />
        </div>
        <div className="space-y-1.5">
          <label className="block font-body text-sm text-text-muted">Actual Result</label>
          <textarea name="actualResult" rows={3}
            defaultValue={experiment?.actualResult ?? ""}
            placeholder="What actually happened?"
            className={`${input} resize-none`} />
        </div>
      </div>

      {/* ── Outcome ── */}
      <div className="space-y-4">
        <Section label="Outcome" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block font-body text-sm text-text-muted">Result Code</label>
            <select name="resultCode" defaultValue={experiment?.resultCode ?? ""} className={input}>
              <option value="">— Select —</option>
              {RESULT_CODES.map((code) => (
                <option key={code} value={code}>{RESULT_CODE_LABELS[code]}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block font-body text-sm text-text-muted">Integration Status</label>
            <input name="integrationStatus" type="text"
              defaultValue={experiment?.integrationStatus ?? ""}
              placeholder="Integrated / Pending / Rejected" className={input} />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="block font-body text-sm text-text-muted">Key Finding</label>
          <textarea name="keyFinding" rows={3}
            defaultValue={experiment?.keyFinding ?? ""}
            placeholder="The single most important takeaway from this experiment…"
            className={`${input} resize-none`} />
        </div>
        <div className="space-y-1.5">
          <label className="block font-body text-sm text-text-muted">
            Notes <span className="text-text-subtle font-normal text-xs">internal only</span>
          </label>
          <textarea name="notes" rows={2}
            defaultValue={experiment?.notes ?? ""}
            className={`${input} resize-none`} />
        </div>
      </div>

      <div className="flex items-center gap-4 pt-1">
        <button type="submit"
          className="px-5 py-2 bg-gold text-background font-body text-sm font-medium rounded hover:bg-gold-light transition-colors">
          {experiment ? "Save Changes" : "Log Experiment"}
        </button>
        {experiment && (
          <span className="font-body text-xs text-text-subtle">
            Last updated: {new Date(experiment.updatedAt).toLocaleString()}
          </span>
        )}
      </div>
    </form>
  );
}
