import { NextRequest, NextResponse } from "next/server";
import { readConversations, readFallbacks, readLeads } from "@/lib/analytics/readLogs";

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

function toCsv(rows: Record<string, unknown>[]): string {
  if (!rows.length) return "";
  const keys = Object.keys(rows[0]);
  const header = keys.join(",");
  const lines = rows.map((r) =>
    keys.map((k) => `"${String(r[k] ?? "").replace(/"/g, '""')}"`).join(",")
  );
  return [header, ...lines].join("\n");
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = req.nextUrl;
  const type = searchParams.get("type") ?? "conversations";

  let csv = "";
  let filename = "export.csv";

  if (type === "conversations") {
    const rows = readConversations().map((c) => ({ ...c }));
    csv = toCsv(rows as unknown as Record<string, unknown>[]);
    filename = "conversations.csv";
  } else if (type === "fallbacks") {
    const rows = readFallbacks().map((f) => ({ ...f }));
    csv = toCsv(rows as unknown as Record<string, unknown>[]);
    filename = "fallbacks.csv";
  } else if (type === "leads") {
    // Full emails in export — this is an authenticated admin-only endpoint
    const rows = readLeads().map((l) => ({ ...l }));
    csv = toCsv(rows as unknown as Record<string, unknown>[]);
    filename = "leads.csv";
  }

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
