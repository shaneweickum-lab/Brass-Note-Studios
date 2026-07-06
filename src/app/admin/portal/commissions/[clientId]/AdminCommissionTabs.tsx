"use client";

import { useState } from "react";
import Link from "next/link";
import type { Commission, Song } from "@/types/commission";
import { STAGE_LABELS } from "@/types/commission";
import { stageStyle } from "@/lib/portal/stageStyle";
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
  addSong,
  onSend,
}: Props) {
  const [activeTab, setActiveTab] = useState<TabId>(
    // If there are unread messages, open the Messages tab by default
    unreadCount > 0 ? "messages" : "details"
  );

  return (
    <div className="space-y-6">

      {/* ── Back link ────────────────────────────────────────────────── */}
      <Link
        href="/admin/portal"
        className="inline-flex items-center gap-1.5 text-text-subtle font-body text-sm hover:text-text-muted transition-colors"
      >
        ← Portal
      </Link>

      {/* ── Created banner ───────────────────────────────────────────── */}
      {created === "true" && (
        <div className="border border-gold/30 bg-gold/5 rounded-lg px-5 py-5 space-y-4">
          <p className="font-body text-sm text-gold font-medium">
            Commission created — share the Portal Login ID with your client
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <ClientIdCopy id={commission.permanentId} label="Client Portal Login ID" />
            <ClientIdCopy id={commission.fullCommissionId} label="Full Commission Tracking Number" muted />
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
          <ClientIdCopy id={commission.fullCommissionId} label="Commission ID" compact muted />
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
        <div className="bg-surface border border-white/10 rounded-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-white/10">
            <h2 className="font-display text-lg text-text-base">Commission Details</h2>
          </div>
          <div className="px-5 py-5">
            <CommissionEditForm commission={commission} action={updateCommission} />
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
                      <span className="font-body text-xs text-text-subtle">
                        Track {song.trackNumber}
                      </span>
                      <span className="font-mono text-xs text-text-subtle/60">
                        #{song.songId}
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
                    <p className="font-body text-sm text-text-base truncate">
                      {song.title || <span className="text-text-subtle italic">Untitled</span>}
                    </p>
                    <p className="font-body text-xs text-text-subtle mt-0.5">
                      {song.revisionsRemaining} revision
                      {song.revisionsRemaining !== 1 ? "s" : ""} remaining
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
