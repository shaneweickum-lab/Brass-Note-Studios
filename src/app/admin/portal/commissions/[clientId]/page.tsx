export const dynamic = "force-dynamic";

import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  kvGetCommission,
  kvGetSongs,
  kvUpdateCommission,
  kvDeleteCommission,
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
      phone: ((formData.get("phone") as string) || "").trim() || undefined,
      songPurpose: ((formData.get("songPurpose") as string) || "").trim() || undefined,
      songRecipients: ((formData.get("songRecipients") as string) || "").trim() || undefined,
      songStory: ((formData.get("songStory") as string) || "").trim() || undefined,
      stylePreferences: ((formData.get("stylePreferences") as string) || "").trim() || undefined,
      referenceSongs: ((formData.get("referenceSongs") as string) || "").trim() || undefined,
      totalPayment: parseFloat((formData.get("totalPayment") as string) || "") || undefined,
      datePurchased: ((formData.get("datePurchased") as string) || "").trim() || undefined,
      dateCompleted: ((formData.get("dateCompleted") as string) || "").trim() || undefined,
      songwriterBuyout: formData.get("songwriterBuyout") === "on",
      royaltySplit: ((formData.get("royaltySplit") as string) || "80/20").trim(),
    };
    await kvUpdateCommission(updated);
    revalidatePath(`/admin/portal/commissions/${fullCommissionId}`);
    revalidatePath("/admin/portal");
    revalidatePath("/admin/portal/commissions");
  }

  async function deleteCommission() {
    "use server";
    await kvDeleteCommission(fullCommissionId);
    revalidatePath("/admin/portal/commissions");
    revalidatePath("/admin/portal");
    redirect("/admin/portal/commissions");
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
    const msg = await createMessage(commission!.permanentId, "admin", clean);
    return { id: msg.id, sender: msg.sender as "admin", body: msg.body, createdAt: msg.createdAt };
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
      deleteCommission={deleteCommission}
      addSong={addSong}
      onSend={sendAdminMessage}
    />
  );
}
