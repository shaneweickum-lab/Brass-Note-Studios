import { NextRequest, NextResponse } from "next/server";
import { readConversations, readFallbacks } from "@/lib/analytics/readLogs";

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

  const conversations = readConversations();
  const fallbacks = readFallbacks();

  const totalMessages = conversations.length;
  const fallbackCount = conversations.filter((c) => c.isFallback).length + fallbacks.length;
  const fallbackRate = totalMessages > 0 ? fallbackCount / totalMessages : 0;

  // Pattern breakdown
  const patternMap = new Map<string, number>();
  for (const c of conversations) {
    if (c.matchedPattern && !c.isFallback) {
      patternMap.set(c.matchedPattern, (patternMap.get(c.matchedPattern) ?? 0) + 1);
    }
  }
  const topPatterns = Array.from(patternMap.entries())
    .map(([pattern, count]) => ({ pattern, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 30);

  // Recent fallback messages
  const allFallbacks = [
    ...fallbacks.map((f) => ({ message: f.userMsg, ts: f.ts, page: f.pageContext })),
    ...conversations.filter((c) => c.isFallback).map((c) => ({ message: c.userMsg, ts: c.ts, page: c.pageContext })),
  ].sort((a, b) => b.ts.localeCompare(a.ts)).slice(0, 50);

  return NextResponse.json(
    { totalMessages, fallbackCount, fallbackRate, topPatterns, recentFallbacks: allFallbacks },
    { headers: { "Cache-Control": "no-store" } }
  );
}
