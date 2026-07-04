import { NextRequest, NextResponse } from "next/server";
import { kvTrackPageView } from "@/lib/analytics/kv";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      path: string;
      sessionId: string;
      referrer?: string;
    };

    const path = body.path ?? "/";

    // Never track admin or internal API routes
    if (path.startsWith("/admin") || path.startsWith("/api")) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    const entry = {
      ts: new Date().toISOString(),
      path,
      sessionId: body.sessionId ?? "anon",
      referrer: body.referrer ?? "",
    };

    console.log("[page-view]", JSON.stringify(entry));
    await kvTrackPageView(entry);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
}
