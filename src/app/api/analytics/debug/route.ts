import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

export async function GET() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  const result: Record<string, unknown> = {
    env: {
      UPSTASH_REDIS_REST_URL: url ? `set (${url.slice(0, 30)}...)` : "MISSING",
      UPSTASH_REDIS_REST_TOKEN: token ? "set" : "MISSING",
      ADMIN_USER: process.env.ADMIN_USER ? "set" : "MISSING",
    },
  };

  if (!url || !token) {
    return NextResponse.json({ ...result, status: "env vars missing" });
  }

  try {
    const redis = new Redis({ url, token });

    // Ping
    const ping = await redis.ping();
    result.ping = ping;

    // Write test
    await redis.set("bns:debug", "ok");
    const readback = await redis.get("bns:debug");
    result.write_read = readback;

    // Check list lengths
    result.pageviews_count = await redis.llen("bns:pageviews");
    result.conversations_count = await redis.llen("bns:conversations");

    // Peek at last item in each list
    const lastPv = await redis.lrange("bns:pageviews", 0, 0);
    const lastConv = await redis.lrange("bns:conversations", 0, 0);
    result.last_pageview = lastPv[0] ?? null;
    result.last_conversation = lastConv[0] ?? null;

    result.status = "connected";
  } catch (e) {
    result.status = "error";
    result.error = String(e);
  }

  return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } });
}
