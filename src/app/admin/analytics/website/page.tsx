import type { Metadata } from "next";
import { readConversations, readSessions } from "@/lib/analytics/readLogs";
import StatCard from "@/components/analytics/StatCard";

export const metadata: Metadata = { title: "Website Analytics" };
export const dynamic = "force-dynamic";

export default function WebsiteAnalyticsPage() {
  const conversations = readConversations();
  const sessions = readSessions();

  // Page engagement derived from concierge context
  const pageMap = new Map<string, { messages: number; sessions: number }>();
  for (const c of conversations) {
    const pg = c.pageContext || "/";
    if (!pageMap.has(pg)) pageMap.set(pg, { messages: 0, sessions: 0 });
    pageMap.get(pg)!.messages++;
  }
  for (const s of sessions) {
    const pg = s.pageContext || "/";
    if (!pageMap.has(pg)) pageMap.set(pg, { messages: 0, sessions: 0 });
    pageMap.get(pg)!.sessions++;
  }
  const byPage = Array.from(pageMap.entries())
    .map(([page, { messages, sessions }]) => ({ page, messages, sessions }))
    .sort((a, b) => b.messages - a.messages);

  const totalMessages = conversations.length;
  const uniquePages = byPage.length;
  const maxMessages = byPage[0]?.messages ?? 1;

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="font-display text-3xl text-text-base mb-1">Website Analytics</h1>
        <p className="text-text-subtle font-body text-sm">Page engagement via concierge activity</p>
      </div>

      {/* Vercel dashboard link */}
      <div className="rounded-lg border border-gold/25 bg-gold/5 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1">
          <p className="font-body text-sm text-text-base font-semibold mb-1">Vercel Analytics Dashboard</p>
          <p className="font-body text-xs text-text-muted">
            Full traffic data — page views, unique visitors, geography, devices — is available directly in Vercel.
          </p>
        </div>
        <a
          href="https://vercel.com/dashboard"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center gap-2 font-body text-sm font-semibold text-gold border border-gold/40 rounded px-4 py-2 hover:bg-gold/10 transition-colors"
        >
          Open Vercel ↗
        </a>
      </div>

      {/* Concierge-derived page stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <StatCard label="Concierge Messages" value={totalMessages} />
        <StatCard label="Pages with Engagement" value={uniquePages} />
        <StatCard label="Unique Sessions" value={sessions.length || new Set(conversations.map(c => c.sessionId)).size} accent />
      </div>

      {byPage.length > 0 ? (
        <div className="rounded-lg border border-white/10 bg-surface p-6">
          <h2 className="font-display text-lg text-text-base mb-1">Engagement by Page</h2>
          <p className="text-text-subtle font-body text-xs mb-6">
            Which pages visitors were on when they opened the concierge.
          </p>
          <div className="flex flex-col gap-3">
            {byPage.map(({ page, messages, sessions: pgSessions }) => (
              <div key={page} className="flex items-center gap-3">
                <span className="font-mono text-xs text-text-muted w-32 shrink-0 truncate">{page}</span>
                <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-gold/80 to-gold/40 rounded-full"
                    style={{ width: `${(messages / maxMessages) * 100}%` }}
                  />
                </div>
                <span className="font-body text-xs text-gold w-6 text-right shrink-0">{messages}</span>
                {pgSessions > 0 && (
                  <span className="font-body text-xs text-text-subtle w-16 shrink-0">
                    {pgSessions} session{pgSessions !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
            ))}
          </div>
          <p className="text-text-subtle font-body text-xs mt-6">
            Numbers reflect concierge interactions, not raw page views.
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-white/10 bg-surface p-8 text-center">
          <p className="text-text-subtle font-body text-sm">
            No concierge engagement data yet. Data populates as visitors use the chat.
          </p>
        </div>
      )}
    </div>
  );
}
