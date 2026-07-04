import { NextRequest, NextResponse } from "next/server";
import { appendFileSync, mkdirSync } from "fs";
import path from "path";

const LOG_DIR = path.join(process.cwd(), "chatbot", "logs");

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      path: string;
      sessionId: string;
      referrer?: string;
    };

    const entry = {
      ts: new Date().toISOString(),
      path: body.path ?? "/",
      sessionId: body.sessionId ?? "anon",
      referrer: body.referrer ?? "",
    };

    console.log("[page-view]", JSON.stringify(entry));

    try {
      mkdirSync(LOG_DIR, { recursive: true });
      appendFileSync(
        path.join(LOG_DIR, "pageviews.jsonl"),
        JSON.stringify(entry) + "\n"
      );
    } catch {
      // read-only in serverless — console.log above captures it
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
}
