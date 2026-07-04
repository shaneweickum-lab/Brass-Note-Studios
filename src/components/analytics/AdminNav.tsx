"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Globe, Bot, GitMerge, ScrollText } from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin/analytics",                       label: "Overview",   Icon: LayoutDashboard },
  { href: "/admin/analytics/website",               label: "Website",    Icon: Globe },
  { href: "/admin/analytics/concierge",             label: "Concierge",  Icon: Bot },
  { href: "/admin/analytics/journey",               label: "Journey",    Icon: GitMerge },
  { href: "/admin/analytics/raw",                   label: "Raw Logs",   Icon: ScrollText },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    /* Horizontal scroll on mobile, no wrap — fade hint on right edge */
    <div className="relative flex-1 min-w-0">
      {/* Fade-out edge hint */}
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 sm:hidden" />

      <nav className="flex items-center gap-1 overflow-x-auto scrollbar-hide pr-6 sm:pr-0">
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`
                inline-flex items-center gap-1.5 whitespace-nowrap shrink-0
                px-3 py-1.5 rounded font-body text-xs sm:text-sm transition-colors
                ${active
                  ? "bg-gold/15 text-gold border border-gold/40"
                  : "text-text-muted hover:text-text-base hover:bg-white/5 border border-transparent"
                }
              `}
            >
              <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
