export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import {
  kvGetSong,
  kvGetSongs,
  kvGetCommission,
  kvUpdateSong,
  kvUpdateCommission,
  computeCommissionStage,
} from "@/lib/supabase/queries";
import type { Song, ProductionStage } from "@/types/commission";
import SongEditForm from "./SongEditForm";

interface PageProps {
  params: Promise<{ clientId: string; songId: string }>;
}

export default async function SongDetailPage({ params }: PageProps) {
  // clientId here = fullCommissionId (admin portal param convention)
  const { clientId: fullCommissionId, songId } = await params;

  const [song, commission] = await Promise.all([
    kvGetSong(fullCommissionId, songId),
    kvGetCommission(fullCommissionId),
  ]);

  if (!song || !commission) notFound();

  // ── Server Action ───────────────────────────────────────────────────────────

  async function updateSong(formData: FormData) {
    "use server";
    const now = new Date().toISOString();

    const revisionsTotal = Math.max(
      0,
      parseInt((formData.get("revisionsTotal") as string) || "0", 10)
    );
    const revisionsUsed = Math.max(
      0,
      parseInt((formData.get("revisionsUsed") as string) || "0", 10)
    );
    const lyricsReadyRaw = formData.get("lyricsReady") === "true";
    const lyricsText = (formData.get("lyrics") as string | null) || null;

    const updated: Song = {
      ...song!,
      title: ((formData.get("title") as string) || "").trim(),
      productionStage: formData.get("productionStage") as ProductionStage,
      revisionsTotal,
      revisionsUsed,
      revisionsRemaining: Math.max(0, revisionsTotal - revisionsUsed),
      lyricsReady: lyricsReadyRaw,
      lyrics: lyricsReadyRaw ? lyricsText : null,
      notes: ((formData.get("notes") as string) || "").trim(),
      updatedAt: now,
    };

    await kvUpdateSong(updated);

    // Recompute commission-level stage from all songs after this update
    const allSongs = await kvGetSongs(fullCommissionId);
    const mergedSongs = allSongs.map((s) => (s.songId === updated.songId ? updated : s));
    await kvUpdateCommission({
      ...commission!,
      currentStage: computeCommissionStage(mergedSongs),
      updatedAt: now,
    });

    revalidatePath(`/admin/portal/commissions/${fullCommissionId}/songs/${songId}`);
    revalidatePath(`/admin/portal/commissions/${fullCommissionId}`);
    revalidatePath("/admin/portal");
    revalidatePath("/admin/portal/commissions");
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-2xl space-y-8">
      <Link
        href={`/admin/portal/commissions/${fullCommissionId}`}
        className="inline-flex items-center gap-1.5 text-text-subtle font-body text-sm hover:text-text-muted transition-colors"
      >
        ← {commission.clientName}
      </Link>

      <div>
        <p className="font-body text-xs text-text-subtle uppercase tracking-[0.15em] mb-1">
          {commission.permanentId} &middot; Track {song.trackNumber} &middot; Song #{song.songId}
        </p>
        <h1 className="font-display text-3xl text-text-base">
          {song.title || <span className="text-text-muted italic">Untitled</span>}
        </h1>
      </div>

      <div className="bg-surface border border-white/10 rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-white/10">
          <h2 className="font-display text-lg text-text-base">Song Details</h2>
        </div>
        <div className="px-5 py-5">
          <SongEditForm song={song} action={updateSong} />
        </div>
      </div>
    </div>
  );
}
