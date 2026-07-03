import { NextRequest, NextResponse } from "next/server";
import { AimlEngine } from "../../../../chatbot/engine/AimlEngine";
import { ConversationContext } from "../../../../chatbot/engine/ConversationContext";
import { chatbotConfig } from "../../../../chatbot/config";

// Session-level conversation contexts (in-memory; resets on cold start)
const sessions = new Map<string, ConversationContext>();

let engine: AimlEngine | null = null;
function getEngine(): AimlEngine {
  if (!engine) engine = new AimlEngine();
  return engine;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      message: string;
      sessionId?: string;
    };

    const { message, sessionId = "default" } = body;

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

    const response = getEngine().process(message, context);

    return NextResponse.json({ ...response, sessionId });
  } catch (err) {
    console.error("[chat/route]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
