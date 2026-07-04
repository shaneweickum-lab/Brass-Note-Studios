import { NextRequest, NextResponse } from "next/server";
import { readConversations, readFallbacks, readSessions, readLeads } from "@/lib/analytics/readLogs";
import { aggregateOverview } from "@/lib/analytics/aggregator";

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
  const sessions = readSessions();
  const leads = readLeads();

  const data = aggregateOverview(conversations, fallbacks, sessions, leads);
  return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
}
