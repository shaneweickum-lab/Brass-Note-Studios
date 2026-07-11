"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Globe,
  Bot,
  GitMerge,
  ScrollText,
  Briefcase,
  MessageSquare,
  FlaskConical,
  Receipt,
} from "lucide-react";
import UnreadMessageBadge from "@/components/admin/UnreadMessageBadge";

const NAV_ITEMS = [
  { href: "/admin/portal",                label: "Portal",   Icon: Briefcase,       matchPrefix: true,  badge: false },
  { href: "/admin/portal/messages",       label: "Messages", Icon: MessageSquare,   matchPrefix: true,  badge: true  },
  { href: "/admin/portal/labs",           label: "Labs",     Icon: FlaskConical,    matchPrefix: true,  badge: false },
  { href: "/admin/portal/expenses",       label: "Expenses", Icon: Receipt,         matchPrefix: true,  badge: false },
  { href: "/admin/analytics",             label: "Overview", Icon: LayoutDashboard, matchPrefix: false, badge: false },
  { href: "/admin/analytics/website",     label: "Website",  Icon: Globe,           matchPrefix: false, badge: false },
  { href: "/admin/analytics/concierge",   label: "Benny",    Icon: Bot,             matchPrefix: false, badge: false },
  { href: "/admin/analytics/journey",     label: "Journey",  Icon: GitMerge,        matchPrefix: false, badge: false },
  { href: "/admin/analytics/raw",         label: "Logs",     Icon: ScrollText,      matchPrefix: false, badge: false },
];

function isActive(href: string, matchPrefix: boolean, pathname: string) {
  if (href === "/admin/portal") {
    return (
      pathname === "/admin/portal" ||
      (pathname.startsWith("/admin/portal") &&
        !pathname.startsWith("/admin/portal/messages") &&
        !pathname.startsWith("/admin/portal/labs") &&
        !pathname.startsWith("/admin/portal/expenses"))
    );
  }
  return matchPrefix ? pathname.startsWith(href) : pathname === href;
}

export default function AdminBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="
        sm:hidden fixed bottom-0 left-0 right-0 z-50
        bg-background/95 backdrop-blur border-t border-white/10
      "
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex overflow-x-auto scrollbar-hide">
        {NAV_ITEMS.map(({ href, label, Icon, matchPrefix, badge }) => {
          const active = isActive(href, matchPrefix, pathname);
          return (
            <Link
              key={href}
              href={href}
              className={`
                flex flex-col items-center justify-center gap-1
                min-w-[64px] py-2.5 px-2 shrink-0 relative
                transition-colors
                ${active ? "text-gold" : "text-text-subtle"}
              `}
            >
              <span className="relative">
                <Icon className="w-5 h-5" />
                {badge && <UnreadMessageBadge dot />}
              </span>
              <span className="font-body text-[9px] tracking-wide leading-none">
                {label}
              </span>
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-gold" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
