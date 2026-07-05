export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth, UNAUTHORIZED } from "@/lib/adminAuth";
import {
  generateClientId,
  kvCreateCommission,
  kvGetAllCommissions,
} from "@/lib/commissions/kv";
import type { Commission, Song, PackageType } from "@/types/commission";

interface CreateCommissionBody {
  clientName: string;
  email: string;
  packageType: PackageType;
  totalSongs: number;
  notes: string;
}

export async function GET(req: NextRequest): Promise<Response> {
  if (!checkAdminAuth(req)) return UNAUTHORIZED;

  try {
    const commissions = await kvGetAllCommissions();
    return NextResponse.json(commissions);
  } catch (err) {
    console.error("[GET /api/admin/commissions]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  if (!checkAdminAuth(req)) return UNAUTHORIZED;

  try {
    const body = (await req.json()) as CreateCommissionBody;
    const { clientName, email, packageType, totalSongs, notes } = body;

    if (!clientName || !email || !packageType || !totalSongs) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const clientId = await generateClientId();
    const now = new Date().toISOString();

    const commission: Commission = {
      clientId,
      clientName,
      email,
      packageType,
      totalSongs,
      notes: notes ?? "",
      createdAt: now,
      updatedAt: now,
    };

    const songs: Song[] = Array.from({ length: totalSongs }, (_, i) => {
      const trackNumber = i + 1;
      return {
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
    });

    await kvCreateCommission(commission, songs);

    return NextResponse.json({ clientId, commission, songs }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/admin/commissions]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
