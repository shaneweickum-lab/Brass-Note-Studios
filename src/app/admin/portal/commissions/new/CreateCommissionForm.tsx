"use client";

import { useState } from "react";
import type { PackageType, ClientType } from "@/types/commission";
import { PACKAGE_DEFAULT_SONGS } from "@/types/commission";

const CLIENT_TYPE_OPTIONS: { value: ClientType; label: string; code: string }[] = [
  { value: "individual",      label: "Individual",      code: "Tier 1" },
  { value: "organization",    label: "Organization",    code: "Tier 2" },
  { value: "content-creator", label: "Content Creator", code: "Tier 3" },
];

const PACKAGE_OPTIONS: { value: PackageType; label: string; description: string }[] = [
  { value: "single",       label: "Single",       description: "1 song"  },
  { value: "ep",           label: "EP",           description: "3 songs" },
  { value: "lp",           label: "LP",           description: "5 songs" },
  { value: "album",        label: "Album",        description: "8 songs" },
  { value: "organization", label: "Organization", description: "Custom"  },
];

interface Props {
  action: (formData: FormData) => Promise<void>;
}

const input =
  "w-full bg-surface border border-white/10 rounded px-3 py-2 font-body text-sm text-text-base placeholder:text-text-subtle focus:outline-none focus:border-gold/50 transition-colors";

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-body text-xs text-text-subtle uppercase tracking-[0.15em] pt-1 pb-1 border-b border-white/5">
      {children}
    </h3>
  );
}

export default function CreateCommissionForm({ action }: Props) {
  const [packageType, setPackageType] = useState<PackageType>("single");
  const [totalSongs, setTotalSongs] = useState<number>(PACKAGE_DEFAULT_SONGS["single"]);

  function handlePackageChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const pkg = e.target.value as PackageType;
    setPackageType(pkg);
    setTotalSongs(PACKAGE_DEFAULT_SONGS[pkg]);
  }

  return (
    <form action={action} className="space-y-6">

      {/* ── Client Info ──────────────────────────────────── */}
      <div className="space-y-4">
        <SectionHeading>Client Info</SectionHeading>
        <div className="space-y-1.5">
          <label htmlFor="clientType" className="block font-body text-sm text-text-muted">Client Type</label>
          <select id="clientType" name="clientType" defaultValue="individual" className={input}>
            {CLIENT_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label} — {opt.code}</option>
            ))}
          </select>
          <p className="font-body text-xs text-text-subtle">Encoded as the tier digit in the Commission ID.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="clientName" className="block font-body text-sm text-text-muted">
              Client Name <span className="text-gold">*</span>
            </label>
            <input id="clientName" name="clientName" type="text" required autoComplete="off" placeholder="Jane Smith" className={input} />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="email" className="block font-body text-sm text-text-muted">
              Email <span className="text-gold">*</span>
            </label>
            <input id="email" name="email" type="email" required autoComplete="off" placeholder="jane@example.com" className={input} />
            <p className="font-body text-xs text-text-subtle">Returning clients keep their Portal Login ID.</p>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="phone" className="block font-body text-sm text-text-muted">
              Phone <span className="text-text-subtle font-normal text-xs">(optional)</span>
            </label>
            <input id="phone" name="phone" type="tel" placeholder="+1 (555) 000-0000" className={input} />
          </div>
        </div>
      </div>

      {/* ── Commission Details ────────────────────────────── */}
      <div className="space-y-4">
        <SectionHeading>Commission Details</SectionHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="packageType" className="block font-body text-sm text-text-muted">Package Type</label>
            <select id="packageType" name="packageType" value={packageType} onChange={handlePackageChange} className={input}>
              {PACKAGE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label} — {opt.description}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="totalSongs" className="block font-body text-sm text-text-muted">
              Total Songs <span className="ml-1 font-body text-xs text-text-subtle">auto-filled, editable</span>
            </label>
            <input
              id="totalSongs"
              name="totalSongs"
              type="number"
              min={1}
              max={20}
              required
              value={totalSongs}
              onChange={(e) => setTotalSongs(Math.max(1, parseInt(e.target.value, 10) || 1))}
              className={input}
            />
          </div>
        </div>
      </div>

      {/* ── Song Brief ───────────────────────────────────── */}
      <div className="space-y-4">
        <SectionHeading>Song Brief</SectionHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="songPurpose" className="block font-body text-sm text-text-muted">
              Occasion / Purpose
              <span className="ml-2 text-xs text-text-subtle font-normal">e.g. birthday, wedding</span>
            </label>
            <input id="songPurpose" name="songPurpose" type="text" placeholder="Anniversary gift" className={input} />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="songRecipients" className="block font-body text-sm text-text-muted">
              Song About / For
              <span className="ml-2 text-xs text-text-subtle font-normal">who is this for?</span>
            </label>
            <input id="songRecipients" name="songRecipients" type="text" placeholder="My wife Sarah, married 25 years" className={input} />
          </div>
        </div>
        <div className="space-y-1.5">
          <label htmlFor="songStory" className="block font-body text-sm text-text-muted">
            Story &amp; Key Details
            <span className="ml-2 text-xs text-text-subtle font-normal">memories, emotions, anything that should go into the song</span>
          </label>
          <textarea
            id="songStory"
            name="songStory"
            rows={4}
            placeholder="We met in college, she loves sunsets, our first dance was to…"
            className={`${input} resize-none`}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="stylePreferences" className="block font-body text-sm text-text-muted">
              Style / Mood
              <span className="ml-2 text-xs text-text-subtle font-normal">genre, tempo, vibe</span>
            </label>
            <input id="stylePreferences" name="stylePreferences" type="text" placeholder="Upbeat pop, warm and sentimental" className={input} />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="referenceSongs" className="block font-body text-sm text-text-muted">
              Reference Songs
              <span className="ml-2 text-xs text-text-subtle font-normal">songs that match the feel</span>
            </label>
            <input id="referenceSongs" name="referenceSongs" type="text" placeholder='"Perfect" by Ed Sheeran' className={input} />
          </div>
        </div>
      </div>

      {/* ── Internal Notes ───────────────────────────────── */}
      <div className="space-y-4">
        <SectionHeading>Internal Notes</SectionHeading>
        <div className="space-y-1.5">
          <label htmlFor="notes" className="block font-body text-sm text-text-muted">
            Notes <span className="ml-1 text-xs text-text-subtle font-normal">optional, admin-only</span>
          </label>
          <textarea id="notes" name="notes" rows={3} placeholder="Any initial notes about this commission…" className={`${input} resize-none`} />
        </div>
      </div>

      <div className="flex items-center gap-4 pt-2">
        <button type="submit" className="px-5 py-2 bg-gold text-background font-body text-sm font-medium rounded hover:bg-gold-light transition-colors">
          Create Commission
        </button>
        <a href="/admin/portal/commissions" className="font-body text-sm text-text-muted hover:text-text-base transition-colors">
          Cancel
        </a>
      </div>
    </form>
  );
}
