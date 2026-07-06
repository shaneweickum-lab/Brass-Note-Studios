"use client";

import { useState, useEffect } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function UnreadMessageBadge() {
  const [count, setCount] = useState<number | null>(null);

  async function fetchCount() {
    try {
      const { count: n } = await supabaseBrowser
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("sender", "client")
        .eq("is_read", false);
      setCount(n ?? 0);
    } catch {
      // silent
    }
  }

  useEffect(() => {
    fetchCount();

    // Subscribe to new messages so the badge updates in real time
    const channel = supabaseBrowser
      .channel("unread-badge")
      .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, fetchCount)
      .subscribe();

    return () => { supabaseBrowser.removeChannel(channel); };
  }, []);

  if (!count) return null;

  return (
    <span className="ml-1 inline-flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-gold text-background font-body text-[9px] font-bold leading-none">
      {count > 99 ? "99+" : count}
    </span>
  );
}
