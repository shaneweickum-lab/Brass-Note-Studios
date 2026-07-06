export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth, UNAUTHORIZED } from "@/lib/adminAuth";
import {
  kvGetCommission,
  kvGetSongs,
  kvUpdateCommission,
} from "@/lib/supabase/queries";
import type { Commission } from "@/types/commission";

interface RouteContext {
  params: Promise<{ clientId: string }>;
}

export async function GET(req: NextRequest, context: RouteContext): Promise<Response> {
  if (!checkAdminAuth(req)) return UNAUTHORIZED;

  try {
    const { clientId } = await context.params;
    const commission = await kvGetCommission(clientId);
    if (!commission) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const songs = await kvGetSongs(clientId);
    return NextResponse.json({ commission, songs });
  } catch (err) {
    console.error("[GET /api/admin/commissions/[clientId]]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, context: RouteContext): Promise<Response> {
  if (!checkAdminAuth(req)) return UNAUTHORIZED;

  try {
    const { clientId } = await context.params;
    const existing = await kvGetCommission(clientId);
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const body = (await req.json()) as Partial<Commission>;
    const updated: Commission = {
      ...existing,
      ...body,
      // Ensure identity fields are never overridden from outside
      permanentId: existing.permanentId,
      fullCommissionId: existing.fullCommissionId,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    };

    await kvUpdateCommission(updated);
    return NextResponse.json(updated);
  } catch (err) {
    console.error("[PUT /api/admin/commissions/[clientId]]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
