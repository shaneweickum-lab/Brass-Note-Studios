/**
 * Vercel KV (Redis) persistence layer for BNSignal analytics.
 * Falls back gracefully to no-ops when KV env vars aren't configured.
 */

import { kv } from "@vercel/kv";

const KV_AVAILABLE = Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

const KEYS = {
  pageviews: "bns:pageviews",
  conversations: "bns:conversations",
  fallbacks: "bns:fallbacks",
} as const;

const MAX_LIST = 5000;

// ── Types ───────────────────────────────────────────────────────────────────

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

// ── Writers ─────────────────────────────────────────────────────────────────

export async function kvTrackPageView(entry: KVPageView): Promise<void> {
  if (!KV_AVAILABLE) return;
  try {
    await kv.lpush(KEYS.pageviews, entry);
    await kv.ltrim(KEYS.pageviews, 0, MAX_LIST - 1);
  } catch (e) {
    console.error("[kv:pageview]", e);
  }
}

export async function kvTrackConversation(entry: KVConversation): Promise<void> {
  if (!KV_AVAILABLE) return;
  try {
    await kv.lpush(KEYS.conversations, entry);
    await kv.ltrim(KEYS.conversations, 0, MAX_LIST - 1);
    if (entry.isFallback) {
      const fallback: KVFallback = {
        ts: entry.ts,
        sessionId: entry.sessionId,
        userMsg: entry.userMsg,
        pageContext: entry.pageContext,
      };
      await kv.lpush(KEYS.fallbacks, fallback);
      await kv.ltrim(KEYS.fallbacks, 0, MAX_LIST - 1);
    }
  } catch (e) {
    console.error("[kv:conversation]", e);
  }
}

// ── Readers ──────────────────────────────────────────────────────────────────

export async function kvGetPageViews(): Promise<KVPageView[]> {
  if (!KV_AVAILABLE) return [];
  try {
    const items = await kv.lrange<KVPageView>(KEYS.pageviews, 0, -1);
    return items ?? [];
  } catch (e) {
    console.error("[kv:read:pageviews]", e);
    return [];
  }
}

export async function kvGetConversations(): Promise<KVConversation[]> {
  if (!KV_AVAILABLE) return [];
  try {
    const items = await kv.lrange<KVConversation>(KEYS.conversations, 0, -1);
    return items ?? [];
  } catch (e) {
    console.error("[kv:read:conversations]", e);
    return [];
  }
}

export async function kvGetFallbacks(): Promise<KVFallback[]> {
  if (!KV_AVAILABLE) return [];
  try {
    const items = await kv.lrange<KVFallback>(KEYS.fallbacks, 0, -1);
    return items ?? [];
  } catch (e) {
    console.error("[kv:read:fallbacks]", e);
    return [];
  }
}

export { KV_AVAILABLE };
