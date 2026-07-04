import type { Metadata } from "next";
import { getVercelOverview } from "@/lib/analytics/vercel";
import StatCard from "@/components/analytics/StatCard";

export const metadata: Metadata = { title: "Website Analytics" };
export const dynamic = "force-dynamic";

export default async function WebsiteAnalyticsPage() {
  const vercel = await getVercelOverview();

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="font-display text-3xl text-text-base mb-1">Website Analytics</h1>
        <p className="text-text-subtle font-body text-sm">Vercel Analytics — page views and visitors</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <StatCard label="Total Page Views" value={vercel.totalViews.toLocaleString()} accent />
        <StatCard label="Unique Visitors" value={vercel.uniqueVisitors.toLocaleString()} />
      </div>

      {vercel.topPages.length > 0 ? (
        <div className="rounded-lg border border-white/10 bg-surface p-6">
          <h2 className="font-display text-lg text-text-base mb-4">Top Pages</h2>
          <div className="overflow-x-auto">
            <table className="w-full font-body text-sm">
              <thead>
                <tr className="border-b border-white/10 text-text-subtle text-xs uppercase tracking-[0.1em]">
                  <th className="text-left px-4 py-2">Page</th>
                  <th className="text-right px-4 py-2">Views</th>
                  <th className="text-right px-4 py-2">Visitors</th>
                </tr>
              </thead>
              <tbody>
                {vercel.topPages.map((p, i) => (
                  <tr key={i} className="border-b border-white/5">
                    <td className="px-4 py-2 text-text-base font-mono text-xs">{p.page}</td>
                    <td className="px-4 py-2 text-right text-gold">{p.views.toLocaleString()}</td>
                    <td className="px-4 py-2 text-right text-text-muted">{p.uniqueVisitors.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-white/10 bg-surface p-8 text-center flex flex-col gap-2">
          <p className="text-text-subtle font-body text-sm">
            {vercel.error === "credentials_missing"
              ? "Environment variables not set — add VERCEL_ACCESS_TOKEN and VERCEL_PROJECT_ID."
              : vercel.error?.startsWith("api_error")
              ? `Vercel API returned an error (${vercel.error}). Check that Vercel Analytics is enabled on your project and the token has the right scope. See Vercel function logs for details.`
              : "No page data returned yet — Vercel Analytics may need a few hours to populate after being enabled."}
          </p>
          {vercel.error && (
            <code className="text-gold/60 font-mono text-xs">{vercel.error}</code>
          )}
        </div>
      )}
    </div>
  );
}
