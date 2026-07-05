export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth, UNAUTHORIZED } from "@/lib/adminAuth";
import { kvGetSong, kvUpdateSong } from "@/lib/commissions/kv";
import type { Song } from "@/types/commission";

interface RouteContext {
  params: Promise<{ clientId: string; songId: string }>;
}

export async function GET(req: NextRequest, context: RouteContext): Promise<Response> {
  if (!checkAdminAuth(req)) return UNAUTHORIZED;

  try {
    const { clientId, songId } = await context.params;
    const song = await kvGetSong(clientId, songId);
    if (!song) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(song);
  } catch (err) {
    console.error("[GET /api/admin/commissions/[clientId]/songs/[songId]]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, context: RouteContext): Promise<Response> {
  if (!checkAdminAuth(req)) return UNAUTHORIZED;

  try {
    const { clientId, songId } = await context.params;
    const existing = await kvGetSong(clientId, songId);
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const body = (await req.json()) as Partial<Song> & { addRevisions?: number };
    const { addRevisions, ...songFields } = body;

    const merged: Song = {
      ...existing,
      ...songFields,
      // Lock identity fields
      songId: existing.songId,
      clientId: existing.clientId,
      updatedAt: new Date().toISOString(),
    };

    // Apply addRevisions if provided
    if (typeof addRevisions === "number" && addRevisions > 0) {
      merged.revisionsTotal = (merged.revisionsTotal ?? existing.revisionsTotal) + addRevisions;
    }

    // Always recalculate revisionsRemaining
    merged.revisionsRemaining = merged.revisionsTotal - merged.revisionsUsed;

    await kvUpdateSong(merged);
    return NextResponse.json(merged);
  } catch (err) {
    console.error("[PUT /api/admin/commissions/[clientId]/songs/[songId]]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
