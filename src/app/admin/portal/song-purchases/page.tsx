export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { getSongPurchases } from "@/lib/supabase/queries";
import songsData from "@/data/songs.json";

export const metadata: Metadata = {
  title: "Song Sales | Admin",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export default async function SongPurchasesPage() {
  const purchases = await getSongPurchases();

  const totalRevenueCents = purchases.reduce((sum, p) => sum + p.amount_total, 0);

  // Build per-song summary
  const songMap = new Map<string, { title: string; clientName: string; priceCents: number; count: number; revenueCents: number }>();
  for (const song of songsData.songs) {
    if (!songMap.has(song.id)) {
      songMap.set(song.id, {
        title: song.title,
        clientName: song.clientName ?? "",
        priceCents: Math.round((song.downloadPrice ?? 0) * 100),
        count: 0,
        revenueCents: 0,
      });
    }
  }
  for (const p of purchases) {
    const entry = songMap.get(p.song_id);
    if (entry) {
      entry.count += 1;
      entry.revenueCents += p.amount_total;
    } else {
      songMap.set(p.song_id, {
        title: p.song_id,
        clientName: "Unknown",
        priceCents: p.amount_total,
        count: 1,
        revenueCents: p.amount_total,
      });
    }
  }

  const songSummaries = Array.from(songMap.values())
    .filter((s) => s.count > 0)
    .sort((a, b) => b.revenueCents - a.revenueCents);

  const thisMonthStart = new Date();
  thisMonthStart.setDate(1);
  thisMonthStart.setHours(0, 0, 0, 0);
  const thisMonthCents = purchases
    .filter((p) => new Date(p.created_at) >= thisMonthStart)
    .reduce((sum, p) => sum + p.amount_total, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl sm:text-3xl text-text-base leading-tight">Song Sales</h1>
        <p className="text-text-muted font-body text-xs sm:text-sm mt-0.5">MP3 download purchase history</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Revenue", value: formatCents(totalRevenueCents), accent: true },
          { label: "This Month",    value: formatCents(thisMonthCents) },
          { label: "Total Sales",   value: String(purchases.length) },
        ].map(({ label, value, accent }) => (
          <div key={label} className="bg-surface border border-white/10 rounded-lg px-4 py-4">
            <p className="font-body text-[10px] text-text-subtle uppercase tracking-[0.1em] mb-1">{label}</p>
            <p className={`font-display text-xl ${accent ? "text-gold" : "text-text-base"}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Per-song summary */}
      {songSummaries.length > 0 && (
        <div className="bg-surface border border-white/10 rounded-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-white/10">
            <h2 className="font-display text-base text-text-base">By Song</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-5 py-3 text-left font-body text-xs text-text-subtle uppercase tracking-[0.1em]">Song</th>
                  <th className="px-5 py-3 text-left font-body text-xs text-text-subtle uppercase tracking-[0.1em]">Client</th>
                  <th className="px-5 py-3 text-right font-body text-xs text-text-subtle uppercase tracking-[0.1em]">Sales</th>
                  <th className="px-5 py-3 text-right font-body text-xs text-text-subtle uppercase tracking-[0.1em]">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {songSummaries.map((s) => (
                  <tr key={s.title} className="border-b border-white/5 last:border-0">
                    <td className="px-5 py-3.5 font-body text-sm text-text-base">{s.title}</td>
                    <td className="px-5 py-3.5 font-body text-sm text-text-muted">{s.clientName}</td>
                    <td className="px-5 py-3.5 font-body text-sm text-text-base text-right">{s.count}</td>
                    <td className="px-5 py-3.5 font-display text-sm text-gold text-right">{formatCents(s.revenueCents)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* All purchases log */}
      <div className="bg-surface border border-white/10 rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="font-display text-base text-text-base">All Purchases</h2>
          <span className="text-text-subtle font-body text-xs">{purchases.length} total</span>
        </div>

        {purchases.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="text-text-muted font-body text-sm">No purchases yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-5 py-3 text-left font-body text-xs text-text-subtle uppercase tracking-[0.1em]">Date</th>
                  <th className="px-5 py-3 text-left font-body text-xs text-text-subtle uppercase tracking-[0.1em]">Song</th>
                  <th className="px-5 py-3 text-left font-body text-xs text-text-subtle uppercase tracking-[0.1em]">Customer</th>
                  <th className="px-5 py-3 text-right font-body text-xs text-text-subtle uppercase tracking-[0.1em]">Amount</th>
                  <th className="px-5 py-3 text-left font-body text-xs text-text-subtle uppercase tracking-[0.1em] hidden sm:table-cell">Payment ID</th>
                </tr>
              </thead>
              <tbody>
                {purchases.map((p) => {
                  const song = songsData.songs.find((s) => s.id === p.song_id);
                  return (
                    <tr key={p.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3.5 font-body text-xs text-text-subtle whitespace-nowrap">{formatDate(p.created_at)}</td>
                      <td className="px-5 py-3.5 font-body text-sm text-text-base">{song?.title ?? p.song_id}</td>
                      <td className="px-5 py-3.5 font-body text-xs text-text-muted">{p.customer_email ?? "—"}</td>
                      <td className="px-5 py-3.5 font-display text-sm text-gold text-right">{formatCents(p.amount_total)}</td>
                      <td className="px-5 py-3.5 font-mono text-[10px] text-text-subtle/50 hidden sm:table-cell truncate max-w-[160px]">{p.stripe_session_id}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
