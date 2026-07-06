export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import {
  kvGetCommission,
  kvGetSongs,
  kvUpdateCommission,
  kvAddSong,
  generateSongId,
} from "@/lib/commissions/kv";
import type { Commission, Song, PackageType, ClientType } from "@/types/commission";
import { STAGE_LABELS } from "@/types/commission";
import { stageStyle } from "@/lib/portal/stageStyle";
import ClientIdCopy from "./ClientIdCopy";
import CommissionEditForm from "./CommissionEditForm";

interface PageProps {
  params: Promise<{ clientId: string }>;
  searchParams: Promise<{ created?: string }>;
}

export default async function CommissionDetailPage({ params, searchParams }: PageProps) {
  const { clientId } = await params;
  const { created } = await searchParams;

  const [commission, songs] = await Promise.all([
    kvGetCommission(clientId),
    kvGetSongs(clientId),
  ]);

  if (!commission) notFound();

  // ── Server Actions ──────────────────────────────────────────────────────────

  async function updateCommission(formData: FormData) {
    "use server";
    const now = new Date().toISOString();
    const projectedDeliveryRaw = ((formData.get("projectedDelivery") as string) || "").trim();
    const updated: Commission = {
      clientId,
      clientName: ((formData.get("clientName") as string) || "").trim(),
      email: ((formData.get("email") as string) || "").trim(),
      clientType: (formData.get("clientType") as ClientType) || commission!.clientType || "individual",
      packageType: formData.get("packageType") as PackageType,
      totalSongs: parseInt((formData.get("totalSongs") as string) || "1", 10),
      notes: ((formData.get("notes") as string) || "").trim(),
      projectedDelivery: projectedDeliveryRaw || undefined,
      createdAt: commission!.createdAt,
      updatedAt: now,
    };
    await kvUpdateCommission(updated);
    revalidatePath(`/admin/portal/commissions/${clientId}`);
    revalidatePath("/admin/portal");
    revalidatePath("/admin/portal/commissions");
  }

  async function addSong() {
    "use server";
    const now = new Date().toISOString();
    const trackNumber = songs.length + 1;
    const songId = await generateSongId(clientId);
    const newSong: Song = {
      songId,
      clientId,
      title: "",
      trackNumber,
      productionStage: "intake",
      revisionsTotal: 3,
      revisionsUsed: 0,
      revisionsRemaining: 3,
      lyricsReady: false,
      lyrics: null,
      notes: "",
      createdAt: now,
      updatedAt: now,
    };
    await kvAddSong(newSong);
    await kvUpdateCommission({ ...commission!, updatedAt: now });
    revalidatePath(`/admin/portal/commissions/${clientId}`);
    revalidatePath("/admin/portal");
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-8">
      {/* Back link */}
      <Link
        href="/admin/portal"
        className="inline-flex items-center gap-1.5 text-text-subtle font-body text-sm hover:text-text-muted transition-colors"
      >
        ← Portal
      </Link>

      {/* Success banner */}
      {created === "true" && (
        <div className="border border-gold/30 bg-gold/5 rounded-lg px-5 py-4">
          <p className="font-body text-sm text-gold font-medium mb-2">
            Commission created — share this Client ID with your client
          </p>
          <ClientIdCopy clientId={clientId} />
        </div>
      )}

      {/* Page header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl text-text-base">{commission.clientName}</h1>
          <p className="text-text-muted font-body text-sm mt-1 capitalize">
            {commission.packageType} &middot; {commission.totalSongs} song
            {commission.totalSongs !== 1 ? "s" : ""}
          </p>
        </div>
        <ClientIdCopy clientId={clientId} compact />
      </div>

      {/* Commission Details card */}
      <div className="bg-surface border border-white/10 rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-white/10">
          <h2 className="font-display text-lg text-text-base">Commission Details</h2>
        </div>
        <div className="px-5 py-5">
          <CommissionEditForm commission={commission} action={updateCommission} />
        </div>
      </div>

      {/* Songs card */}
      <div className="bg-surface border border-white/10 rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="font-display text-lg text-text-base">
            Songs
            <span className="ml-2 font-body text-sm text-text-subtle font-normal">
              {songs.length} / {commission.totalSongs}
            </span>
          </h2>
          {songs.length < commission.totalSongs && (
            <form action={addSong}>
              <button
                type="submit"
                className="px-3 py-1.5 border border-gold/40 text-gold font-body text-xs rounded hover:bg-gold/10 transition-colors"
              >
                + Add Song
              </button>
            </form>
          )}
        </div>

        <div className="divide-y divide-white/5">
          {songs.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-text-subtle font-body text-sm">No songs yet.</p>
            </div>
          ) : (
            songs.map((song) => (
              <div
                key={song.songId}
                className="px-5 py-4 flex items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  {/* Badges row */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    <span className="font-body text-xs text-text-subtle">
                      Track {song.trackNumber}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-body ${stageStyle(song.productionStage)}`}
                    >
                      {STAGE_LABELS[song.productionStage]}
                    </span>
                    {song.lyricsReady ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded border border-emerald-400/30 bg-emerald-400/10 text-emerald-400 text-xs font-body">
                        Lyrics Ready
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded border border-white/10 text-text-subtle text-xs font-body">
                        Lyrics Pending
                      </span>
                    )}
                  </div>
                  {/* Title */}
                  <p className="font-body text-sm text-text-base truncate">
                    {song.title ? (
                      song.title
                    ) : (
                      <span className="text-text-subtle italic">Untitled</span>
                    )}
                  </p>
                  {/* Revisions */}
                  <p className="font-body text-xs text-text-subtle mt-0.5">
                    {song.revisionsRemaining} revision
                    {song.revisionsRemaining !== 1 ? "s" : ""} remaining
                  </p>
                </div>
                <Link
                  href={`/admin/portal/commissions/${clientId}/songs/${song.songId}`}
                  className="shrink-0 px-3 py-1.5 border border-white/10 text-text-muted font-body text-xs rounded hover:border-gold/40 hover:text-gold transition-colors"
                >
                  Edit
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
