export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { kvGetCommission, kvGetSongs } from "@/lib/commissions/kv";
import { checkRateLimit } from "@/lib/rateLimit";
import type { ClientCommission, ClientSong } from "@/types/commission";

interface RouteContext {
  params: Promise<{ clientId: string }>;
}

export async function GET(req: NextRequest, context: RouteContext): Promise<Response> {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const { clientId } = await context.params;

    const commission = await kvGetCommission(clientId);
    if (!commission) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

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

    const response: ClientCommission = {
      clientId: commission.clientId,
      clientName: commission.clientName,
      packageType: commission.packageType,
      totalSongs: commission.totalSongs,
      songs: clientSongs,
    };

    return NextResponse.json(response);
  } catch (err) {
    console.error("[GET /api/client/[clientId]]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
