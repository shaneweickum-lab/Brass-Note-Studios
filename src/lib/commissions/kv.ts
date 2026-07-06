import { Redis } from "@upstash/redis";
import type { Client, Commission, Song, ClientType, PackageType, ProductionStage } from "@/types/commission";
import { CLIENT_TYPE_CODES, PACKAGE_TIER_CODES, STAGE_ORDER } from "@/types/commission";

const KV_AVAILABLE = Boolean(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
);

const redis = KV_AVAILABLE
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null;

// ── Key helpers ────────────────────────────────────────────────────────────────

const KEY = {
  clientCounter:     "counter:clients",
  songCounter:       "counter:songs",
  clientIndex:       "index:clients",
  commissionIndex:   "index:commissions",
  emailToClient:     (email: string) => `index:email:${email.toLowerCase()}`,
  client:            (permanentId: string) => `client:${permanentId}`,
  clientCommissions: (permanentId: string) => `client:${permanentId}:commissions`,
  commission:        (fullId: string) => `commission:${fullId}`,
  commissionSongs:   (fullId: string) => `commission:${fullId}:songs`,
  song:              (fullId: string, songId: string) => `commission:${fullId}:song:${songId}`,
} as const;

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

// BNS011526C0001-101-0001
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
  if (!redis) throw new Error("Redis not available");

  const existingId = await redis.get<string>(KEY.emailToClient(email));
  if (existingId) {
    const client = await redis.get<Client>(KEY.client(existingId));
    if (client) return { client, isNew: false };
  }

  const seq = await redis.incr(KEY.clientCounter);
  const permanentId = buildPermanentId(date, seq);
  const newClient: Client = { permanentId, clientName, email, createdAt: date };

  const pipeline = redis.pipeline();
  pipeline.set(KEY.client(permanentId), JSON.stringify(newClient));
  pipeline.set(KEY.emailToClient(email), permanentId);
  pipeline.lpush(KEY.clientIndex, permanentId);
  await pipeline.exec();

  return { client: newClient, isNew: true };
}

export async function kvGetClient(permanentId: string): Promise<Client | null> {
  if (!redis) return null;
  try {
    return await redis.get<Client>(KEY.client(permanentId));
  } catch (e) {
    console.error("[kv:client:get]", e);
    return null;
  }
}

// ── Commission ID allocation ───────────────────────────────────────────────────

/**
 * Allocates `totalSongs` consecutive global song IDs and derives the
 * fullCommissionId (anchored to the first song's global seq).
 * Returns both the fullCommissionId and the array of song IDs.
 */
export async function kvAllocateCommissionIds(
  permanentId: string,
  clientType: ClientType,
  packageType: PackageType,
  totalSongs: number
): Promise<{ fullCommissionId: string; songIds: string[] }> {
  if (!redis) throw new Error("Redis not available");
  const count = Math.max(1, totalSongs);
  const endSeq = await redis.incrby(KEY.songCounter, count);
  const startSeq = endSeq - count + 1;
  const fullCommissionId = buildFullCommissionId(permanentId, clientType, packageType, startSeq);
  const songIds = Array.from({ length: count }, (_, i) => pad(startSeq + i, 4));
  return { fullCommissionId, songIds };
}

/**
 * Allocates a single global song ID — used when adding a song to
 * an existing commission. Returns the 4-digit padded song ID.
 */
export async function kvAllocateSongId(): Promise<string> {
  if (!redis) throw new Error("Redis not available");
  const seq = await redis.incr(KEY.songCounter);
  return pad(seq, 4);
}

// ── Commission CRUD ────────────────────────────────────────────────────────────

export async function kvCreateCommission(
  commission: Commission,
  songs: Song[]
): Promise<void> {
  if (!redis) throw new Error("Redis not available");
  const fullId = commission.fullCommissionId;
  const pipeline = redis.pipeline();
  pipeline.set(KEY.commission(fullId), JSON.stringify(commission));
  const songIds = songs.map((s) => s.songId);
  pipeline.del(KEY.commissionSongs(fullId));
  if (songIds.length > 0) {
    pipeline.rpush(KEY.commissionSongs(fullId), ...songIds);
  }
  for (const song of songs) {
    pipeline.set(KEY.song(fullId, song.songId), JSON.stringify(song));
  }
  pipeline.lpush(KEY.clientCommissions(commission.permanentId), fullId);
  pipeline.lpush(KEY.commissionIndex, fullId);
  await pipeline.exec();
}

