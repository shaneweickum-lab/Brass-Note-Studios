"use client";

import { useState } from "react";
import Link from "next/link";
import type { Commission, Song } from "@/types/commission";
import { STAGE_LABELS, formatCommissionId } from "@/types/commission";
import { stageStyle } from "@/lib/portal/stageStyle";
import { getSongIndex } from "@/lib/songId";
import CommissionEditForm from "./CommissionEditForm";
import ClientIdCopy from "./ClientIdCopy";
import AdminMessageThread from "@/components/admin/AdminMessageThread";

interface Message {
  id: string;
  sender: "client" | "admin";
  body: string;
  createdAt: string;
}

interface Props {
  commission: Commission;
  songs: Song[];
  initialMessages: Message[];
  fullCommissionId: string;
  created?: string;
  unreadCount: number;
  updateCommission: (formData: FormData) => Promise<void>;
  deleteCommission: () => Promise<void>;
  addSong: () => Promise<void>;
  onSend: (text: string) => Promise<{ id: string; sender: "admin"; body: string; createdAt: string }>;
}

type TabId = "details" | "songs" | "messages";

const TABS: { id: TabId; label: string }[] = [
  { id: "details",  label: "Details"  },
  { id: "songs",    label: "Songs"    },
  { id: "messages", label: "Messages" },
];

export default function AdminCommissionTabs({
  commission,
  songs,
  initialMessages,
  fullCommissionId,
  created,
  unreadCount,
  updateCommission,
  deleteCommission,
  addSong,
  onSend,
}: Props) {
  const [activeTab, setActiveTab] = useState<TabId>(
    unreadCount > 0 ? "messages" : "details"
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const displayId = formatCommissionId(commission.fullCommissionId, commission.totalSongs);

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteCommission();
    } catch {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  }

  return (
    <div className="space-y-6">

      {/* ── Back link ────────────────────────────────────────────────── */}
      <Link
        href="/admin/portal/commissions"
        className="inline-flex items-center gap-1.5 text-text-subtle font-body text-sm hover:text-text-muted transition-colors"
      >
        ← Commissions
      </Link>

      {/* ── Created banner ───────────────────────────────────────────── */}
      {created === "true" && (
        <div className="border border-gold/30 bg-gold/5 rounded-lg px-5 py-5 space-y-4">
          <p className="font-body text-sm text-gold font-medium">
            Commission created — share the Portal Login ID with your client
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <ClientIdCopy id={commission.permanentId} label="Client Portal Login ID" />
            <ClientIdCopy id={displayId} label="Full Commission Tracking Number" muted />
          </div>
        </div>
      )}

      {/* ── Page header ──────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl text-text-base">{commission.clientName}</h1>
          <p className="text-text-muted font-body text-sm mt-1 capitalize">
            {commission.clientType} &middot; {commission.packageType} &middot;{" "}
            {commission.totalSongs} song{commission.totalSongs !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex flex-col gap-2 items-end">
          <ClientIdCopy id={commission.permanentId} label="Portal Login ID" compact />
          <ClientIdCopy id={displayId} label="Commission ID" compact muted />
        </div>
      </div>

      {/* ── Tab navigation ───────────────────────────────────────────── */}
      <div className="border-b border-white/10">
        <nav className="flex -mb-px">
          {TABS.map(({ id, label }) => {
            const showBadge = id === "messages" && unreadCount > 0;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`
                  relative px-5 py-3 font-body text-sm whitespace-nowrap
                  inline-flex items-center gap-2 transition-colors duration-150
                  ${activeTab === id ? "text-gold" : "text-text-muted hover:text-text-base"}
                `}
              >
                {label}
                {showBadge && (
                  <span className="inline-flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-gold text-background font-body text-[9px] font-bold leading-none">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
                {activeTab === id && (
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-gold rounded-t-sm" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* ── Tab content ──────────────────────────────────────────────── */}

      {/* Details */}
      {activeTab === "details" && (
        <div className="space-y-6">
          <div className="bg-surface border border-white/10 rounded-lg overflow-hidden">
            <div className="px-5 py-4 border-b border-white/10">
              <h2 className="font-display text-lg text-text-base">Commission Details</h2>
            </div>
            <div className="px-5 py-5">
              <CommissionEditForm commission={commission} action={updateCommission} />
            </div>
          </div>

          {/* Danger Zone */}
          <div className="border border-red-500/20 rounded-lg overflow-hidden">
            <div className="px-5 py-4 border-b border-red-500/10">
              <h2 className="font-body text-sm font-semibold text-red-400">Danger Zone</h2>
            </div>
            <div className="px-5 py-4">
              {!showDeleteConfirm ? (
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-body text-sm text-text-muted">Delete this commission</p>
                    <p className="font-body text-xs text-text-subtle mt-0.5">
                      Permanently removes the commission and all its songs. The client record is kept.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="shrink-0 px-4 py-2 border border-red-500/40 text-red-400 font-body text-sm rounded hover:bg-red-500/10 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="font-body text-sm text-red-400">
                    Are you sure? This will permanently delete{" "}
                    <span className="font-mono font-semibold">{displayId}</span> and all its songs.
                  </p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={deleting}
                      className="px-4 py-2 bg-red-500 text-white font-body text-sm rounded hover:bg-red-600 transition-colors disabled:opacity-50"
                    >
                      {deleting ? "Deleting…" : "Yes, delete permanently"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-4 py-2 border border-white/10 text-text-muted font-body text-sm rounded hover:bg-white/5 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Songs */}
      {activeTab === "songs" && (
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
                <div key={song.songId} className="px-5 py-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                      <span className="font-body text-xs text-text-subtle">Track {song.trackNumber}</span>
                      <span className="font-mono text-xs text-text-subtle/60">#{song.songId}</span>
                      <span className="font-mono text-xs text-gold/70">· #{getSongIndex(song.songId)}</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-body ${stageStyle(song.productionStage)}`}>
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
                    <p className="font-body text-sm text-text-base truncate">
                      {song.title || <span className="text-text-subtle italic">Untitled</span>}
                    </p>
                    <p className="font-body text-xs text-text-subtle mt-0.5">
                      {song.revisionsRemaining} revision{song.revisionsRemaining !== 1 ? "s" : ""} remaining
                    </p>
                  </div>
                  <Link
                    href={`/admin/portal/commissions/${fullCommissionId}/songs/${song.songId}`}
                    className="shrink-0 px-3 py-1.5 border border-white/10 text-text-muted font-body text-xs rounded hover:border-gold/40 hover:text-gold transition-colors"
                  >
                    Edit
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Messages — always mounted to keep real-time subscription active */}
      <div className={activeTab === "messages" ? "" : "hidden"}>
        <AdminMessageThread
          permanentId={commission.permanentId}
          clientName={commission.clientName}
          initialMessages={initialMessages}
          onSend={onSend}
        />
      </div>

    </div>
  );
}
