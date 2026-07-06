"use client";

import { useState } from "react";
import Link from "next/link";
import { LogOut } from "lucide-react";
import type { ClientPortalData, ClientCommissionView, ClientSong } from "@/types/commission";
import { PACKAGE_TIMELINE_RANGES } from "@/types/commission";
import StageTracker from "@/components/client/StageTracker";
import RevisionCard from "@/components/client/RevisionCard";
import SongCard from "@/components/client/SongCard";
import MessageThread from "@/components/client/MessageThread";

interface Message {
  id: string;
  sender: "client" | "admin";
  body: string;
  createdAt: string;
}

interface Props {
  data: ClientPortalData;
  initialMessages: Message[];
}

type TabId = "progress" | "lyrics" | "revisions" | "messages";

const TABS: { id: TabId; label: string }[] = [
  { id: "progress",  label: "Progress"  },
  { id: "lyrics",    label: "Lyrics"    },
  { id: "revisions", label: "Revisions" },
  { id: "messages",  label: "Messages"  },
];

function formatDeliveryDate(dateStr: string): string {
  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];
  const [year, month, day] = dateStr.split("-").map(Number);
  return `${months[month - 1]} ${day}, ${year}`;
}

// ── Tab bar ───────────────────────────────────────────────────────────────────

function TabBar({
  tabs,
  active,
  onChange,
}: {
  tabs: { id: TabId; label: string }[];
  active: TabId;
  onChange: (id: TabId) => void;
}) {
  return (
    <div className="border-b border-white/10">
      <nav className="flex -mb-px overflow-x-auto scrollbar-hide">
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`
              relative px-5 py-3 font-body text-sm whitespace-nowrap shrink-0
              transition-colors duration-150
              ${active === id ? "text-gold" : "text-text-muted hover:text-text-base"}
            `}
          >
            {label}
            {active === id && (
              <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-gold rounded-t-sm" />
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}

// ── Pending lyrics placeholder ────────────────────────────────────────────────

function LyricsPending() {
  return (
    <section className="bg-surface border border-white/8 rounded-sm p-8 sm:p-12">
      <div className="text-center space-y-5">
        <h3 className="font-display text-text-muted text-sm tracking-widest uppercase">
          Your Lyrics
        </h3>
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-gold/10" />
          <div className="w-1 h-1 rotate-45 bg-gold/20" />
          <div className="h-px flex-1 bg-gold/10" />
        </div>
        <div className="py-6 space-y-3">
          <div className="space-y-3 max-w-xs mx-auto">
            {[65, 88, 55, 80, 45, 72].map((w, i) => (
              <div
                key={i}
                className="h-px bg-gold/25 mx-auto rounded-full"
                style={{ width: `${w}%` }}
              />
            ))}
          </div>
          <p className="font-body text-text-subtle text-sm mt-8 leading-relaxed">
            Your lyrics are being crafted with care.
            <br />
            They will appear here when they&rsquo;re ready.
          </p>
        </div>
      </div>
    </section>
  );
}

// ── Progress tab ──────────────────────────────────────────────────────────────

function ProgressTab({ commission }: { commission: ClientCommissionView }) {
  const isSingle = commission.totalSongs === 1;
  const primarySong: ClientSong | null = isSingle ? commission.songs[0] : null;

  return (
    <div className="space-y-6">
      {/* Tracking number + delivery date */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <p className="font-body text-xs text-text-subtle uppercase tracking-[0.15em] mb-0.5">
            Commission Tracking Number
          </p>
          <p className="font-mono text-sm text-text-muted">{commission.fullCommissionId}</p>
        </div>
        <div className="bg-surface border border-white/8 rounded-sm px-4 py-3 sm:text-right shrink-0">
          <p className="font-display text-text-subtle text-[10px] tracking-[0.2em] uppercase mb-1">
            {commission.projectedDelivery ? "Expected Delivery" : "Projected Delivery Window"}
          </p>
          {commission.projectedDelivery ? (
            <>
              <p className="font-display text-text-base text-xl leading-tight">
                {formatDeliveryDate(commission.projectedDelivery)}
              </p>
              <p className="font-body text-text-subtle text-xs mt-0.5">
                Typical: {PACKAGE_TIMELINE_RANGES[commission.packageType]}
              </p>
            </>
          ) : (
            <p className="font-display text-gold text-lg leading-tight">
              {PACKAGE_TIMELINE_RANGES[commission.packageType]}
            </p>
          )}
        </div>
      </div>

      {/* Stage tracker or song list */}
      {isSingle && primarySong ? (
        <section className="bg-surface border border-white/8 rounded-sm p-6 space-y-4">
          <h3 className="font-display text-text-muted text-sm tracking-widest uppercase">
            Production Stage
          </h3>
          <StageTracker currentStage={primarySong.productionStage} />
        </section>
      ) : (
        <div className="space-y-3">
          <h3 className="font-display text-text-muted text-sm tracking-widest uppercase px-1">
            Your Songs
          </h3>
          {commission.songs.map((song) => (
            <SongCard key={song.songId} song={song} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Lyrics tab ────────────────────────────────────────────────────────────────

function LyricsTab({ commission }: { commission: ClientCommissionView }) {
  const isSingle = commission.totalSongs === 1;
  const primarySong: ClientSong | null = isSingle ? commission.songs[0] : null;

  if (isSingle) {
    if (primarySong?.lyricsReady && primarySong.lyrics) {
      return (
        <section className="bg-surface border border-white/8 rounded-sm p-6 sm:p-10 space-y-4">
          <h3 className="font-display text-text-muted text-sm tracking-widest uppercase text-center">
            Your Lyrics
          </h3>
          <div className="flex items-center gap-4 mb-2">
            <div className="h-px flex-1 bg-gold/10" />
            <div className="w-1 h-1 rotate-45 bg-gold/20" />
            <div className="h-px flex-1 bg-gold/10" />
          </div>
          <div className="px-2 sm:px-8 py-4 text-center">
            <p
              className="font-display text-text-base text-lg sm:text-xl leading-loose whitespace-pre-line"
              style={{ fontWeight: 400 }}
            >
              {primarySong.lyrics}
            </p>
          </div>
        </section>
      );
    }
    return <LyricsPending />;
  }

  // Multi-song
  return (
    <div className="space-y-4">
      {commission.songs.map((song) => (
        <div key={song.songId} className="bg-surface border border-white/8 rounded-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-white/8 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="font-body text-xs text-text-subtle">Track {song.trackNumber}</p>
              <p className="font-body text-sm text-text-base truncate">
                {song.title || <span className="italic text-text-subtle">Untitled</span>}
              </p>
            </div>
            <span
              className={`shrink-0 font-body text-xs ${
                song.lyricsReady ? "text-emerald-400/80" : "text-text-subtle"
              }`}
            >
              {song.lyricsReady ? "Ready" : "Pending"}
            </span>
          </div>
          {song.lyricsReady && song.lyrics ? (
            <div className="px-5 py-6 text-center">
              <p
                className="font-display text-text-base leading-loose whitespace-pre-line"
                style={{ fontWeight: 400 }}
              >
                {song.lyrics}
              </p>
            </div>
          ) : (
            <div className="px-5 py-6 text-center">
              <p className="font-body text-text-subtle text-sm">
                Lyrics will appear here when they&rsquo;re ready.
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Revisions tab ─────────────────────────────────────────────────────────────

function RevisionsTab({ commission }: { commission: ClientCommissionView }) {
  const isSingle = commission.totalSongs === 1;
  const primarySong: ClientSong | null = isSingle ? commission.songs[0] : null;

  if (isSingle && primarySong) {
    return (
      <div className="space-y-4">
        <RevisionCard revisionsRemaining={primarySong.revisionsRemaining} />
        <p className="font-body text-xs text-text-subtle leading-relaxed px-1 text-center">
          Revision rounds allow you to request changes after the initial delivery.
          Contact the studio via Messages to submit your revision notes.
        </p>
      </div>
    );
  }

  // Multi-song
  return (
    <div className="space-y-3">
      {commission.songs.map((song) => (
        <div
          key={song.songId}
          className="bg-surface border border-white/8 rounded-sm px-5 py-4 flex items-center justify-between gap-4"
        >
          <div className="min-w-0">
            <p className="font-body text-xs text-text-subtle mb-0.5">Track {song.trackNumber}</p>
            <p className="font-body text-sm text-text-base truncate">
              {song.title || <span className="italic text-text-subtle">Untitled</span>}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="font-display text-2xl text-gold leading-none">{song.revisionsRemaining}</p>
            <p className="font-body text-xs text-text-subtle mt-0.5">
              revision{song.revisionsRemaining !== 1 ? "s" : ""} remaining
            </p>
          </div>
        </div>
      ))}
      <p className="font-body text-xs text-text-subtle leading-relaxed px-1 text-center pt-2">
        Revision rounds allow you to request changes after the initial delivery.
        Contact the studio via Messages to submit your revision notes.
      </p>
    </div>
  );
}

// ── Shell ─────────────────────────────────────────────────────────────────────

export default function ClientPortalShell({ data, initialMessages }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("progress");
  const [commissionIndex, setCommissionIndex] = useState(0);

  const commission = data.commissions[commissionIndex];
  const multipleCommissions = data.commissions.length > 1;

  return (
    <main className="min-h-screen bg-background px-6 py-12 sm:py-16">
      <div className="max-w-2xl mx-auto space-y-8">

        {/* ── Page header ─────────────────────────────────────────────── */}
        <header className="space-y-5">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <p className="font-display text-gold text-sm tracking-[0.25em] uppercase">
                Brass Note Studios
              </p>
              <Link
                href="/client"
                className="inline-flex items-center gap-1.5 font-body text-xs text-text-subtle hover:text-text-muted transition-colors"
              >
                <LogOut className="w-3 h-3" />
                Exit Portal
              </Link>
            </div>
            <div className="flex items-center gap-4 py-2">
              <div className="h-px flex-1 bg-gold/20" />
              <div className="w-1.5 h-1.5 rotate-45 bg-gold/40" />
              <div className="h-px flex-1 bg-gold/20" />
            </div>
          </div>

          <div>
            <h1 className="font-display font-semibold text-3xl text-text-base leading-tight">
              Your Commission{multipleCommissions ? "s" : ""}
            </h1>
            <p className="font-body text-text-muted text-base mt-1">{data.clientName}</p>
            <div className="mt-1.5 space-y-0.5">
              <p className="font-body text-xs text-text-subtle uppercase tracking-[0.15em]">
                Your Client ID
              </p>
              <p className="font-mono text-sm text-gold">{data.permanentId}</p>
            </div>
          </div>
        </header>

        {/* ── Atelier notice ───────────────────────────────────────────── */}
        <div className="flex items-start gap-3 px-4 py-3 border border-gold/15 rounded-sm bg-gold/[0.04]">
          <div className="w-0.5 self-stretch bg-gold/30 rounded-full shrink-0 mt-0.5" />
          <p className="font-body text-xs text-text-subtle leading-relaxed">
            <span className="text-gold/70 font-medium tracking-wide">Studio Notice&ensp;&mdash;&ensp;</span>
            This portal is currently being refined. Certain features, layouts, and details are subject to change as we perfect the experience for you.
          </p>
        </div>

        {/* ── Multi-commission selector ─────────────────────────────── */}
        {multipleCommissions && (
          <div className="flex items-center gap-3 flex-wrap">
            <p className="font-body text-xs text-text-subtle uppercase tracking-[0.15em]">
              Commission
            </p>
            <div className="flex gap-2 flex-wrap">
              {data.commissions.map((c, i) => (
                <button
                  key={c.fullCommissionId}
                  onClick={() => setCommissionIndex(i)}
                  className={`font-mono text-xs px-3 py-1.5 rounded border transition-colors ${
                    i === commissionIndex
                      ? "border-gold/50 bg-gold/10 text-gold"
                      : "border-white/10 text-text-muted hover:border-white/20"
                  }`}
                >
                  {c.fullCommissionId}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Tab navigation ───────────────────────────────────────────── */}
        <TabBar tabs={TABS} active={activeTab} onChange={setActiveTab} />

        {/* ── Tab content ──────────────────────────────────────────────── */}
        <div>
          {activeTab === "progress"  && <ProgressTab  commission={commission} />}
          {activeTab === "lyrics"    && <LyricsTab    commission={commission} />}
          {activeTab === "revisions" && <RevisionsTab commission={commission} />}

          {/* Messages: always mounted so real-time subscription stays active */}
          <div className={activeTab === "messages" ? "" : "hidden"}>
            <MessageThread permanentId={data.permanentId} initialMessages={initialMessages} />
          </div>
        </div>

        {/* ── Footer ───────────────────────────────────────────────────── */}
        <footer className="pt-4 border-t border-white/8">
          <p className="font-body text-text-subtle text-xs text-center leading-relaxed">
            Questions about your commission?{" "}
            <a
              href="/contact"
              className="text-gold/60 hover:text-gold transition-colors underline underline-offset-2"
            >
              Contact the studio
            </a>
            .
          </p>
        </footer>

      </div>
    </main>
  );
}
