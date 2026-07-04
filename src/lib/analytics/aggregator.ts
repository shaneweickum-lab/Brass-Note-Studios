import type {
  ConversationEvent,
  FallbackEvent,
  SessionEvent,
  Lead,
  PatternStat,
  FallbackStat,
  DailyStat,
  PageStat,
  OverviewData,
} from "./types";

function dateKey(ts: string) {
  return ts.slice(0, 10);
}

export function aggregateOverview(
  conversations: ConversationEvent[],
  fallbacks: FallbackEvent[],
  sessions: SessionEvent[],
  leads: Lead[]
): OverviewData {
  const totalMessages = conversations.length;
  const totalFallbacks = fallbacks.length;
  const totalSessions = sessions.length || new Set(conversations.map((c) => c.sessionId)).size;
  const totalLeads = leads.length;
  const fallbackRate = totalMessages > 0 ? totalFallbacks / totalMessages : 0;
  const converted = sessions.filter((s) => s.converted).length;
  const conversionRate = totalSessions > 0 ? converted / totalSessions : 0;

  // Daily stats — last 30 days
  const dailyMap = new Map<string, DailyStat>();
  for (const c of conversations) {
    const d = dateKey(c.ts);
    if (!dailyMap.has(d)) dailyMap.set(d, { date: d, sessions: 0, messages: 0, fallbacks: 0, conversions: 0 });
    dailyMap.get(d)!.messages++;
    if (c.isFallback) dailyMap.get(d)!.fallbacks++;
  }
  for (const f of fallbacks) {
    const d = dateKey(f.ts);
    if (!dailyMap.has(d)) dailyMap.set(d, { date: d, sessions: 0, messages: 0, fallbacks: 0, conversions: 0 });
    // fallbacks already counted via isFallback above if using conversations.jsonl;
    // this handles legacy questions.jsonl fallbacks
  }
  for (const s of sessions) {
    const d = dateKey(s.startTs);
    if (!dailyMap.has(d)) dailyMap.set(d, { date: d, sessions: 0, messages: 0, fallbacks: 0, conversions: 0 });
    dailyMap.get(d)!.sessions++;
    if (s.converted) dailyMap.get(d)!.conversions++;
  }
  const daily = Array.from(dailyMap.values()).sort((a, b) => a.date.localeCompare(b.date)).slice(-30);

  // Top patterns
  const patternMap = new Map<string, PatternStat>();
  for (const c of conversations) {
    if (c.matchedPattern && !c.isFallback) {
      const p = c.matchedPattern;
      if (!patternMap.has(p)) patternMap.set(p, { pattern: p, count: 0, lastSeen: c.ts });
      const stat = patternMap.get(p)!;
      stat.count++;
      if (c.ts > stat.lastSeen) stat.lastSeen = c.ts;
    }
  }
  const topPatterns = Array.from(patternMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);

  // Top fallbacks
  const fallbackMap = new Map<string, FallbackStat>();
  const allFallbackMsgs = [
    ...fallbacks.map((f) => ({ msg: f.userMsg, ts: f.ts, page: f.pageContext })),
    ...conversations.filter((c) => c.isFallback).map((c) => ({ msg: c.userMsg, ts: c.ts, page: c.pageContext })),
  ];
  for (const { msg, ts, page } of allFallbackMsgs) {
    const key = msg.toLowerCase().trim();
    if (!fallbackMap.has(key)) fallbackMap.set(key, { message: msg, count: 0, lastSeen: ts, pageContext: page });
    const stat = fallbackMap.get(key)!;
    stat.count++;
    if (ts > stat.lastSeen) stat.lastSeen = ts;
  }
  const topFallbacks = Array.from(fallbackMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);

  // By page
  const pageMap = new Map<string, PageStat>();
  for (const c of conversations) {
    const pg = c.pageContext || "/";
    if (!pageMap.has(pg)) pageMap.set(pg, { page: pg, sessions: 0, messages: 0 });
    pageMap.get(pg)!.messages++;
  }
  for (const s of sessions) {
    const pg = s.pageContext || "/";
    if (!pageMap.has(pg)) pageMap.set(pg, { page: pg, sessions: 0, messages: 0 });
    pageMap.get(pg)!.sessions++;
  }
  const byPage = Array.from(pageMap.values()).sort((a, b) => b.messages - a.messages);

  return {
    totalSessions,
    totalMessages,
    totalFallbacks,
    totalLeads,
    fallbackRate,
    conversionRate,
    daily,
    topPatterns,
    topFallbacks,
    byPage,
  };
}
