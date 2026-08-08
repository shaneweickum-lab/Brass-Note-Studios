import { createServiceClient } from "./server";
import type { DbClient, DbCommission, DbSong, DbMessage, DbLabsExperiment, DbExpense } from "./types";
import type {
  Client,
  Commission,
  Song,
  ClientType,
  PackageType,
  ProductionStage,
} from "@/types/commission";
import type { LabsExperiment, Expense, ResultCode, Recurrence, DashboardFinancials } from "@/types/studio";
import type { LabsOutcomeSlice } from "@/components/analytics/LabsOutcomeChart";
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
    phone: row.phone ?? undefined,
    songPurpose: row.song_purpose ?? undefined,
    songRecipients: row.song_recipients ?? undefined,
    songStory: row.song_story ?? undefined,
    stylePreferences: row.style_preferences ?? undefined,
    referenceSongs: row.reference_songs ?? undefined,
    totalPayment: row.total_payment ?? undefined,
    datePurchased: row.date_purchased ?? undefined,
    dateCompleted: row.date_completed ?? undefined,
    songwriterBuyout: row.songwriter_buyout ?? undefined,
    royaltySplit: row.royalty_split ?? undefined,
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
    style: row.style ?? undefined,
    genreCode: row.genre_code ?? undefined,
    lyricCode: row.lyric_code ?? undefined,
    vocalCode: row.vocal_code ?? undefined,
    songDisplayId: row.song_display_id ?? undefined,
    genre: row.genre ?? undefined,
    subGenre: row.sub_genre ?? undefined,
    vocalType: row.vocal_type ?? undefined,
    bpm: row.bpm ?? undefined,
    timeSig: row.time_sig ?? undefined,
    mood: row.mood ?? undefined,
    tensionArc: row.tension_arc ?? undefined,
    aboutTheSong: row.about_the_song ?? undefined,
    instruments: row.instruments ?? undefined,
    sunoVersion: row.suno_version ?? undefined,
    genNumber: row.gen_number ?? undefined,
  };
}

