import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

function checkAuth(req: NextRequest): boolean {
  const authHeader = req.headers.get("authorization") ?? "";
  if (!authHeader.startsWith("Basic ")) return false;
  const decoded = Buffer.from(authHeader.slice(6), "base64").toString("utf-8");
  const colonIdx = decoded.indexOf(":");
  if (colonIdx < 0) return false;
  const user = decoded.slice(0, colonIdx);
  const pass = decoded.slice(colonIdx + 1);
  return (
    user === (process.env.ADMIN_USER ?? "") &&
    pass === (process.env.ADMIN_PASS ?? "") &&
    Boolean(process.env.ADMIN_USER)
  );
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
