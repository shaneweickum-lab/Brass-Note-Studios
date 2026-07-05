export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import Link from "next/link";
import { generateClientId, kvCreateCommission } from "@/lib/commissions/kv";
import type { Commission, Song, PackageType } from "@/types/commission";
import CreateCommissionForm from "./CreateCommissionForm";

async function createCommission(formData: FormData) {
  "use server";

  const clientName = (formData.get("clientName") as string | null)?.trim();
  const email = (formData.get("email") as string | null)?.trim();
  const packageType = formData.get("packageType") as PackageType;
  const totalSongsRaw = parseInt((formData.get("totalSongs") as string) || "1", 10);
  const totalSongs = isNaN(totalSongsRaw) || totalSongsRaw < 1 ? 1 : totalSongsRaw;
  const notes = ((formData.get("notes") as string | null) || "").trim();

  if (!clientName || !email || !packageType) {
    throw new Error("Missing required fields");
  }

  const clientId = await generateClientId();
  const now = new Date().toISOString();

  const commission: Commission = {
    clientId,
    clientName,
    email,
    packageType,
    totalSongs,
    notes,
    createdAt: now,
    updatedAt: now,
  };

  const songs: Song[] = Array.from({ length: totalSongs }, (_, i) => ({
    songId: `${clientId}-song-${i + 1}`,
    clientId,
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

  redirect(`/admin/portal/commissions/${clientId}?created=true`);
}

export default function NewCommissionPage() {
  return (
    <div className="max-w-lg space-y-8">
      {/* Header */}
      <div>
        <Link
          href="/admin/portal"
          className="inline-flex items-center gap-1.5 text-text-subtle font-body text-sm hover:text-text-muted transition-colors mb-4"
        >
          ← Portal
        </Link>
        <h1 className="font-display text-3xl text-text-base">New Commission</h1>
        <p className="text-text-muted font-body text-sm mt-1">
          Create a new client commission — songs are created automatically.
        </p>
      </div>

      {/* Form card */}
      <div className="bg-surface border border-white/10 rounded-lg px-5 py-5">
        <CreateCommissionForm action={createCommission} />
      </div>
    </div>
  );
}
