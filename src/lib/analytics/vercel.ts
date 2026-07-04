export interface VercelPageView {
  page: string;
  views: number;
  uniqueVisitors: number;
}

export interface VercelOverview {
  totalViews: number;
  uniqueVisitors: number;
  topPages: VercelPageView[];
}

const BASE = "https://vercel.com/api";

async function vercelFetch(path: string): Promise<Response> {
  const token = process.env.VERCEL_ACCESS_TOKEN;
  const projectId = process.env.VERCEL_PROJECT_ID;
  const teamId = process.env.VERCEL_TEAM_ID;

  if (!token || !projectId) throw new Error("Vercel API credentials not configured");

  const url = new URL(`${BASE}${path}`);
  if (teamId) url.searchParams.set("teamId", teamId);

  return fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 3600 }, // 1-hour cache
  });
}

export async function getVercelOverview(): Promise<VercelOverview> {
  try {
    const projectId = process.env.VERCEL_PROJECT_ID;
    const res = await vercelFetch(`/v1/analytics/${projectId}/page-views`);
    if (!res.ok) throw new Error(`Vercel API error: ${res.status}`);
    const data = await res.json();

    // Vercel Analytics API shape: { data: { totalPageViews, uniqueVisitors, topPages } }
    const d = data?.data ?? {};
    return {
      totalViews: d.totalPageViews ?? 0,
      uniqueVisitors: d.uniqueVisitors ?? 0,
      topPages: (d.topPages ?? []).map((p: { page: string; views: number; uniqueVisitors: number }) => ({
        page: p.page,
        views: p.views,
        uniqueVisitors: p.uniqueVisitors ?? 0,
      })),
    };
  } catch {
    return { totalViews: 0, uniqueVisitors: 0, topPages: [] };
  }
}
