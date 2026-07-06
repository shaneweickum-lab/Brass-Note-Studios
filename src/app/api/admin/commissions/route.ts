export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth, UNAUTHORIZED } from "@/lib/adminAuth";
import {
  kvGetOrCreateClient,
  kvAllocateCommissionIds,
  kvCreateCommission,
  kvGetAllCommissions,
} from "@/lib/commissions/kv";
import type { Commission, Song, PackageType, ClientType } from "@/types/commission";
import { PACKAGE_DELIVERY_DAYS } from "@/types/commission";

interface CreateCommissionBody {
  clientName: string;
  email: string;
  clientType?: ClientType;
  packageType: PackageType;
  totalSongs: number;
  notes?: string;
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
    const { clientName, email, packageType, totalSongs } = body;
    const clientType: ClientType = body.clientType ?? "individual";
    const notes = body.notes ?? "";

    if (!clientName || !email || !packageType || !totalSongs) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const now = new Date().toISOString();

    const { client } = await kvGetOrCreateClient(clientName, email, now);

    const { fullCommissionId, songIds } = await kvAllocateCommissionIds(
      client.permanentId,
      clientType,
      packageType,
      totalSongs
    );

    const deliveryDate = new Date(now);
    deliveryDate.setDate(deliveryDate.getDate() + PACKAGE_DELIVERY_DAYS[packageType]);

    const commission: Commission = {
      permanentId: client.permanentId,
      fullCommissionId,
      clientName,
      email,
      clientType,
      packageType,
      totalSongs,
      currentStage: "intake",
      notes,
      projectedDelivery: deliveryDate.toISOString().split("T")[0],
      createdAt: now,
      updatedAt: now,
    };

    const songs: Song[] = songIds.map((songId, i) => ({
      songId,
      commissionId: fullCommissionId,
      title: "",
      trackNumber: i + 1,
      productionStage: "intake",
      revisionsTotal: 3,
      revisionsUsed: 0,
      revisionsRemaining: 3,
      lyricsReady: false,
      lyrics: null,
      notes: "",
      createdAt: now,
      updatedAt: now,
    }));

    await kvCreateCommission(commission, songs);

    return NextResponse.json(
      { permanentId: client.permanentId, fullCommissionId, commission, songs },
      { status: 201 }
    );
  } catch (err) {
    console.error("[POST /api/admin/commissions]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
