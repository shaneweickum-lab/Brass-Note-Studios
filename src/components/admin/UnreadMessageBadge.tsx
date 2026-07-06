"use client";

import { useState, useEffect } from "react";
import type { MessageThreadSummary } from "@/app/api/admin/messages/route";

export default function UnreadMessageBadge() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    async function fetchCount() {
      try {
        const res = await fetch("/api/admin/messages");
        if (!res.ok) return;
        const threads: MessageThreadSummary[] = await res.json();
        const total = threads.reduce((sum, t) => sum + t.unreadCount, 0);
        setCount(total);
      } catch {
        // silent
      }
    }

    fetchCount();
    const interval = setInterval(fetchCount, 30_000);
    return () => clearInterval(interval);
  }, []);

  if (!count) return null;

  return (
    <span className="ml-1 inline-flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-gold text-background font-body text-[9px] font-bold leading-none">
      {count > 99 ? "99+" : count}
    </span>
  );
}
