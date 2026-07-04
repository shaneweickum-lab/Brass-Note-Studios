"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/admin/analytics", label: "Overview" },
  { href: "/admin/analytics/website", label: "Website" },
  { href: "/admin/analytics/concierge", label: "Concierge" },
  { href: "/admin/analytics/journey", label: "Journey" },
  { href: "/admin/analytics/raw", label: "Raw Logs" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1 flex-wrap">
      {NAV_ITEMS.map(({ href, label }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`px-3 py-1.5 rounded font-body text-sm transition-colors ${
              active
                ? "bg-gold/15 text-gold border border-gold/40"
                : "text-text-muted hover:text-text-base hover:bg-white/5"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
