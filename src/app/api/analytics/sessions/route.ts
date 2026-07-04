import { NextRequest, NextResponse } from "next/server";
import { readSessions, readLeads } from "@/lib/analytics/readLogs";

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

  const sessions = readSessions();
  const leads = readLeads();

  // Mask emails — first 3 chars + domain
  const maskedLeads = leads.map((l) => {
    const [local, domain] = l.email.split("@");
    const masked = `${local.slice(0, 3)}***@${domain ?? "?"}`;
    return { ...l, email: masked };
  });

  return NextResponse.json(
    { sessions, leads: maskedLeads },
    { headers: { "Cache-Control": "no-store" } }
  );
}
