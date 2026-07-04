import fs from "fs";
import path from "path";
import type { ConversationEvent, FallbackEvent, SessionEvent, Lead } from "./types";

const LOG_DIR = path.join(process.cwd(), "chatbot", "logs");

function readJsonl<T>(filename: string): T[] {
  const filePath = path.join(LOG_DIR, filename);
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, "utf-8");
  return raw
    .split("\n")
    .filter((l) => l.trim())
    .map((l) => {
      try { return JSON.parse(l) as T; }
      catch { return null; }
    })
    .filter(Boolean) as T[];
}

export function readConversations(): ConversationEvent[] {
  return readJsonl<ConversationEvent>("conversations.jsonl");
}

export function readFallbacks(): FallbackEvent[] {
  return readJsonl<FallbackEvent>("fallbacks.jsonl");
}

export function readSessions(): SessionEvent[] {
  return readJsonl<SessionEvent>("sessions.jsonl");
}

export function readLeads(): Lead[] {
  const filePath = path.join(process.cwd(), "chatbot", "logs", "leads.json");
  if (!fs.existsSync(filePath)) return [];
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as Lead[];
  } catch {
    return [];
  }
}
