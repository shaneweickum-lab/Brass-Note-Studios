export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  kvGetCommission,
  kvGetSongs,
  kvUpdateCommission,
  kvAddSong,
  kvAllocateSongId,
  computeCommissionStage,
  getMessages,
  createMessage,
} from "@/lib/supabase/queries";
import type { Commission, Song, PackageType, ClientType } from "@/types/commission";
import AdminCommissionTabs from "./AdminCommissionTabs";

interface PageProps {
  params: Promise<{ clientId: string }>;
  searchParams: Promise<{ created?: string }>;
}

export default async function CommissionDetailPage({ params, searchParams }: PageProps) {
  const { clientId: fullCommissionId } = await params;
  const { created } = await searchParams;

  const [commission, songs] = await Promise.all([
    kvGetCommission(fullCommissionId),
    kvGetSongs(fullCommissionId),
  ]);

  if (!commission) notFound();

  const rawMessages = await getMessages(commission.permanentId);
  const initialMessages = rawMessages.map((m) => ({
    id: m.id,
    sender: m.sender,
    body: m.body,
    createdAt: m.createdAt,
  }));
  const unreadCount = rawMessages.filter(
    (m) => m.sender === "client" && !m.isRead
  ).length;

  // ── Server Actions ──────────────────────────────────────────────────────────

  async function updateCommission(formData: FormData) {
    "use server";
    const now = new Date().toISOString();
    const projectedDeliveryRaw = ((formData.get("projectedDelivery") as string) || "").trim();
    const updated: Commission = {
      permanentId: commission!.permanentId,
      fullCommissionId,
      clientName: ((formData.get("clientName") as string) || "").trim(),
      email: ((formData.get("email") as string) || "").trim(),
      clientType: (formData.get("clientType") as ClientType) || commission!.clientType || "individual",
      packageType: formData.get("packageType") as PackageType,
      totalSongs: parseInt((formData.get("totalSongs") as string) || "1", 10),
      currentStage: commission!.currentStage,
      notes: ((formData.get("notes") as string) || "").trim(),
      projectedDelivery: projectedDeliveryRaw || undefined,
      createdAt: commission!.createdAt,
      updatedAt: now,
    };
    await kvUpdateCommission(updated);
    revalidatePath(`/admin/portal/commissions/${fullCommissionId}`);
    revalidatePath("/admin/portal");
    revalidatePath("/admin/portal/commissions");
  }

  async function addSong() {
    "use server";
    const now = new Date().toISOString();
    const trackNumber = songs.length + 1;
    const songId = await kvAllocateSongId();
    const newSong: Song = {
      songId,
      commissionId: fullCommissionId,
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
    await kvAddSong(newSong);
    const updatedSongs = [...songs, newSong];
    await kvUpdateCommission({
      ...commission!,
      totalSongs: updatedSongs.length,
      currentStage: computeCommissionStage(updatedSongs),
      updatedAt: now,
    });
    revalidatePath(`/admin/portal/commissions/${fullCommissionId}`);
    revalidatePath("/admin/portal");
  }

  async function sendAdminMessage(text: string) {
    "use server";
    const clean = text.replace(/<[^>]*>/g, "").trim();
    if (!clean) throw new Error("Message cannot be empty.");
    if (clean.length > 4000) throw new Error("Message must be 4000 characters or fewer.");
    await createMessage(commission!.permanentId, "admin", clean);
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <AdminCommissionTabs
      commission={commission}
      songs={songs}
      initialMessages={initialMessages}
      fullCommissionId={fullCommissionId}
      created={created}
      unreadCount={unreadCount}
      updateCommission={updateCommission}
      addSong={addSong}
      onSend={sendAdminMessage}
    />
  );
}
