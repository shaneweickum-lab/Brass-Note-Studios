"use client";

import { useState, useEffect, useId } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";

interface Props {
  dot?: boolean;
}

export default function UnreadMessageBadge({ dot }: Props) {
  const instanceId = useId();
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
      .channel(`unread-badge-${instanceId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, fetchCount)
      .subscribe();

    return () => { supabaseBrowser.removeChannel(channel); };
  }, [instanceId]);

  if (!count) return null;

  if (dot) {
    return (
      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-gold border border-background" />
    );
  }

  return (
    <span className="ml-1 inline-flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-gold text-background font-body text-[9px] font-bold leading-none">
      {count > 99 ? "99+" : count}
    </span>
  );
}
