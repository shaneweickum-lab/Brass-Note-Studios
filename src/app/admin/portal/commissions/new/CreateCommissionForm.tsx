"use client";

import { useState } from "react";
import type { PackageType, ClientType } from "@/types/commission";
import { PACKAGE_DEFAULT_SONGS } from "@/types/commission";

const CLIENT_TYPE_OPTIONS: { value: ClientType; label: string; description: string }[] = [
  { value: "individual",      label: "Individual",      description: "Tier 1" },
  { value: "organization",    label: "Organization",    description: "Tier 2" },
  { value: "content-creator", label: "Content Creator", description: "Tier 3" },
];

const PACKAGE_OPTIONS: { value: PackageType; label: string; description: string }[] = [
  { value: "single", label: "Single",       description: "1 song" },
  { value: "ep",     label: "EP",           description: "3 songs" },
  { value: "lp",     label: "LP",           description: "5 songs" },
  { value: "album",  label: "Album",        description: "8 songs" },
  { value: "organization", label: "Organization", description: "Custom" },
];

interface Props {
  action: (formData: FormData) => Promise<void>;
  error?: string;
  defaultClientId?: string;
}

export default function CreateCommissionForm({ action, error, defaultClientId }: Props) {
  const [packageType, setPackageType] = useState<PackageType>("single");
  const [totalSongs, setTotalSongs] = useState<number>(PACKAGE_DEFAULT_SONGS["single"]);

  function handlePackageChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const pkg = e.target.value as PackageType;
    setPackageType(pkg);
    setTotalSongs(PACKAGE_DEFAULT_SONGS[pkg]);
  }

  return (
    <form action={action} className="space-y-5">
      {/* Error banner */}
      {error && (
        <div className="rounded border border-red-500/30 bg-red-500/10 px-4 py-3 font-body text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Client ID — optional override */}
      <div className="space-y-1.5">
        <label htmlFor="clientId" className="block font-body text-sm text-text-muted">
          Client ID
          <span className="ml-2 font-body text-xs text-text-subtle">
            optional — leave blank to auto-generate
          </span>
        </label>
        <input
          id="clientId"
          name="clientId"
          type="text"
          autoComplete="off"
          defaultValue={defaultClientId}
          className="w-full bg-surface border border-white/10 rounded px-3 py-2 font-mono text-sm text-gold placeholder:text-text-subtle placeholder:font-body focus:outline-none focus:border-gold/50 transition-colors"
          placeholder="BNS-2026-0001 or your own format"
        />
        <p className="font-body text-xs text-text-subtle">
          Use any format that matches your spreadsheets or CRM — no restrictions.
        </p>
      </div>

      {/* Client Type */}
      <div className="space-y-1.5">
        <label htmlFor="clientType" className="block font-body text-sm text-text-muted">
          Client Type
        </label>
        <select
          id="clientType"
          name="clientType"
          className="w-full bg-surface border border-white/10 rounded px-3 py-2 font-body text-sm text-text-base focus:outline-none focus:border-gold/50 transition-colors"
          defaultValue="individual"
        >
          {CLIENT_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label} — {opt.description}
            </option>
          ))}
        </select>
        <p className="font-body text-xs text-text-subtle">
          Baked into the Client ID — Individual (1), Organization (2), Content Creator (3).
        </p>
      </div>

      {/* Client Name */}
      <div className="space-y-1.5">
        <label htmlFor="clientName" className="block font-body text-sm text-text-muted">
          Client Name <span className="text-gold">*</span>
        </label>
        <input
          id="clientName"
          name="clientName"
          type="text"
          required
          autoComplete="off"
          className="w-full bg-surface border border-white/10 rounded px-3 py-2 font-body text-sm text-text-base placeholder:text-text-subtle focus:outline-none focus:border-gold/50 transition-colors"
          placeholder="Jane Smith"
        />
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <label htmlFor="email" className="block font-body text-sm text-text-muted">
          Email <span className="text-gold">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="off"
          className="w-full bg-surface border border-white/10 rounded px-3 py-2 font-body text-sm text-text-base placeholder:text-text-subtle focus:outline-none focus:border-gold/50 transition-colors"
          placeholder="jane@example.com"
        />
      </div>

      {/* Package Type */}
      <div className="space-y-1.5">
        <label htmlFor="packageType" className="block font-body text-sm text-text-muted">
          Package Type
        </label>
        <select
          id="packageType"
          name="packageType"
          value={packageType}
          onChange={handlePackageChange}
          className="w-full bg-surface border border-white/10 rounded px-3 py-2 font-body text-sm text-text-base focus:outline-none focus:border-gold/50 transition-colors"
        >
          {PACKAGE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label} — {opt.description}
            </option>
          ))}
        </select>
      </div>

      {/* Total Songs */}
      <div className="space-y-1.5">
        <label htmlFor="totalSongs" className="block font-body text-sm text-text-muted">
          Total Songs
          <span className="ml-2 font-body text-xs text-text-subtle">
            Auto-filled from package; editable
          </span>
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
          className="w-full bg-surface border border-white/10 rounded px-3 py-2 font-body text-sm text-text-base focus:outline-none focus:border-gold/50 transition-colors"
        />
      </div>

      {/* Notes */}
      <div className="space-y-1.5">
        <label htmlFor="notes" className="block font-body text-sm text-text-muted">
          Notes
          <span className="ml-2 font-body text-xs text-text-subtle">optional</span>
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          className="w-full bg-surface border border-white/10 rounded px-3 py-2 font-body text-sm text-text-base placeholder:text-text-subtle focus:outline-none focus:border-gold/50 transition-colors resize-none"
          placeholder="Any initial notes about this commission…"
        />
      </div>

      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          className="px-5 py-2 bg-gold text-background font-body text-sm font-medium rounded hover:bg-gold-light transition-colors"
        >
          Create Commission
        </button>
        <a
          href="/admin/portal/commissions"
          className="font-body text-sm text-text-muted hover:text-text-base transition-colors"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
