"use client";

import type { Commission, PackageType, ClientType } from "@/types/commission";
import { PACKAGE_TIMELINE_RANGES } from "@/types/commission";

interface Props {
  commission: Commission;
  action: (formData: FormData) => Promise<void>;
}

const CLIENT_TYPE_OPTIONS: { value: ClientType; label: string }[] = [
  { value: "individual",      label: "Individual (Tier 1)"       },
  { value: "organization",    label: "Organization (Tier 2)"     },
  { value: "content-creator", label: "Content Creator (Tier 3)"  },
];

const PACKAGE_OPTIONS: { value: PackageType; label: string }[] = [
  { value: "single",       label: "Single"       },
  { value: "ep",           label: "EP"           },
  { value: "lp",           label: "LP"           },
  { value: "album",        label: "Album"        },
  { value: "organization", label: "Organization" },
];

const inputClass =
  "w-full bg-background border border-white/10 rounded px-3 py-2 font-body text-sm text-text-base focus:outline-none focus:border-gold/50 transition-colors";

export default function CommissionEditForm({ commission, action }: Props) {
  return (
    <form action={action} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Client Name */}
        <div className="space-y-1.5">
          <label className="block font-body text-sm text-text-muted">Client Name</label>
          <input
            name="clientName"
            type="text"
            required
            defaultValue={commission.clientName}
            className={inputClass}
          />
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="block font-body text-sm text-text-muted">Email</label>
          <input
            name="email"
            type="email"
            required
            defaultValue={commission.email}
            className={inputClass}
          />
        </div>

        {/* Client Type */}
        <div className="space-y-1.5">
          <label className="block font-body text-sm text-text-muted">Client Type</label>
          <select
            name="clientType"
            defaultValue={commission.clientType ?? "individual"}
            className={inputClass}
          >
            {CLIENT_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Package Type */}
        <div className="space-y-1.5">
          <label className="block font-body text-sm text-text-muted">Package Type</label>
          <select
            name="packageType"
            defaultValue={commission.packageType}
            className={inputClass}
          >
            {PACKAGE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Total Songs */}
        <div className="space-y-1.5">
          <label className="block font-body text-sm text-text-muted">Total Songs</label>
          <input
            name="totalSongs"
            type="number"
            min={1}
            max={20}
            defaultValue={commission.totalSongs}
            className={inputClass}
          />
        </div>
      </div>

      {/* Projected / Expected Delivery */}
      <div className="space-y-1.5 sm:col-span-2">
        <label className="block font-body text-sm text-text-muted">
          {commission.projectedDelivery ? "Expected Delivery Date" : "Projected Delivery Window"}
          <span className="ml-2 font-body text-xs text-text-subtle">
            {commission.projectedDelivery
              ? `typical range: ${PACKAGE_TIMELINE_RANGES[commission.packageType]}`
              : PACKAGE_TIMELINE_RANGES[commission.packageType]}
          </span>
        </label>
        <input
          name="projectedDelivery"
          type="date"
          defaultValue={commission.projectedDelivery ?? ""}
          className={inputClass}
        />
        <p className="font-body text-xs text-text-subtle">
          Set a hard date when you have a clear picture — the client sees this as their expected delivery date.
        </p>
      </div>

      {/* Notes */}
      <div className="space-y-1.5">
        <label className="block font-body text-sm text-text-muted">Notes</label>
        <textarea
          name="notes"
          rows={4}
          defaultValue={commission.notes}
          className={`${inputClass} resize-none`}
          placeholder="Internal notes about this commission…"
        />
      </div>

      <div className="flex items-center gap-4 pt-1">
        <button
          type="submit"
          className="px-5 py-2 bg-gold text-background font-body text-sm font-medium rounded hover:bg-gold-light transition-colors"
        >
          Save Changes
        </button>
        <span className="font-body text-xs text-text-subtle">
          Last updated: {new Date(commission.updatedAt).toLocaleString()}
        </span>
      </div>
    </form>
  );
}
