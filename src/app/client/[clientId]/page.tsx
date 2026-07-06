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
 * - Client accounts: add client auth hash for passphrase login
 */

export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LogOut } from "lucide-react";
import {
  kvGetClient,
  kvGetCommissionsByClient,
  kvGetSongs,
} from "@/lib/supabase/queries";
import type {
  ClientPortalData,
  ClientCommissionView,
  ClientSong,
} from "@/types/commission";
import { PACKAGE_TIMELINE_RANGES } from "@/types/commission";
import StageTracker from "@/components/client/StageTracker";
import RevisionCard from "@/components/client/RevisionCard";
import SongCard from "@/components/client/SongCard";
import MessageThread from "@/components/client/MessageThread";
import { getMessages } from "@/lib/supabase/queries";

interface PageProps {
  params: Promise<{ clientId: string }>; // clientId = permanentId
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { clientId: permanentId } = await params;
  return {
    title: `Your Commission — ${permanentId} | Brass Note Studios`,
    robots: { index: false, follow: false },
  };
}

function formatDeliveryDate(dateStr: string): string {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const [year, month, day] = dateStr.split("-").map(Number);
  return `${months[month - 1]} ${day}, ${year}`;
}

async function getClientPortalData(permanentId: string): Promise<ClientPortalData | null> {
  const client = await kvGetClient(permanentId);
  if (!client) return null;

  const commissions = await kvGetCommissionsByClient(permanentId);
  if (commissions.length === 0) return null;

  const commissionViews: ClientCommissionView[] = await Promise.all(
    commissions.map(async (commission) => {
      const songs = await kvGetSongs(commission.fullCommissionId);
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
        fullCommissionId: commission.fullCommissionId,
        packageType: commission.packageType,
        totalSongs: commission.totalSongs,
        projectedDelivery: commission.projectedDelivery,
        songs: clientSongs,
      };
    })
  );

  return {
    permanentId: client.permanentId,
    clientName: client.clientName,
    commissions: commissionViews,
  };
}

// ── Commission section — rendered for each commission ─────────────────────────

function CommissionSection({ view }: { view: ClientCommissionView }) {
  const isSingle = view.totalSongs === 1;
  const primarySong = isSingle ? view.songs[0] : null;

  return (
    <section className="space-y-8">
      {/* Commission ID + delivery */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <p className="font-body text-xs text-text-subtle uppercase tracking-[0.15em] mb-0.5">
            Commission Tracking Number
          </p>
          <p className="font-mono text-sm text-text-muted">{view.fullCommissionId}</p>
        </div>

        {/* Delivery date card */}
        <div className="bg-surface border border-white/8 rounded-sm px-4 py-3 sm:text-right">
          <p className="font-display text-text-subtle text-[10px] tracking-[0.2em] uppercase mb-1">
            {view.projectedDelivery ? "Expected Delivery" : "Projected Delivery Window"}
          </p>
          {view.projectedDelivery ? (
            <>
              <p className="font-display text-text-base text-xl leading-tight">
                {formatDeliveryDate(view.projectedDelivery)}
              </p>
              <p className="font-body text-text-subtle text-xs mt-0.5">
                Typical: {PACKAGE_TIMELINE_RANGES[view.packageType]}
              </p>
            </>
          ) : (
            <p className="font-display text-gold text-lg leading-tight">
              {PACKAGE_TIMELINE_RANGES[view.packageType]}
            </p>
          )}
        </div>
      </div>

      {/* Single-song layout */}
      {isSingle && primarySong && (
        <div className="space-y-8">
          <section className="bg-surface border border-white/8 rounded-sm p-6 space-y-4">
            <h3 className="font-display text-text-muted text-sm tracking-widest uppercase">
              Production Stage
            </h3>
            <StageTracker currentStage={primarySong.productionStage} />
          </section>

          <section className="space-y-3">
            <h3 className="font-display text-text-muted text-sm tracking-widest uppercase px-1">
              Revisions
            </h3>
            <RevisionCard revisionsRemaining={primarySong.revisionsRemaining} />
          </section>

          {primarySong.lyricsReady && primarySong.lyrics && (
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
          )}
        </div>
      )}

      {/* Multi-song layout */}
      {!isSingle && (
        <div className="space-y-4">
          <h3 className="font-display text-text-muted text-sm tracking-widest uppercase px-1">
            Your Songs
          </h3>
          <div className="space-y-3">
            {view.songs.map((song) => (
              <SongCard key={song.songId} song={song} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function CommissionTrackerPage({ params }: PageProps) {
  const { clientId: permanentId } = await params;
  const data = await getClientPortalData(permanentId);

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
            className="inline-flex items-center gap-2 font-body text-sm font-semibold tracking-wide border border-gold/40 text-gold px-6 py-2.5 rounded-sm hover:bg-gold/10 transition-colors duration-200"
          >
            &larr; Try Again
          </Link>
        </div>
      </main>
    );
  }

  const multipleCommissions = data.commissions.length > 1;
  const messages = await getMessages(permanentId);
  const initialMessages = messages.map((m) => ({
    id: m.id,
    sender: m.sender,
    body: m.body,
    createdAt: m.createdAt,
  }));

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

        {/* Atelier notice */}
        <div className="flex items-start gap-3 px-4 py-3 border border-gold/15 rounded-sm bg-gold/[0.04]">
          <div className="w-0.5 self-stretch bg-gold/30 rounded-full shrink-0 mt-0.5" />
          <p className="font-body text-xs text-text-subtle leading-relaxed">
            <span className="text-gold/70 font-medium tracking-wide">Studio Notice&ensp;&mdash;&ensp;</span>
            This portal is currently being refined. Certain features, layouts, and details are subject to change as we perfect the experience for you.
          </p>
        </div>

        {/* Commission sections — one per commission (usually just one) */}
        {multipleCommissions ? (
          <div className="space-y-14">
            {data.commissions.map((view, i) => (
              <div key={view.fullCommissionId}>
                {i > 0 && <div className="h-px bg-white/8 mb-14" />}
                <CommissionSection view={view} />
              </div>
            ))}
          </div>
        ) : (
          <CommissionSection view={data.commissions[0]} />
        )}

        {/* Messaging */}
        <MessageThread permanentId={permanentId} initialMessages={initialMessages} />

        {/* Footer */}
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
