import { Redis } from "@upstash/redis";
import type { Commission, Song, ClientType, PackageType } from "@/types/commission";
import { CLIENT_TYPE_CODES, PACKAGE_TIER_CODES } from "@/types/commission";

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
  songSeq: "bns:song:seq",
  index: "bns:commissions",
  commission: (id: string) => `commission:${id}`,
  songs: (id: string) => `commission:${id}:songs`,
  song: (clientId: string, songId: string) =>
    `commission:${clientId}:song:${songId}`,
} as const;

// ── ID generation ──────────────────────────────────────────────────────────────

/**
 * Generates a client ID in the format BNS{MMDDYY}{T}{PP}
 * e.g. BNS011526101 = 01/15/26, Individual (1), Single (01)
 * If the base ID already exists (same date + type + package), appends B/C/D...
 */
export async function generateClientId(
  intakeDate: string,
  clientType: ClientType,
  packageType: PackageType
): Promise<string> {
  if (!redis) throw new Error("Redis not available");
  const d = new Date(intakeDate);
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const yy = String(d.getUTCFullYear()).slice(2);
  const base = `BNS${mm}${dd}${yy}${CLIENT_TYPE_CODES[clientType]}${PACKAGE_TIER_CODES[packageType]}`;

  const exists = await redis.get(KEY.commission(base));
  if (!exists) return base;

  for (const suffix of ["B", "C", "D", "E", "F", "G", "H"]) {
    const candidate = `${base}${suffix}`;
    const taken = await redis.get(KEY.commission(candidate));
    if (!taken) return candidate;
  }

  // Extremely unlikely — fall back to base + timestamp suffix
  return `${base}-${Date.now().toString(36).slice(-3).toUpperCase()}`;
}

/**
 * Allocates `count` consecutive global song IDs and returns them as
 * formatted strings: {clientId}-{GGGG}
 */
export async function generateSongIds(
  clientId: string,
  count: number
): Promise<string[]> {
  if (!redis) throw new Error("Redis not available");
  if (count <= 0) return [];
  const endSeq = await redis.incrby(KEY.songSeq, count);
  const startSeq = endSeq - count + 1;
  return Array.from({ length: count }, (_, i) =>
    `${clientId}-${String(startSeq + i).padStart(4, "0")}`
  );
}

/**
 * Allocates a single global song ID: {clientId}-{GGGG}
 */
export async function generateSongId(clientId: string): Promise<string> {
  if (!redis) throw new Error("Redis not available");
  const seq = await redis.incr(KEY.songSeq);
  return `${clientId}-${String(seq).padStart(4, "0")}`;
}

// ── Commission CRUD ────────────────────────────────────────────────────────────

export async function kvCreateCommission(
  commission: Commission,
  songs: Song[]
): Promise<void> {
  if (!redis) throw new Error("Redis not available");
  const pipeline = redis.pipeline();
  pipeline.set(KEY.commission(commission.clientId), JSON.stringify(commission));
  const songIds = songs.map((s) => s.songId);
  pipeline.del(KEY.songs(commission.clientId));
  if (songIds.length > 0) {
    pipeline.rpush(KEY.songs(commission.clientId), ...songIds);
  }
  for (const song of songs) {
    pipeline.set(
      KEY.song(commission.clientId, song.songId),
      JSON.stringify(song)
    );
  }
  pipeline.lpush(KEY.index, commission.clientId);
  await pipeline.exec();
}

export async function kvGetAllCommissions(): Promise<Commission[]> {
  if (!redis) return [];
  try {
    const ids = await redis.lrange<string>(KEY.index, 0, -1);
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

export async function kvGetCommission(
  clientId: string
): Promise<Commission | null> {
  if (!redis) return null;
  try {
    return await redis.get<Commission>(KEY.commission(clientId));
  } catch (e) {
    console.error("[kv:commissions:get]", e);
    return null;
  }
}

export async function kvUpdateCommission(
  commission: Commission
): Promise<void> {
  if (!redis) throw new Error("Redis not available");
  await redis.set(
    KEY.commission(commission.clientId),
    JSON.stringify(commission)
  );
}

// ── Song CRUD ──────────────────────────────────────────────────────────────────

export async function kvGetSongs(clientId: string): Promise<Song[]> {
  if (!redis) return [];
  try {
    const songIds = await redis.lrange<string>(KEY.songs(clientId), 0, -1);
    if (!songIds || songIds.length === 0) return [];
    const songs = await Promise.all(
      songIds.map((sid) => redis!.get<Song>(KEY.song(clientId, sid)))
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
  clientId: string,
  songId: string
): Promise<Song | null> {
  if (!redis) return null;
  try {
    return await redis.get<Song>(KEY.song(clientId, songId));
  } catch (e) {
    console.error("[kv:song:get]", e);
    return null;
  }
}

export async function kvUpdateSong(song: Song): Promise<void> {
  if (!redis) throw new Error("Redis not available");
  await redis.set(KEY.song(song.clientId, song.songId), JSON.stringify(song));
}

export async function kvAddSong(song: Song): Promise<void> {
  if (!redis) throw new Error("Redis not available");
  await redis.set(KEY.song(song.clientId, song.songId), JSON.stringify(song));
  await redis.rpush(KEY.songs(song.clientId), song.songId);
}

export { KV_AVAILABLE };
