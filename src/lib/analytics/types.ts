export interface ConversationEvent {
  ts: string;
  sessionId: string;
  userMsg: string;
  botResponse: string;
  isFallback: boolean;
  pageContext: string;
  matchedPattern?: string;
}

export interface FallbackEvent {
  ts: string;
  sessionId: string;
  userMsg: string;
  pageContext: string;
}

export interface SessionEvent {
  sessionId: string;
  startTs: string;
  endTs?: string;
  pageContext: string;
  messageCount: number;
  converted: boolean;
}

export interface Lead {
  id: string;
  ts: string;
  name: string;
  email: string;
  service: string;
  description?: string;
}

export interface PatternStat {
  pattern: string;
  count: number;
  lastSeen: string;
}

export interface FallbackStat {
  message: string;
  count: number;
  lastSeen: string;
  pageContext: string;
}

export interface DailyStat {
  date: string;
  sessions: number;
  messages: number;
  fallbacks: number;
  conversions: number;
}

export interface PageStat {
  page: string;
  sessions: number;
  messages: number;
}

export interface OverviewData {
  totalSessions: number;
  totalMessages: number;
  totalFallbacks: number;
  totalLeads: number;
  fallbackRate: number;
  conversionRate: number;
  daily: DailyStat[];
  topPatterns: PatternStat[];
  topFallbacks: FallbackStat[];
  byPage: PageStat[];
}
