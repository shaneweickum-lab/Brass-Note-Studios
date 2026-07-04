import type { Metadata } from "next";
import { readConversations, readFallbacks, readSessions, readLeads } from "@/lib/analytics/readLogs";

export const metadata: Metadata = { title: "Raw Logs" };
export const dynamic = "force-dynamic";

function maskEmail(email: string) {
  const [local, domain] = email.split("@");
  return `${local.slice(0, 3)}***@${domain ?? "?"}`;
}

export default function RawLogsPage() {
  const conversations = readConversations().slice(-100).reverse();
  const fallbacks = readFallbacks().slice(-50).reverse();
  const sessions = readSessions().slice(-50).reverse();
  const leads = readLeads().slice(-20).reverse();

  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl text-text-base mb-1">Raw Logs</h1>
          <p className="text-text-subtle font-body text-sm">Most recent entries from each log file (read-only)</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <a href="/api/analytics/export?type=conversations" className="text-gold font-body text-xs border border-gold/40 rounded px-3 py-1.5 hover:bg-gold/10 transition-colors">
            Conversations CSV
          </a>
          <a href="/api/analytics/export?type=fallbacks" className="text-gold font-body text-xs border border-gold/40 rounded px-3 py-1.5 hover:bg-gold/10 transition-colors">
            Fallbacks CSV
          </a>
          <a href="/api/analytics/export?type=leads" className="text-gold font-body text-xs border border-gold/40 rounded px-3 py-1.5 hover:bg-gold/10 transition-colors">
            Leads CSV
          </a>
        </div>
      </div>

      {/* Conversations */}
      <section className="rounded-lg border border-white/10 bg-surface p-6">
        <h2 className="font-display text-lg text-text-base mb-4">
          Recent Conversations <span className="text-text-subtle text-sm font-body ml-2">(last 100)</span>
        </h2>
        {conversations.length === 0 ? (
          <p className="text-text-subtle font-body text-sm">No conversations logged yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full font-body text-xs">
              <thead>
                <tr className="border-b border-white/10 text-text-subtle uppercase tracking-[0.1em]">
                  <th className="text-left px-3 py-2 w-32">Time</th>
                  <th className="text-left px-3 py-2 w-24">Session</th>
                  <th className="text-left px-3 py-2">Message</th>
                  <th className="text-left px-3 py-2 w-24">Page</th>
                  <th className="text-left px-3 py-2 w-16">Fallback</th>
                </tr>
              </thead>
              <tbody>
                {conversations.map((c, i) => (
                  <tr key={i} className={`border-b border-white/5 ${c.isFallback ? "bg-red-950/10" : ""}`}>
                    <td className="px-3 py-2 text-text-subtle">{c.ts.slice(0, 19).replace("T", " ")}</td>
                    <td className="px-3 py-2 text-text-subtle font-mono">{c.sessionId.slice(0, 8)}</td>
                    <td className="px-3 py-2 text-text-base max-w-xs truncate">{c.userMsg}</td>
                    <td className="px-3 py-2 text-text-subtle">{c.pageContext || "/"}</td>
                    <td className="px-3 py-2">
                      {c.isFallback ? (
                        <span className="text-red-400">yes</span>
                      ) : (
                        <span className="text-text-subtle">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Fallbacks */}
      <section className="rounded-lg border border-white/10 bg-surface p-6">
        <h2 className="font-display text-lg text-text-base mb-4">
          Recent Fallbacks <span className="text-text-subtle text-sm font-body ml-2">(last 50)</span>
        </h2>
        {fallbacks.length === 0 ? (
          <p className="text-text-subtle font-body text-sm">No fallbacks logged yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full font-body text-xs">
              <thead>
                <tr className="border-b border-white/10 text-text-subtle uppercase tracking-[0.1em]">
                  <th className="text-left px-3 py-2 w-32">Time</th>
                  <th className="text-left px-3 py-2">Message</th>
                  <th className="text-left px-3 py-2 w-24">Page</th>
                </tr>
              </thead>
              <tbody>
                {fallbacks.map((f, i) => (
                  <tr key={i} className="border-b border-white/5">
                    <td className="px-3 py-2 text-text-subtle">{f.ts.slice(0, 19).replace("T", " ")}</td>
                    <td className="px-3 py-2 text-text-base">{f.userMsg}</td>
                    <td className="px-3 py-2 text-text-subtle">{f.pageContext || "/"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Leads */}
      <section className="rounded-lg border border-white/10 bg-surface p-6">
        <h2 className="font-display text-lg text-text-base mb-4">
          Recent Leads <span className="text-text-subtle text-sm font-body ml-2">(last 20, emails masked)</span>
        </h2>
        {leads.length === 0 ? (
          <p className="text-text-subtle font-body text-sm">No leads logged yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full font-body text-xs">
              <thead>
                <tr className="border-b border-white/10 text-text-subtle uppercase tracking-[0.1em]">
                  <th className="text-left px-3 py-2 w-32">Time</th>
                  <th className="text-left px-3 py-2">Name</th>
                  <th className="text-left px-3 py-2">Email</th>
                  <th className="text-left px-3 py-2">Service</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((l, i) => (
                  <tr key={i} className="border-b border-white/5">
                    <td className="px-3 py-2 text-text-subtle">{l.ts?.slice(0, 10) ?? "—"}</td>
                    <td className="px-3 py-2 text-text-base">{l.name}</td>
                    <td className="px-3 py-2 text-text-subtle font-mono">{maskEmail(l.email)}</td>
                    <td className="px-3 py-2 text-gold">{l.service}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Sessions */}
      <section className="rounded-lg border border-white/10 bg-surface p-6">
        <h2 className="font-display text-lg text-text-base mb-4">
          Recent Sessions <span className="text-text-subtle text-sm font-body ml-2">(last 50)</span>
        </h2>
        {sessions.length === 0 ? (
          <p className="text-text-subtle font-body text-sm">No session data logged yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full font-body text-xs">
              <thead>
                <tr className="border-b border-white/10 text-text-subtle uppercase tracking-[0.1em]">
                  <th className="text-left px-3 py-2 w-24">Session</th>
                  <th className="text-left px-3 py-2 w-32">Start</th>
                  <th className="text-left px-3 py-2 w-24">Page</th>
                  <th className="text-right px-3 py-2 w-16">Messages</th>
                  <th className="text-left px-3 py-2 w-16">Converted</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((s, i) => (
                  <tr key={i} className="border-b border-white/5">
                    <td className="px-3 py-2 text-text-subtle font-mono">{s.sessionId.slice(0, 8)}</td>
                    <td className="px-3 py-2 text-text-subtle">{s.startTs.slice(0, 19).replace("T", " ")}</td>
                    <td className="px-3 py-2 text-text-subtle">{s.pageContext || "/"}</td>
                    <td className="px-3 py-2 text-right text-text-base">{s.messageCount}</td>
                    <td className="px-3 py-2">{s.converted ? <span className="text-gold">yes</span> : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
