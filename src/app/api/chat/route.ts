import { NextRequest, NextResponse } from "next/server";
import { appendFileSync, mkdirSync } from "fs";
import path from "path";
import { AimlEngine } from "../../../../chatbot/engine/AimlEngine";
import { ConversationContext } from "../../../../chatbot/engine/ConversationContext";
import { chatbotConfig } from "../../../../chatbot/config";
import { kvTrackConversation } from "@/lib/analytics/kv";

const sessions = new Map<string, ConversationContext>();

let engine: AimlEngine | null = null;
function getEngine(): AimlEngine {
  if (!engine) engine = new AimlEngine();
  return engine;
}

const LOG_DIR = path.join(process.cwd(), "chatbot", "logs");

function ensureLogDir() {
  try { mkdirSync(LOG_DIR, { recursive: true }); } catch { /* ok */ }
}

function appendLog(filename: string, entry: unknown) {
  try {
    ensureLogDir();
    appendFileSync(path.join(LOG_DIR, filename), JSON.stringify(entry) + "\n");
  } catch { /* read-only in serverless — console.log is the fallback */ }
}

async function logConversation(
  sessionId: string,
  userMsg: string,
  botResponse: string,
  isFallback: boolean,
  pageContext: string,
  matchedPattern?: string
) {
  const entry = {
    ts: new Date().toISOString(),
    sessionId,
    userMsg,
    botResponse: botResponse.slice(0, 200),
    isFallback,
    pageContext,
    matchedPattern,
  };
  console.log("[conversation]", JSON.stringify(entry));
  appendLog("conversations.jsonl", entry);
  await kvTrackConversation(entry);

  if (isFallback) {
    const fallbackEntry = { ts: entry.ts, sessionId, userMsg, pageContext };
    console.log("[fallback]", JSON.stringify(fallbackEntry));
    appendLog("fallbacks.jsonl", fallbackEntry);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      message: string;
      sessionId?: string;
      formWalk?: boolean;
      pageContext?: string;
    };

    const { message, sessionId = "default", formWalk, pageContext = "/" } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Missing message" }, { status: 400 });
    }

    if (!sessions.has(sessionId)) {
      sessions.set(
        sessionId,
        new ConversationContext(chatbotConfig.MAX_CONVERSATION_TURNS)
      );
    }
    const context = sessions.get(sessionId)!;
    const eng = getEngine();

    // Start form walk directly (triggered by UI button, not text pattern)
    if (formWalk) {
      const response = eng.startFormWalk(context);
      return NextResponse.json({ ...response, sessionId });
    }

    // Normal AIML processing
    const response = eng.process(message, context);

    // __FORM_WALK__ template signals form walk trigger via AIML pattern
    if (response.text === "__FORM_WALK__") {
      const fwResponse = eng.startFormWalk(context);
      await logConversation(sessionId, message, fwResponse.text, false, pageContext);
      return NextResponse.json({ ...fwResponse, sessionId });
    }

    await logConversation(
      sessionId,
      message,
      response.text,
      response.isFallback ?? false,
      pageContext,
      response.matchedPattern
    );
    return NextResponse.json({ ...response, sessionId });
  } catch (err) {
    console.error("[chat/route]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
