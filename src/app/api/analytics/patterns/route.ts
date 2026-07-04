import { NextRequest, NextResponse } from "next/server";
import { readConversations } from "@/lib/analytics/readLogs";

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
  const patternMap = new Map<string, { count: number; lastSeen: string }>();
  for (const c of conversations) {
    if (c.matchedPattern) {
      const existing = patternMap.get(c.matchedPattern) ?? { count: 0, lastSeen: c.ts };
      existing.count++;
      if (c.ts > existing.lastSeen) existing.lastSeen = c.ts;
      patternMap.set(c.matchedPattern, existing);
    }
  }

  const patterns = Array.from(patternMap.entries())
    .map(([pattern, { count, lastSeen }]) => ({ pattern, count, lastSeen }))
    .sort((a, b) => b.count - a.count);

  return NextResponse.json({ patterns }, { headers: { "Cache-Control": "no-store" } });
}
