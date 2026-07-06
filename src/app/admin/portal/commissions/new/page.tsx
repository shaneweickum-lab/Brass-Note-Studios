export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import Link from "next/link";
import { generateClientId, kvCreateCommission, kvGetCommission } from "@/lib/commissions/kv";
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
  const customId = ((formData.get("clientId") as string | null) || "").trim();

  if (!clientName || !email || !packageType) {
    throw new Error("Missing required fields");
  }

  let clientId: string;
  if (customId) {
    // Check for collision before using the custom ID
    const existing = await kvGetCommission(customId);
    if (existing) {
      const encoded = encodeURIComponent(`Client ID "${customId}" is already in use. Choose a different ID or leave blank to auto-generate.`);
      redirect(`/admin/portal/commissions/new?error=${encoded}&id=${encodeURIComponent(customId)}`);
    }
    clientId = customId;
  } else {
    clientId = await generateClientId();
  }

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

interface PageProps {
  searchParams: Promise<{ error?: string; id?: string }>;
}

export default async function NewCommissionPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const error = params.error ? decodeURIComponent(params.error) : undefined;
  const defaultClientId = params.id ? decodeURIComponent(params.id) : undefined;

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
        <CreateCommissionForm
          action={createCommission}
          error={error}
          defaultClientId={defaultClientId}
        />
      </div>
    </div>
  );
}
