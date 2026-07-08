"use client";

import type { Commission, PackageType, ClientType } from "@/types/commission";
import { PACKAGE_TIMELINE_RANGES } from "@/types/commission";

interface Props {
  commission: Commission;
  action: (formData: FormData) => Promise<void>;
}

const CLIENT_TYPE_OPTIONS: { value: ClientType; label: string }[] = [
  { value: "individual",      label: "Individual (Tier 1)"      },
  { value: "organization",    label: "Organization (Tier 2)"    },
  { value: "content-creator", label: "Content Creator (Tier 3)" },
];

const PACKAGE_OPTIONS: { value: PackageType; label: string }[] = [
  { value: "single",       label: "Single"       },
  { value: "ep",           label: "EP"           },
  { value: "lp",           label: "LP"           },
  { value: "album",        label: "Album"        },
  { value: "organization", label: "Organization" },
];

const input =
  "w-full bg-background border border-white/10 rounded px-3 py-2 font-body text-sm text-text-base placeholder:text-text-subtle focus:outline-none focus:border-gold/50 transition-colors";

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-body text-xs text-text-subtle uppercase tracking-[0.15em] pt-2 pb-1 border-b border-white/5">
      {children}
    </h3>
  );
}

export default function CommissionEditForm({ commission, action }: Props) {
  return (
    <form action={action} className="space-y-6">

      {/* ── Client Info ──────────────────────────────────────── */}
      <div className="space-y-4">
        <SectionHeading>Client Info</SectionHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block font-body text-sm text-text-muted">Client Type</label>
            <select name="clientType" defaultValue={commission.clientType ?? "individual"} className={input}>
              {CLIENT_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block font-body text-sm text-text-muted">Client Name</label>
            <input name="clientName" type="text" required defaultValue={commission.clientName} className={input} />
          </div>
          <div className="space-y-1.5">
            <label className="block font-body text-sm text-text-muted">Email</label>
            <input name="email" type="email" required defaultValue={commission.email} className={input} />
          </div>
          <div className="space-y-1.5">
            <label className="block font-body text-sm text-text-muted">
              Phone <span className="text-text-subtle font-normal text-xs">(optional)</span>
            </label>
            <input name="phone" type="tel" defaultValue={commission.phone ?? ""} placeholder="+1 (555) 000-0000" className={input} />
          </div>
        </div>
      </div>

      {/* ── Commission Details ────────────────────────────────── */}
      <div className="space-y-4">
        <SectionHeading>Commission Details</SectionHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block font-body text-sm text-text-muted">Package Type</label>
            <select name="packageType" defaultValue={commission.packageType} className={input}>
              {PACKAGE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block font-body text-sm text-text-muted">Total Songs</label>
            <input name="totalSongs" type="number" min={1} max={20} defaultValue={commission.totalSongs} className={input} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <label className="block font-body text-sm text-text-muted">
              Expected Delivery Date
              <span className="ml-2 font-body text-xs text-text-subtle">
                typical: {PACKAGE_TIMELINE_RANGES[commission.packageType]}
              </span>
            </label>
            <input name="projectedDelivery" type="date" defaultValue={commission.projectedDelivery ?? ""} className={input} />
          </div>
        </div>
      </div>

      {/* ── Song Brief ───────────────────────────────────────── */}
      <div className="space-y-4">
        <SectionHeading>Song Brief</SectionHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block font-body text-sm text-text-muted">
              Occasion / Purpose
              <span className="ml-2 text-xs text-text-subtle font-normal">e.g. birthday, wedding, anniversary</span>
            </label>
            <input name="songPurpose" type="text" defaultValue={commission.songPurpose ?? ""} placeholder="Anniversary gift" className={input} />
          </div>
          <div className="space-y-1.5">
            <label className="block font-body text-sm text-text-muted">
              Song About / For
              <span className="ml-2 text-xs text-text-subtle font-normal">who is this for?</span>
            </label>
            <input name="songRecipients" type="text" defaultValue={commission.songRecipients ?? ""} placeholder="My wife Sarah, married 25 years" className={input} />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="block font-body text-sm text-text-muted">
            Story &amp; Key Details
            <span className="ml-2 text-xs text-text-subtle font-normal">memories, emotions, anything that should go into the song</span>
          </label>
          <textarea
            name="songStory"
            rows={5}
            defaultValue={commission.songStory ?? ""}
            placeholder="We met in college, she loves sunsets, our first dance was to…"
            className={`${input} resize-none`}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block font-body text-sm text-text-muted">
              Style / Mood
              <span className="ml-2 text-xs text-text-subtle font-normal">genre, tempo, vibe</span>
            </label>
            <input name="stylePreferences" type="text" defaultValue={commission.stylePreferences ?? ""} placeholder="Upbeat pop, warm and sentimental" className={input} />
          </div>
          <div className="space-y-1.5">
            <label className="block font-body text-sm text-text-muted">
              Reference Songs
              <span className="ml-2 text-xs text-text-subtle font-normal">songs that match the feel they want</span>
            </label>
            <input name="referenceSongs" type="text" defaultValue={commission.referenceSongs ?? ""} placeholder='"Perfect" by Ed Sheeran' className={input} />
          </div>
        </div>
      </div>

      {/* ── Internal Notes ───────────────────────────────────── */}
      <div className="space-y-4">
        <SectionHeading>Internal Notes</SectionHeading>
        <div className="space-y-1.5">
          <label className="block font-body text-sm text-text-muted">
            Notes
            <span className="ml-2 text-xs text-text-subtle font-normal">admin-only, not shown to client</span>
          </label>
          <textarea name="notes" rows={3} defaultValue={commission.notes} className={`${input} resize-none`} placeholder="Internal notes about this commission…" />
        </div>
      </div>

      <div className="flex items-center gap-4 pt-1">
        <button type="submit" className="px-5 py-2 bg-gold text-background font-body text-sm font-medium rounded hover:bg-gold-light transition-colors">
          Save Changes
        </button>
        <span className="font-body text-xs text-text-subtle">
          Last updated: {new Date(commission.updatedAt).toLocaleString()}
        </span>
      </div>
    </form>
  );
}
