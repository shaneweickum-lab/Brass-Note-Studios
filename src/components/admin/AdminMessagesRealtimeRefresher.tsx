"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";

// Invisible component — subscribes to any new message INSERT and refreshes
// the parent server component so the thread list stays up to date.
export default function AdminMessagesRealtimeRefresher() {
  const router = useRouter();

  useEffect(() => {
    const channel = supabaseBrowser
      .channel("admin:messages:list-refresh")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        () => { router.refresh(); }
      )
      .subscribe();

    return () => { supabaseBrowser.removeChannel(channel); };
  }, [router]);

  return null;
}