function mapLabsExperiment(row: DbLabsExperiment): LabsExperiment {
  return {
    bnlId: row.bnl_id,
    studioId: row.studio_id,
    experimentId: row.experiment_id ?? undefined,
    experimentName: row.experiment_name ?? undefined,
    labsGlobalNumber: row.labs_global_number ?? undefined,
    displayNumber: row.display_number ?? undefined,
    sunoVersion: row.suno_version ?? undefined,
    weirdnessPct: row.weirdness_pct ?? undefined,
    constraintPct: row.constraint_pct ?? undefined,
    stylePrompt: row.style_prompt ?? undefined,
    lyricPrompt: row.lyric_prompt ?? undefined,
    tier2SymbolsUsed: row.tier2_symbols_used ?? undefined,
    tier3Applied: row.tier3_applied,
    hypothesis: row.hypothesis ?? undefined,
    expectedResult: row.expected_result ?? undefined,
    actualResult: row.actual_result ?? undefined,
    resultCode: (row.result_code as ResultCode) ?? undefined,
    keyFinding: row.key_finding ?? undefined,
    integrationStatus: row.integration_status ?? undefined,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapExpense(row: DbExpense): Expense {
  return {
    id: row.id,
    studioId: row.studio_id,
    expenseName: row.expense_name,
    recurrence: row.recurrence as Recurrence,
    nextDueDate: row.next_due_date ?? undefined,
    monthlyCost: row.monthly_cost ?? undefined,
    annualCost: row.annual_cost ?? undefined,
    category: row.category ?? undefined,
    autoRenew: row.auto_renew,
    active: row.active,
    notes: row.notes ?? undefined,
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
    phone: commission.phone ?? null,
    song_purpose: commission.songPurpose ?? null,
    song_recipients: commission.songRecipients ?? null,
    song_story: commission.songStory ?? null,
    style_preferences: commission.stylePreferences ?? null,
    reference_songs: commission.referenceSongs ?? null,
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
      phone: commission.phone ?? null,
      song_purpose: commission.songPurpose ?? null,
      song_recipients: commission.songRecipients ?? null,
      song_story: commission.songStory ?? null,
      style_preferences: commission.stylePreferences ?? null,
      reference_songs: commission.referenceSongs ?? null,
      total_payment: commission.totalPayment ?? null,
      date_purchased: commission.datePurchased ?? null,
      date_completed: commission.dateCompleted ?? null,
      songwriter_buyout: commission.songwriterBuyout ?? false,
      royalty_split: commission.royaltySplit ?? "80/20",
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
      style: song.style ?? null,
      genre_code: song.genreCode ?? null,
      lyric_code: song.lyricCode ?? null,
      vocal_code: song.vocalCode ?? null,
      song_display_id: song.songDisplayId ?? null,
      genre: song.genre ?? null,
      sub_genre: song.subGenre ?? null,
      vocal_type: song.vocalType ?? null,
      bpm: song.bpm ?? null,
      time_sig: song.timeSig ?? null,
      mood: song.mood ?? null,
      tension_arc: song.tensionArc ?? null,
      about_the_song: song.aboutTheSong ?? null,
      instruments: song.instruments ?? null,
      suno_version: song.sunoVersion ?? null,
      gen_number: song.genNumber ?? null,
    })
    .eq("commission_id", song.commissionId)
    .eq("song_id", song.songId);
  if (error) throw new Error(`Failed to update song: ${error.message}`);
}

export async function kvDeleteCommission(fullCommissionId: string): Promise<void> {
  if (!SUPABASE_AVAILABLE) throw new Error("Supabase not configured");
  const db = createServiceClient();
  // Remove songs first to satisfy any FK constraint
  await db.from("songs").delete().eq("commission_id", fullCommissionId);
  const { error } = await db.from("commissions").delete().eq("full_commission_id", fullCommissionId);
  if (error) throw new Error(`Failed to delete commission: ${error.message}`);
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

// Returns a map of permanentId → unread client message count for all clients with unread messages
export async function getUnreadCountsByClient(): Promise<Record<string, number>> {
  if (!SUPABASE_AVAILABLE) return {};
  const db = createServiceClient();
  try {
    const { data, error } = await db
      .from("messages")
      .select("permanent_id")
      .eq("sender", "client")
      .eq("is_read", false);
    if (error) throw error;
    const counts: Record<string, number> = {};
    for (const row of data ?? []) {
      counts[row.permanent_id] = (counts[row.permanent_id] ?? 0) + 1;
    }
    return counts;
  } catch (e) {
    console.error("[supabase:getUnreadCountsByClient]", e);
    return {};
  }
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

// ── Labs Experiments CRUD ──────────────────────────────────────────────────────

function buildBnlId(experimentId: string, globalNumber: number, date: string): string {
  const d = new Date(date);
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const yy = String(d.getUTCFullYear()).slice(2);
  return `BNL-${mm}${dd}${yy}-${experimentId}-${String(globalNumber).padStart(3, "0")}`;
}

export async function kvAllocateLabsId(
  experimentId: string,
  date: string
): Promise<{ bnlId: string; globalNumber: number }> {
  if (!SUPABASE_AVAILABLE) throw new Error("Supabase not configured");
  const globalNumber = await incrementCounter("labs_seq");
  return { bnlId: buildBnlId(experimentId, globalNumber, date), globalNumber };
}

export async function kvGetAllLabsExperiments(): Promise<LabsExperiment[]> {
  if (!SUPABASE_AVAILABLE) return [];
  const db = createServiceClient();
  try {
    const { data, error } = await db
      .from("labs_experiments")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data as DbLabsExperiment[] ?? []).map(mapLabsExperiment);
  } catch (e) {
    console.error("[supabase:kvGetAllLabsExperiments]", e);
    return [];
  }
}

export async function kvGetLabsExperiment(bnlId: string): Promise<LabsExperiment | null> {
  if (!SUPABASE_AVAILABLE) return null;
  const db = createServiceClient();
  try {
    const { data, error } = await db
      .from("labs_experiments")
      .select("*")
      .eq("bnl_id", bnlId)
      .maybeSingle<DbLabsExperiment>();
    if (error) throw error;
    return data ? mapLabsExperiment(data) : null;
  } catch (e) {
    console.error("[supabase:kvGetLabsExperiment]", e);
    return null;
  }
}

export async function kvCreateLabsExperiment(exp: LabsExperiment): Promise<void> {
  if (!SUPABASE_AVAILABLE) throw new Error("Supabase not configured");
  const db = createServiceClient();
  const { error } = await db.from("labs_experiments").insert({
    bnl_id: exp.bnlId,
    studio_id: exp.studioId,
    experiment_id: exp.experimentId ?? null,
    experiment_name: exp.experimentName ?? null,
    labs_global_number: exp.labsGlobalNumber ?? null,
    display_number: exp.displayNumber ?? null,
    suno_version: exp.sunoVersion ?? null,
    weirdness_pct: exp.weirdnessPct ?? null,
    constraint_pct: exp.constraintPct ?? null,
    style_prompt: exp.stylePrompt ?? null,
    lyric_prompt: exp.lyricPrompt ?? null,
    tier2_symbols_used: exp.tier2SymbolsUsed ?? null,
    tier3_applied: exp.tier3Applied,
    hypothesis: exp.hypothesis ?? null,
    expected_result: exp.expectedResult ?? null,
    actual_result: exp.actualResult ?? null,
    result_code: exp.resultCode ?? null,
    key_finding: exp.keyFinding ?? null,
    integration_status: exp.integrationStatus ?? null,
    notes: exp.notes ?? null,
    created_at: exp.createdAt,
    updated_at: exp.updatedAt,
  });
  if (error) throw new Error(`Failed to create labs experiment: ${error.message}`);
}

export async function kvUpdateLabsExperiment(exp: LabsExperiment): Promise<void> {
  if (!SUPABASE_AVAILABLE) throw new Error("Supabase not configured");
  const db = createServiceClient();
  const { error } = await db
    .from("labs_experiments")
    .update({
      experiment_id: exp.experimentId ?? null,
      experiment_name: exp.experimentName ?? null,
      suno_version: exp.sunoVersion ?? null,
      weirdness_pct: exp.weirdnessPct ?? null,
      constraint_pct: exp.constraintPct ?? null,
      style_prompt: exp.stylePrompt ?? null,
      lyric_prompt: exp.lyricPrompt ?? null,
      tier2_symbols_used: exp.tier2SymbolsUsed ?? null,
      tier3_applied: exp.tier3Applied,
      hypothesis: exp.hypothesis ?? null,
      expected_result: exp.expectedResult ?? null,
      actual_result: exp.actualResult ?? null,
      result_code: exp.resultCode ?? null,
      key_finding: exp.keyFinding ?? null,
      integration_status: exp.integrationStatus ?? null,
      notes: exp.notes ?? null,
      updated_at: exp.updatedAt,
    })
    .eq("bnl_id", exp.bnlId);
  if (error) throw new Error(`Failed to update labs experiment: ${error.message}`);
}

export async function kvDeleteLabsExperiment(bnlId: string): Promise<void> {
  if (!SUPABASE_AVAILABLE) throw new Error("Supabase not configured");
  const db = createServiceClient();
  const { error } = await db.from("labs_experiments").delete().eq("bnl_id", bnlId);
  if (error) throw new Error(`Failed to delete labs experiment: ${error.message}`);
}

// ── Expenses CRUD ──────────────────────────────────────────────────────────────

export async function kvGetAllExpenses(): Promise<Expense[]> {
  if (!SUPABASE_AVAILABLE) return [];
  const db = createServiceClient();
  try {
    const { data, error } = await db
      .from("expenses")
      .select("*")
      .order("expense_name", { ascending: true });
    if (error) throw error;
    return (data as DbExpense[] ?? []).map(mapExpense);
  } catch (e) {
    console.error("[supabase:kvGetAllExpenses]", e);
    return [];
  }
}

export async function kvCreateExpense(
  exp: Omit<Expense, "id" | "createdAt" | "updatedAt">
): Promise<Expense> {
  if (!SUPABASE_AVAILABLE) throw new Error("Supabase not configured");
  const db = createServiceClient();
  const { data, error } = await db
    .from("expenses")
    .insert({
      studio_id: exp.studioId,
      expense_name: exp.expenseName,
      recurrence: exp.recurrence,
      next_due_date: exp.nextDueDate ?? null,
      monthly_cost: exp.monthlyCost ?? null,
      annual_cost: exp.annualCost ?? null,
      category: exp.category ?? null,
      auto_renew: exp.autoRenew,
      active: exp.active,
      notes: exp.notes ?? null,
    })
    .select()
    .single<DbExpense>();
  if (error) throw new Error(`Failed to create expense: ${error.message}`);
  return mapExpense(data!);
}

export async function kvUpdateExpense(exp: Expense): Promise<void> {
  if (!SUPABASE_AVAILABLE) throw new Error("Supabase not configured");
  const db = createServiceClient();
  const { error } = await db
    .from("expenses")
    .update({
      expense_name: exp.expenseName,
      recurrence: exp.recurrence,
      next_due_date: exp.nextDueDate ?? null,
      monthly_cost: exp.monthlyCost ?? null,
      annual_cost: exp.annualCost ?? null,
      category: exp.category ?? null,
      auto_renew: exp.autoRenew,
      active: exp.active,
      notes: exp.notes ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", exp.id);
  if (error) throw new Error(`Failed to update expense: ${error.message}`);
}

export async function kvDeleteExpense(id: string): Promise<void> {
  if (!SUPABASE_AVAILABLE) throw new Error("Supabase not configured");
  const db = createServiceClient();
  const { error } = await db.from("expenses").delete().eq("id", id);
  if (error) throw new Error(`Failed to delete expense: ${error.message}`);
}

// ── Dashboard financials ───────────────────────────────────────────────────────

export async function kvGetDashboardFinancials(): Promise<DashboardFinancials> {
  if (!SUPABASE_AVAILABLE) {
    return { totalRevenue: 0, revenueThisMonth: 0, totalMonthlyExpenses: 0, netThisMonth: 0, totalLabsExperiments: 0, labsPassRate: 0 };
  }
  const db = createServiceClient();
  try {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);

    const [commissionsRes, expensesRes, labsRes] = await Promise.all([
      db.from("commissions").select("total_payment, date_purchased"),
      db.from("expenses").select("monthly_cost").eq("active", true),
      db.from("labs_experiments").select("result_code"),
    ]);

    const commissions = (commissionsRes.data ?? []) as { total_payment: number | null; date_purchased: string | null }[];
    const totalRevenue = commissions.reduce((sum, c) => sum + (c.total_payment ?? 0), 0);
    const revenueThisMonth = commissions
      .filter((c) => c.date_purchased && c.date_purchased >= monthStart)
      .reduce((sum, c) => sum + (c.total_payment ?? 0), 0);

    const expenses = (expensesRes.data ?? []) as { monthly_cost: number | null }[];
    const totalMonthlyExpenses = expenses.reduce((sum, e) => sum + (e.monthly_cost ?? 0), 0);

    const labs = (labsRes.data ?? []) as { result_code: string | null }[];
    const totalLabsExperiments = labs.length;
    const passed = labs.filter((l) => l.result_code === "PASS").length;
    const labsPassRate = totalLabsExperiments > 0 ? Math.round((passed / totalLabsExperiments) * 100) : 0;

    return {
      totalRevenue,
      revenueThisMonth,
      totalMonthlyExpenses,
      netThisMonth: revenueThisMonth - totalMonthlyExpenses,
      totalLabsExperiments,
      labsPassRate,
    };
  } catch (e) {
    console.error("[supabase:kvGetDashboardFinancials]", e);
    return { totalRevenue: 0, revenueThisMonth: 0, totalMonthlyExpenses: 0, netThisMonth: 0, totalLabsExperiments: 0, labsPassRate: 0 };
  }
}

export async function kvGetLabsResultBreakdown(): Promise<LabsOutcomeSlice[]> {
  const db = createServiceClient();
  const { data, error } = await db
    .from("labs_experiments")
    .select("result_code")
    .eq("studio_id", "bns")
    .not("result_code", "is", null);

  if (error || !data) return [];

  const counts: Partial<Record<ResultCode, number>> = {};
  for (const row of data) {
    const code = row.result_code as ResultCode;
    counts[code] = (counts[code] ?? 0) + 1;
  }

  const ORDER: ResultCode[] = ["PASS", "FAIL", "PARTIAL", "ANOMALY"];
  return ORDER.filter((c) => counts[c]).map((code) => ({ code, count: counts[code]! }));
}

export interface SongPurchaseRow {
  id: string;
  stripe_session_id: string;
  song_id: string;
  customer_email: string | null;
  amount_total: number;
  currency: string;
  download_file_key: string | null;
  created_at: string;
}

export async function getSongPurchases(): Promise<SongPurchaseRow[]> {
  const db = createServiceClient();
  const { data, error } = await db
    .from("song_purchases")
    .select("id, stripe_session_id, song_id, customer_email, amount_total, currency, download_file_key, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[supabase:getSongPurchases]", error);
    return [];
  }
  return (data ?? []) as SongPurchaseRow[];
}
}
