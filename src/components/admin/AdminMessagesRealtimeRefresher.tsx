"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";

// Invisible component — keeps the server-rendered messages list up to date.
// Two strategies run in parallel:
//   1. Supabase Realtime: instant update if the anon key's RLS policy allows it.
//   2. Polling every 15 s: guaranteed fallback regardless of RLS.
export default function AdminMessagesRealtimeRefresher() {
  const router = useRouter();

  // Realtime fast path
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

  // Polling fallback — fires every 15 s so the list always catches up
  useEffect(() => {
    const timer = setInterval(() => { router.refresh(); }, 15_000);
    return () => clearInterval(timer);
  }, [router]);

  return null;
}
