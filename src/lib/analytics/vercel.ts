export interface VercelPageView {
  page: string;
  views: number;
  uniqueVisitors: number;
}

export interface VercelOverview {
  totalViews: number;
  uniqueVisitors: number;
  topPages: VercelPageView[];
  error?: string;
}

const BASE = "https://vercel.com/api";

function buildUrl(path: string, extra?: Record<string, string>): string {
  const projectId = process.env.VERCEL_PROJECT_ID ?? "";
  const teamId = process.env.VERCEL_TEAM_ID;
  const now = Date.now();
  const from = now - 30 * 24 * 60 * 60 * 1000; // 30 days ago

  const url = new URL(`${BASE}${path}`);
  url.searchParams.set("projectId", projectId);
  url.searchParams.set("from", String(from));
  url.searchParams.set("to", String(now));
  url.searchParams.set("environment", "production");
  if (teamId) url.searchParams.set("teamId", teamId);
  if (extra) Object.entries(extra).forEach(([k, v]) => url.searchParams.set(k, v));
  return url.toString();
}

async function apiFetch(url: string): Promise<Response> {
  const token = process.env.VERCEL_ACCESS_TOKEN ?? "";
  return fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 3600 },
  });
}

export async function getVercelOverview(): Promise<VercelOverview> {
  const token = process.env.VERCEL_ACCESS_TOKEN;
  const projectId = process.env.VERCEL_PROJECT_ID;

  if (!token || !projectId) {
    return { totalViews: 0, uniqueVisitors: 0, topPages: [], error: "credentials_missing" };
  }

  try {
    // Fetch page-level breakdown
    const pathUrl = buildUrl("/v1/web/insights/stats/path", { limit: "20" });
    const pathRes = await apiFetch(pathUrl);

    if (!pathRes.ok) {
      const body = await pathRes.text();
      console.error("[vercel-analytics] path stats error", pathRes.status, body);
      return { totalViews: 0, uniqueVisitors: 0, topPages: [], error: `api_error_${pathRes.status}` };
    }

    const pathData = await pathRes.json();
    console.log("[vercel-analytics] path response", JSON.stringify(pathData).slice(0, 500));

    // Fetch aggregate stats
    const statsUrl = buildUrl("/v1/web/insights/stats");
    const statsRes = await apiFetch(statsUrl);
    let totalViews = 0;
    let uniqueVisitors = 0;

    if (statsRes.ok) {
      const statsData = await statsRes.json();
      console.log("[vercel-analytics] stats response", JSON.stringify(statsData).slice(0, 500));

      // Handle multiple possible response shapes
      const d = statsData?.data ?? statsData ?? {};
      totalViews = d.totalPageViews ?? d.pageViews ?? d.total ?? 0;
      uniqueVisitors = d.uniqueVisitors ?? d.visitors ?? 0;
    }

    // Parse top pages — handle array of {key, total} or {page, views}
    const rawPages: unknown[] = pathData?.data ?? pathData ?? [];
    const topPages: VercelPageView[] = (Array.isArray(rawPages) ? rawPages : [])
      .map((p) => {
        const obj = p as Record<string, unknown>;
        return {
          page: (obj.key ?? obj.page ?? obj.path ?? "?") as string,
          views: Number(obj.total ?? obj.views ?? obj.count ?? 0),
          uniqueVisitors: Number(obj.uniqueVisitors ?? obj.visitors ?? 0),
        };
      })
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    // Derive totals from page breakdown if aggregate endpoint gave nothing
    if (!totalViews && topPages.length) {
      totalViews = topPages.reduce((sum, p) => sum + p.views, 0);
      uniqueVisitors = topPages.reduce((sum, p) => sum + p.uniqueVisitors, 0);
    }

    return { totalViews, uniqueVisitors, topPages };
  } catch (err) {
    console.error("[vercel-analytics] unexpected error", err);
    return { totalViews: 0, uniqueVisitors: 0, topPages: [], error: "unexpected" };
  }
}
