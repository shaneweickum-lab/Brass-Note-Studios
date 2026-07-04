import { Redis } from "@upstash/redis";

const KV_AVAILABLE = Boolean(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
);

const redis = KV_AVAILABLE
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null;

const KEYS = {
  pageviews: "bns:pageviews",
  conversations: "bns:conversations",
  fallbacks: "bns:fallbacks",
} as const;

const MAX_LIST = 5000;

export interface KVPageView {
  ts: string;
  path: string;
  sessionId: string;
  referrer?: string;
}

export interface KVConversation {
  ts: string;
  sessionId: string;
  userMsg: string;
  botResponse: string;
  isFallback: boolean;
  pageContext: string;
  matchedPattern?: string;
}

export interface KVFallback {
  ts: string;
  sessionId: string;
  userMsg: string;
  pageContext: string;
}

export async function kvTrackPageView(entry: KVPageView): Promise<void> {
  if (!redis) return;
  try {
    await redis.lpush(KEYS.pageviews, entry);
    await redis.ltrim(KEYS.pageviews, 0, MAX_LIST - 1);
  } catch (e) {
    console.error("[kv:pageview]", e);
  }
}

export async function kvTrackConversation(entry: KVConversation): Promise<void> {
  if (!redis) return;
  try {
    await redis.lpush(KEYS.conversations, entry);
    await redis.ltrim(KEYS.conversations, 0, MAX_LIST - 1);
    if (entry.isFallback) {
      const fallback: KVFallback = {
        ts: entry.ts,
        sessionId: entry.sessionId,
        userMsg: entry.userMsg,
        pageContext: entry.pageContext,
      };
      await redis.lpush(KEYS.fallbacks, fallback);
      await redis.ltrim(KEYS.fallbacks, 0, MAX_LIST - 1);
    }
  } catch (e) {
    console.error("[kv:conversation]", e);
  }
}

export async function kvGetPageViews(): Promise<KVPageView[]> {
  if (!redis) return [];
  try {
    return (await redis.lrange<KVPageView>(KEYS.pageviews, 0, -1)) ?? [];
  } catch (e) {
    console.error("[kv:read:pageviews]", e);
    return [];
  }
}

export async function kvGetConversations(): Promise<KVConversation[]> {
  if (!redis) return [];
  try {
    return (await redis.lrange<KVConversation>(KEYS.conversations, 0, -1)) ?? [];
  } catch (e) {
    console.error("[kv:read:conversations]", e);
    return [];
  }
}

export async function kvGetFallbacks(): Promise<KVFallback[]> {
  if (!redis) return [];
  try {
    return (await redis.lrange<KVFallback>(KEYS.fallbacks, 0, -1)) ?? [];
  } catch (e) {
    console.error("[kv:read:fallbacks]", e);
    return [];
  }
}

export { KV_AVAILABLE };
