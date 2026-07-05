export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth, UNAUTHORIZED } from "@/lib/adminAuth";
import { kvGetCommission, kvAddSong } from "@/lib/commissions/kv";
import type { Song } from "@/types/commission";

interface RouteContext {
  params: Promise<{ clientId: string }>;
}

interface AddSongBody {
  trackNumber: number;
}

export async function POST(req: NextRequest, context: RouteContext): Promise<Response> {
  if (!checkAdminAuth(req)) return UNAUTHORIZED;

  try {
    const { clientId } = await context.params;

    const commission = await kvGetCommission(clientId);
    if (!commission) {
      return NextResponse.json({ error: "Commission not found" }, { status: 404 });
    }

    const body = (await req.json()) as AddSongBody;
    const { trackNumber } = body;

    if (typeof trackNumber !== "number" || trackNumber < 1) {
      return NextResponse.json({ error: "Invalid trackNumber" }, { status: 400 });
    }

    const now = new Date().toISOString();
    const song: Song = {
      songId: `${clientId}-song-${trackNumber}`,
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

    await kvAddSong(song);
    return NextResponse.json(song, { status: 201 });
  } catch (err) {
    console.error("[POST /api/admin/commissions/[clientId]/songs]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
