/*
 * Phase 2 — Planned additions (not in this build):
 * - Revision submission: client submits feedback through the portal
 * - Client approval: formal delivery sign-off through the portal
 * - Notification system: email/SMS when production stage changes
 *
 * Architecture notes for Phase 2:
 * - Add approval_status field to Song schema
 * - Notification triggers: call Resend on kvUpdateSong when stage changes
 * - Client accounts: add client auth hash for passphrase login
 */

export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  kvGetClient,
  kvGetCommissionsByClient,
  kvGetSongs,
  getMessages,
} from "@/lib/supabase/queries";
import type {
  ClientPortalData,
  ClientCommissionView,
  ClientSong,
} from "@/types/commission";
import ClientPortalShell from "@/components/client/ClientPortalShell";

interface PageProps {
  params: Promise<{ clientId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { clientId: permanentId } = await params;
  return {
    title: `Your Commission — ${permanentId} | Brass Note Studios`,
    robots: { index: false, follow: false },
  };
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

export default async function CommissionTrackerPage({ params }: PageProps) {
  const { clientId: permanentId } = await params;
  const [data, messages] = await Promise.all([
    getClientPortalData(permanentId),
    getMessages(permanentId),
  ]);

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
          <a
            href="/client"
            className="inline-flex items-center gap-2 font-body text-sm font-semibold tracking-wide border border-gold/40 text-gold px-6 py-2.5 rounded-sm hover:bg-gold/10 transition-colors duration-200"
          >
            &larr; Try Again
          </a>
        </div>
      </main>
    );
  }

  const initialMessages = messages.map((m) => ({
    id: m.id,
    sender: m.sender,
    body: m.body,
    createdAt: m.createdAt,
  }));

  return <ClientPortalShell data={data} initialMessages={initialMessages} />;
}
