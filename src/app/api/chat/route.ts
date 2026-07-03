import { NextRequest, NextResponse } from "next/server";
import { AimlEngine } from "../../../../chatbot/engine/AimlEngine";
import { ConversationContext } from "../../../../chatbot/engine/ConversationContext";
import { chatbotConfig } from "../../../../chatbot/config";

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
      formWalk?: boolean;
    };

    const { message, sessionId = "default", formWalk } = body;

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
      return NextResponse.json({ ...fwResponse, sessionId });
    }

    return NextResponse.json({ ...response, sessionId });
  } catch (err) {
    console.error("[chat/route]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
