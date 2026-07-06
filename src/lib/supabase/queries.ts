import { createServiceClient } from "./server";
import type { DbClient, DbCommission, DbSong, DbMessage } from "./types";
import type {
  Client,
  Commission,
  Song,
  ClientType,
  PackageType,
  ProductionStage,
} from "@/types/commission";
import { CLIENT_TYPE_CODES, PACKAGE_TIER_CODES, STAGE_ORDER } from "@/types/commission";

export const SUPABASE_AVAILABLE = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ── Row mappers ────────────────────────────────────────────────────────────────

function mapClient(row: DbClient): Client {
  return {
    permanentId: row.permanent_id,
    clientName: row.client_name,
    email: row.email,
    createdAt: row.created_at,
  };
}

function mapCommission(row: DbCommission): Commission {
  return {
    permanentId: row.permanent_id,
    fullCommissionId: row.full_commission_id,
    clientName: row.client_name,
    email: row.email,
    clientType: row.client_type as ClientType,
    packageType: row.package_type as PackageType,
    totalSongs: row.total_songs,
    currentStage: row.current_stage as ProductionStage,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    notes: row.notes,
    projectedDelivery: row.projected_delivery ?? undefined,
  };
}

function mapSong(row: DbSong): Song {
  return {
    songId: row.song_id,
    commissionId: row.commission_id,
    title: row.title,
    trackNumber: row.track_number,
    productionStage: row.production_stage as ProductionStage,
    revisionsTotal: row.revisions_total,
    revisionsUsed: row.revisions_used,
    revisionsRemaining: row.revisions_remaining,
    lyricsReady: row.lyrics_ready,
    lyrics: row.lyrics,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ── ID construction ────────────────────────────────────────────────────────────

function pad(n: number, width: number): string {
  return String(n).padStart(width, "0");
}

function buildPermanentId(date: string, seq: number): string {
  const d = new Date(date);
  const mm = pad(d.getUTCMonth() + 1, 2);
  const dd = pad(d.getUTCDate(), 2);
  const yy = String(d.getUTCFullYear()).slice(2);
  return `BNS${mm}${dd}${yy}C${pad(seq, 4)}`;
}

function buildFullCommissionId(
  permanentId: string,
  clientType: ClientType,
  packageType: PackageType,
  firstSongSeq: number
): string {
  const typeCode = CLIENT_TYPE_CODES[clientType];
  const pkgCode = PACKAGE_TIER_CODES[packageType];
  return `${permanentId}-${typeCode}${pkgCode}-${pad(firstSongSeq, 4)}`;
}

// ── Atomic counter ─────────────────────────────────────────────────────────────

async function incrementCounter(name: string, amount = 1): Promise<number> {
  const db = createServiceClient();
  const { data, error } = await db.rpc("increment_counter", {
    counter_name: name,
    amount,
  });
  if (error) throw new Error(`Counter '${name}' increment failed: ${error.message}`);
  return data as number;
}

// ── Client CRUD ────────────────────────────────────────────────────────────────

/**
 * Returns an existing client matched by email, or creates a new one.
 * This is the returning-client detection mechanism.
 */
export async function kvGetOrCreateClient(
  clientName: string,
  email: string,
  date: string
): Promise<{ client: Client; isNew: boolean }> {
  if (!SUPABASE_AVAILABLE) throw new Error("Supabase not configured");
  const db = createServiceClient();

  const { data: existing } = await db
    .from("clients")
    .select("*")
    .eq("email", email.toLowerCase())
    .maybeSingle<DbClient>();

  if (existing) {
    return { client: mapClient(existing), isNew: false };
  }

  const seq = await incrementCounter("client_seq");
  const permanentId = buildPermanentId(date, seq);

  const { data: newRow, error } = await db
    .from("clients")
    .insert({
      permanent_id: permanentId,
      client_name: clientName,
      email: email.toLowerCase(),
      created_at: date,
    })
    .select()
    .single<DbClient>();

  if (error) throw new Error(`Failed to create client: ${error.message}`);

  return { client: mapClient(newRow!), isNew: true };
}

export async function kvGetClient(permanentId: string): Promise<Client | null> {
  if (!SUPABASE_AVAILABLE) return null;
  const db = createServiceClient();
  try {
    const { data, error } = await db
      .from("clients")
      .select("*")
      .eq("permanent_id", permanentId)
      .maybeSingle<DbClient>();
    if (error) throw error;
    return data ? mapClient(data) : null;
  } catch (e) {
    console.error("[supabase:kvGetClient]", e);
    return null;
  }
}

// ── Commission ID allocation ───────────────────────────────────────────────────

export async function kvAllocateCommissionIds(
  permanentId: string,
  clientType: ClientType,
  packageType: PackageType,
  totalSongs: number
): Promise<{ fullCommissionId: string; songIds: string[] }> {
  if (!SUPABASE_AVAILABLE) throw new Error("Supabase not configured");
  const count = Math.max(1, totalSongs);
  const endSeq = await incrementCounter("song_seq", count);
  const startSeq = endSeq - count + 1;
  const fullCommissionId = buildFullCommissionId(permanentId, clientType, packageType, startSeq);
  const songIds = Array.from({ length: count }, (_, i) => pad(startSeq + i, 4));
  return { fullCommissionId, songIds };
}

export async function kvAllocateSongId(): Promise<string> {
  if (!SUPABASE_AVAILABLE) throw new Error("Supabase not configured");
  const seq = await incrementCounter("song_seq");
  return pad(seq, 4);
}

// ── Commission CRUD ────────────────────────────────────────────────────────────

export async function kvCreateCommission(
  commission: Commission,
  songs: Song[]
): Promise<void> {
  if (!SUPABASE_AVAILABLE) throw new Error("Supabase not configured");
  const db = createServiceClient();

  const { error: commError } = await db.from("commissions").insert({
    full_commission_id: commission.fullCommissionId,
    permanent_id: commission.permanentId,
    client_name: commission.clientName,
    email: commission.email,
    client_type: commission.clientType,
    package_type: commission.packageType,
    total_songs: commission.totalSongs,
    current_stage: commission.currentStage,
    notes: commission.notes,
    projected_delivery: commission.projectedDelivery ?? null,
    created_at: commission.createdAt,
    updated_at: commission.updatedAt,
  });
  if (commError) throw new Error(`Failed to create commission: ${commError.message}`);

  const { error: songsError } = await db.from("songs").insert(
    songs.map((song) => ({
      song_id: song.songId,
      commission_id: song.commissionId,
      title: song.title,
      track_number: song.trackNumber,
      production_stage: song.productionStage,
      revisions_total: song.revisionsTotal,
      revisions_used: song.revisionsUsed,
      revisions_remaining: song.revisionsRemaining,
      lyrics_ready: song.lyricsReady,
      lyrics: song.lyrics,
      notes: song.notes,
      created_at: song.createdAt,
      updated_at: song.updatedAt,
    }))
  );
  if (songsError) throw new Error(`Failed to create songs: ${songsError.message}`);
}

export async function kvGetAllCommissions(): Promise<Commission[]> {
  if (!SUPABASE_AVAILABLE) return [];
  const db = createServiceClient();
  try {
    const { data, error } = await db
      .from("commissions")
      .select("*")
      .order("updated_at", { ascending: false });
    if (error) throw error;
    return (data as DbCommission[] ?? []).map(mapCommission);
  } catch (e) {
    console.error("[supabase:kvGetAllCommissions]", e);
    return [];
  }
}

export async function kvGetCommissionsByClient(
  permanentId: string
): Promise<Commission[]> {
  if (!SUPABASE_AVAILABLE) return [];
  const db = createServiceClient();
  try {
    const { data, error } = await db
      .from("commissions")
      .select("*")
      .eq("permanent_id", permanentId)
      .order("created_at", { ascending: true });
    if (error) throw error;
    return (data as DbCommission[] ?? []).map(mapCommission);
  } catch (e) {
    console.error("[supabase:kvGetCommissionsByClient]", e);
    return [];
  }
}

export async function kvGetCommission(
  fullCommissionId: string
): Promise<Commission | null> {
  if (!SUPABASE_AVAILABLE) return null;
  const db = createServiceClient();
  try {
    const { data, error } = await db
      .from("commissions")
      .select("*")
      .eq("full_commission_id", fullCommissionId)
      .maybeSingle<DbCommission>();
    if (error) throw error;
    return data ? mapCommission(data) : null;
  } catch (e) {
    console.error("[supabase:kvGetCommission]", e);
    return null;
  }
}

export async function kvUpdateCommission(commission: Commission): Promise<void> {
  if (!SUPABASE_AVAILABLE) throw new Error("Supabase not configured");
  const db = createServiceClient();
  const { error } = await db
    .from("commissions")
    .update({
      client_name: commission.clientName,
      email: commission.email,
      client_type: commission.clientType,
      package_type: commission.packageType,
      total_songs: commission.totalSongs,
      current_stage: commission.currentStage,
      notes: commission.notes,
      projected_delivery: commission.projectedDelivery ?? null,
      updated_at: commission.updatedAt,
    })
    .eq("full_commission_id", commission.fullCommissionId);
  if (error) throw new Error(`Failed to update commission: ${error.message}`);
}

// ── Song CRUD ──────────────────────────────────────────────────────────────────

export async function kvGetSongs(fullCommissionId: string): Promise<Song[]> {
  if (!SUPABASE_AVAILABLE) return [];
  const db = createServiceClient();
  try {
    const { data, error } = await db
      .from("songs")
      .select("*")
      .eq("commission_id", fullCommissionId)
      .order("track_number", { ascending: true });
    if (error) throw error;
    return (data as DbSong[] ?? []).map(mapSong);
  } catch (e) {
    console.error("[supabase:kvGetSongs]", e);
    return [];
  }
}

export async function kvGetSong(
  fullCommissionId: string,
  songId: string
): Promise<Song | null> {
  if (!SUPABASE_AVAILABLE) return null;
  const db = createServiceClient();
  try {
    const { data, error } = await db
      .from("songs")
      .select("*")
      .eq("commission_id", fullCommissionId)
      .eq("song_id", songId)
      .maybeSingle<DbSong>();
    if (error) throw error;
    return data ? mapSong(data) : null;
  } catch (e) {
    console.error("[supabase:kvGetSong]", e);
    return null;
  }
}

export async function kvUpdateSong(song: Song): Promise<void> {
  if (!SUPABASE_AVAILABLE) throw new Error("Supabase not configured");
  const db = createServiceClient();
  const { error } = await db
    .from("songs")
    .update({
      title: song.title,
      track_number: song.trackNumber,
      production_stage: song.productionStage,
      revisions_total: song.revisionsTotal,
      revisions_used: song.revisionsUsed,
      revisions_remaining: song.revisionsRemaining,
      lyrics_ready: song.lyricsReady,
      lyrics: song.lyrics,
      notes: song.notes,
      updated_at: song.updatedAt,
    })
    .eq("commission_id", song.commissionId)
    .eq("song_id", song.songId);
  if (error) throw new Error(`Failed to update song: ${error.message}`);
}

export async function kvAddSong(song: Song): Promise<void> {
  if (!SUPABASE_AVAILABLE) throw new Error("Supabase not configured");
  const db = createServiceClient();
  const { error } = await db.from("songs").insert({
    song_id: song.songId,
    commission_id: song.commissionId,
    title: song.title,
    track_number: song.trackNumber,
    production_stage: song.productionStage,
    revisions_total: song.revisionsTotal,
    revisions_used: song.revisionsUsed,
    revisions_remaining: song.revisionsRemaining,
    lyrics_ready: song.lyricsReady,
    lyrics: song.lyrics,
    notes: song.notes,
    created_at: song.createdAt,
    updated_at: song.updatedAt,
  });
  if (error) throw new Error(`Failed to add song: ${error.message}`);
}

// ── Stage helpers ──────────────────────────────────────────────────────────────

export function computeCommissionStage(songs: Song[]): ProductionStage {
  if (songs.length === 0) return "intake";
  if (songs.every((s) => s.productionStage === "delivered")) return "delivered";
  const indices = songs.map((s) => STAGE_ORDER.indexOf(s.productionStage));
  return STAGE_ORDER[Math.min(...indices)];
}

// ── Message CRUD (Phase 3) ─────────────────────────────────────────────────────

export interface Message {
  id: string;
  permanentId: string;
  sender: "client" | "admin";
  body: string;
  isRead: boolean;
  createdAt: string;
}

function mapMessage(row: DbMessage): Message {
  return {
    id: row.id,
    permanentId: row.permanent_id,
    sender: row.sender,
    body: row.body,
    isRead: row.is_read,
    createdAt: row.created_at,
  };
}

export async function getMessages(permanentId: string): Promise<Message[]> {
  if (!SUPABASE_AVAILABLE) return [];
  const db = createServiceClient();
  try {
    const { data, error } = await db
      .from("messages")
      .select("*")
      .eq("permanent_id", permanentId)
      .order("created_at", { ascending: true });
    if (error) throw error;
    return (data as DbMessage[] ?? []).map(mapMessage);
  } catch (e) {
    console.error("[supabase:getMessages]", e);
    return [];
  }
}

export async function createMessage(
  permanentId: string,
  sender: "client" | "admin",
  body: string
): Promise<Message> {
  if (!SUPABASE_AVAILABLE) throw new Error("Supabase not configured");
  const db = createServiceClient();
  const { data, error } = await db
    .from("messages")
    .insert({ permanent_id: permanentId, sender, body })
    .select()
    .single<DbMessage>();
  if (error) throw new Error(`Failed to create message: ${error.message}`);
  return mapMessage(data!);
}

export async function markMessagesRead(
  permanentId: string,
  readBySender: "client" | "admin"
): Promise<void> {
  if (!SUPABASE_AVAILABLE) return;
  const db = createServiceClient();
  // Mark all messages sent by the OTHER party as read (i.e., when admin reads, mark client messages as read)
  const otherSender = readBySender === "admin" ? "client" : "admin";
  await db
    .from("messages")
    .update({ is_read: true })
    .eq("permanent_id", permanentId)
    .eq("sender", otherSender)
    .eq("is_read", false);
}

export async function getUnreadClientMessageCount(): Promise<number> {
  if (!SUPABASE_AVAILABLE) return 0;
  const db = createServiceClient();
  try {
    const { count, error } = await db
      .from("messages")
      .select("*", { count: "exact", head: true })
      .eq("sender", "client")
      .eq("is_read", false);
    if (error) throw error;
    return count ?? 0;
  } catch (e) {
    console.error("[supabase:getUnreadClientMessageCount]", e);
    return 0;
  }
}
