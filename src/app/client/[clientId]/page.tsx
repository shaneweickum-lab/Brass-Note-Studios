/*
 * Phase 2 — Planned additions (not in this build):
 * - Client messaging system: direct studio ↔ client communication thread
 * - Revision submission: client submits feedback through the portal
 * - Client approval: formal delivery sign-off through the portal
 * - Notification system: email/SMS when production stage changes
 *
 * Architecture notes for Phase 2:
 * - Add message thread to Commission schema: commission:{id}:messages list
 * - Add approval_status field to Song schema
 * - Notification triggers: call Resend on kvUpdateSong when stage changes
 * - Client accounts: add commission:{id}:auth hash with hashed passphrase
 */

export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LogOut } from "lucide-react";
import { kvGetCommission, kvGetSongs } from "@/lib/commissions/kv";
import type { ClientCommission, ClientSong } from "@/types/commission";
import { PACKAGE_TIMELINE_RANGES } from "@/types/commission";
import StageTracker from "@/components/client/StageTracker";
import RevisionCard from "@/components/client/RevisionCard";
import SongCard from "@/components/client/SongCard";

function formatDeliveryDate(dateStr: string): string {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const [year, month, day] = dateStr.split("-").map(Number);
  return `${months[month - 1]} ${day}, ${year}`;
}

interface PageProps {
  params: Promise<{ clientId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { clientId } = await params;
  return {
    title: `Your Commission — ${clientId} | Brass Note Studios`,
    robots: { index: false, follow: false },
  };
}

async function getClientCommission(clientId: string): Promise<ClientCommission | null> {
  const commission = await kvGetCommission(clientId);
  if (!commission) return null;

  const songs = await kvGetSongs(clientId);

  const clientSongs: ClientSong[] = songs.map((song) => ({
    songId: song.songId,
    title: song.title,
    trackNumber: song.trackNumber,
    productionStage: song.productionStage,
    revisionsRemaining: song.revisionsRemaining,
    lyricsReady: song.lyricsReady,
    lyrics: song.lyricsReady ? song.lyrics : null,
  }));

  return {
    clientId: commission.clientId,
    clientName: commission.clientName,
    packageType: commission.packageType,
    totalSongs: commission.totalSongs,
    songs: clientSongs,
    projectedDelivery: commission.projectedDelivery,
  };
}

export default async function CommissionTrackerPage({ params }: PageProps) {
  const { clientId } = await params;
  const data = await getClientCommission(clientId);

  if (!data) {
    return (
      <main className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-md text-center space-y-6">
          <p className="font-display text-gold text-sm tracking-[0.25em] uppercase">
            Brass Note Studios
          </p>
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-gold/20" />
            <div className="w-1.5 h-1.5 rotate-45 bg-gold/40" />
            <div className="h-px flex-1 bg-gold/20" />
          </div>
          <h1 className="font-display font-semibold text-2xl text-text-base">
            Commission Not Found
          </h1>
          <p className="font-body text-text-muted text-sm leading-relaxed">
            We couldn&rsquo;t find a commission associated with that Client ID.
            Please double-check the ID in your confirmation email.
          </p>
          <Link
            href="/client"
            className="
              inline-flex items-center gap-2
              font-body text-sm font-semibold tracking-wide
              border border-gold/40 text-gold
              px-6 py-2.5 rounded-sm
              hover:bg-gold/10 transition-colors duration-200
            "
          >
            &larr; Try Again
          </Link>
        </div>
      </main>
    );
  }

  const isSingle = data.totalSongs === 1;
  const primarySong = isSingle ? data.songs[0] : null;

  return (
    <main className="min-h-screen bg-background px-6 py-12 sm:py-16">
      <div className="max-w-2xl mx-auto space-y-10">

        {/* Page header */}
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
              Your Commission
            </h1>
            <p className="font-body text-text-muted text-base mt-1">
              {data.clientName}
            </p>
            <p className="font-mono text-sm text-gold mt-0.5">
              {data.clientId}
            </p>
          </div>

          {/* Delivery date card */}
          <div className="bg-surface border border-white/8 rounded-sm px-5 py-4">
            <p className="font-display text-text-subtle text-[10px] tracking-[0.2em] uppercase mb-1">
              {data.projectedDelivery ? "Expected Delivery" : "Projected Delivery Window"}
            </p>
            {data.projectedDelivery ? (
              <>
                <p className="font-display text-text-base text-2xl leading-tight">
                  {formatDeliveryDate(data.projectedDelivery)}
                </p>
                <p className="font-body text-text-subtle text-xs mt-1">
                  Typical range: {PACKAGE_TIMELINE_RANGES[data.packageType]}
                </p>
              </>
            ) : (
              <p className="font-display text-gold text-xl leading-tight">
                {PACKAGE_TIMELINE_RANGES[data.packageType]}
              </p>
            )}
          </div>
        </header>

        {/* Single-song layout */}
        {isSingle && primarySong && (
          <div className="space-y-8">
            {/* Stage tracker */}
            <section className="bg-surface border border-white/8 rounded-sm p-6 space-y-4">
              <h2 className="font-display text-text-muted text-sm tracking-widest uppercase">
                Production Stage
              </h2>
              <StageTracker currentStage={primarySong.productionStage} />
            </section>

            {/* Revisions */}
            <section className="space-y-3">
              <h2 className="font-display text-text-muted text-sm tracking-widest uppercase px-1">
                Revisions
              </h2>
              <RevisionCard revisionsRemaining={primarySong.revisionsRemaining} />
            </section>

            {/* Lyrics */}
            {primarySong.lyricsReady && primarySong.lyrics && (
              <section className="bg-surface border border-white/8 rounded-sm p-6 sm:p-10 space-y-4">
                <h2 className="font-display text-text-muted text-sm tracking-widest uppercase text-center">
                  Your Lyrics
                </h2>
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
            )}
          </div>
        )}

        {/* Multi-song layout */}
        {!isSingle && (
          <div className="space-y-4">
            <h2 className="font-display text-text-muted text-sm tracking-widest uppercase px-1">
              Your Songs
            </h2>
            <div className="space-y-3">
              {data.songs.map((song) => (
                <SongCard key={song.songId} song={song} />
              ))}
            </div>
          </div>
        )}

        {/* Footer note */}
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
