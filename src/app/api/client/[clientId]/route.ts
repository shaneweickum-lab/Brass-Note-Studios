export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import {
  kvGetClient,
  kvGetCommissionsByClient,
  kvGetSongs,
} from "@/lib/commissions/kv";
import { checkRateLimit } from "@/lib/rateLimit";
import type { ClientPortalData, ClientCommissionView, ClientSong } from "@/types/commission";

interface RouteContext {
  params: Promise<{ clientId: string }>; // clientId = permanentId
}

export async function GET(req: NextRequest, context: RouteContext): Promise<Response> {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const { clientId: permanentId } = await context.params;

    const client = await kvGetClient(permanentId);
    if (!client) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const commissions = await kvGetCommissionsByClient(permanentId);
    if (commissions.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

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

    // Never return email, notes, revisionsTotal, revisionsUsed, or admin metadata
    const response: ClientPortalData = {
      permanentId: client.permanentId,
      clientName: client.clientName,
      commissions: commissionViews,
    };

    return NextResponse.json(response);
  } catch (err) {
    console.error("[GET /api/client/[clientId]]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