export async function kvGetAllCommissions(): Promise<Commission[]> {
  if (!redis) return [];
  try {
    const ids = await redis.lrange<string>(KEY.commissionIndex, 0, -1);
    if (!ids || ids.length === 0) return [];
    const records = await Promise.all(
      ids.map((id) => redis!.get<Commission>(KEY.commission(id)))
    );
    return records.filter((r): r is Commission => r !== null);
  } catch (e) {
    console.error("[kv:commissions:getAll]", e);
    return [];
  }
}

export async function kvGetCommissionsByClient(
  permanentId: string
): Promise<Commission[]> {
  if (!redis) return [];
  try {
    const ids = await redis.lrange<string>(KEY.clientCommissions(permanentId), 0, -1);
    if (!ids || ids.length === 0) return [];
    const records = await Promise.all(
      ids.map((id) => redis!.get<Commission>(KEY.commission(id)))
    );
    return records.filter((r): r is Commission => r !== null);
  } catch (e) {
    console.error("[kv:commissions:getByClient]", e);
    return [];
  }
}

export async function kvGetCommission(
  fullCommissionId: string
): Promise<Commission | null> {
  if (!redis) return null;
  try {
    return await redis.get<Commission>(KEY.commission(fullCommissionId));
  } catch (e) {
    console.error("[kv:commissions:get]", e);
    return null;
  }
}

export async function kvUpdateCommission(commission: Commission): Promise<void> {
  if (!redis) throw new Error("Redis not available");
  await redis.set(
    KEY.commission(commission.fullCommissionId),
    JSON.stringify(commission)
  );
}

// ── Song CRUD ──────────────────────────────────────────────────────────────────

export async function kvGetSongs(fullCommissionId: string): Promise<Song[]> {
  if (!redis) return [];
  try {
    const songIds = await redis.lrange<string>(KEY.commissionSongs(fullCommissionId), 0, -1);
    if (!songIds || songIds.length === 0) return [];
    const songs = await Promise.all(
      songIds.map((sid) => redis!.get<Song>(KEY.song(fullCommissionId, sid)))
    );
    return songs
      .filter((s): s is Song => s !== null)
      .sort((a, b) => a.trackNumber - b.trackNumber);
  } catch (e) {
    console.error("[kv:songs:get]", e);
    return [];
  }
}

export async function kvGetSong(
  fullCommissionId: string,
  songId: string
): Promise<Song | null> {
  if (!redis) return null;
  try {
    return await redis.get<Song>(KEY.song(fullCommissionId, songId));
  } catch (e) {
    console.error("[kv:song:get]", e);
    return null;
  }
}

export async function kvUpdateSong(song: Song): Promise<void> {
  if (!redis) throw new Error("Redis not available");
  await redis.set(KEY.song(song.commissionId, song.songId), JSON.stringify(song));
}

export async function kvAddSong(song: Song): Promise<void> {
  if (!redis) throw new Error("Redis not available");
  await redis.set(KEY.song(song.commissionId, song.songId), JSON.stringify(song));
  await redis.rpush(KEY.commissionSongs(song.commissionId), song.songId);
}

// ── Stage helpers ──────────────────────────────────────────────────────────────

/**
 * Computes the overall commission stage from the current state of all its songs.
 * Returns the earliest incomplete stage, or "delivered" if all songs are delivered.
 */
export function computeCommissionStage(songs: Song[]): ProductionStage {
  if (songs.length === 0) return "intake";
  if (songs.every((s) => s.productionStage === "delivered")) return "delivered";
  const indices = songs.map((s) => STAGE_ORDER.indexOf(s.productionStage));
  return STAGE_ORDER[Math.min(...indices)];
}

export { KV_AVAILABLE };
