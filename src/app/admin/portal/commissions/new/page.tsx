export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import Link from "next/link";
import {
  kvGetOrCreateClient,
  kvAllocateCommissionIds,
  kvCreateCommission,
} from "@/lib/supabase/queries";
import type { Commission, Song, PackageType, ClientType } from "@/types/commission";
import { PACKAGE_DELIVERY_DAYS } from "@/types/commission";
import CreateCommissionForm from "./CreateCommissionForm";

async function createCommission(formData: FormData) {
  "use server";

  const clientName = (formData.get("clientName") as string | null)?.trim();
  const email = (formData.get("email") as string | null)?.trim();
  const clientType = (formData.get("clientType") as ClientType) || "individual";
  const packageType = formData.get("packageType") as PackageType;
  const totalSongsRaw = parseInt((formData.get("totalSongs") as string) || "1", 10);
  const totalSongs = isNaN(totalSongsRaw) || totalSongsRaw < 1 ? 1 : totalSongsRaw;
  const notes = ((formData.get("notes") as string | null) || "").trim();

  if (!clientName || !email || !packageType) {
    throw new Error("Missing required fields");
  }

  const now = new Date().toISOString();

  // Returning client check — matched by email; reuses their permanentId
  const { client } = await kvGetOrCreateClient(clientName, email, now);

  // Allocate consecutive global song IDs; first song seq anchors the fullCommissionId
  const { fullCommissionId, songIds } = await kvAllocateCommissionIds(
    client.permanentId,
    clientType,
    packageType,
    totalSongs
  );

  // Auto-calculate projected delivery from intake date + package default
  const deliveryDate = new Date(now);
  deliveryDate.setDate(deliveryDate.getDate() + PACKAGE_DELIVERY_DAYS[packageType]);
  const projectedDelivery = deliveryDate.toISOString().split("T")[0];

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
    projectedDelivery,
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

  redirect(`/admin/portal/commissions/${fullCommissionId}?created=true`);
}

export default async function NewCommissionPage() {
  return (
    <div className="max-w-lg space-y-8">
      <div>
        <Link
          href="/admin/portal"
          className="inline-flex items-center gap-1.5 text-text-subtle font-body text-sm hover:text-text-muted transition-colors mb-4"
        >
          ← Portal
        </Link>
        <h1 className="font-display text-3xl text-text-base">New Commission</h1>
        <p className="text-text-muted font-body text-sm mt-1">
          Returning clients are matched by email — they keep their Portal Login ID.
        </p>
      </div>

      <div className="bg-surface border border-white/10 rounded-lg px-5 py-5">
        <CreateCommissionForm action={createCommission} />
      </div>
    </div>
  );
}
