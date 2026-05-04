import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { and, gte, lt, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { analyticsPageview, analyticsSectionView } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import {
  getRegisteredSections,
  listAllRegisteredPaths,
} from "@/lib/analytics/section-registry";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function parseRange(url: URL): { from: Date; to: Date } {
  const now = new Date();
  const toParam = url.searchParams.get("to");
  const fromParam = url.searchParams.get("from");
  const to = toParam ? new Date(toParam) : now;
  const from = fromParam
    ? new Date(fromParam)
    : new Date(to.getTime() - 30 * 24 * 60 * 60 * 1000);
  return { from, to };
}

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const { from, to } = parseRange(url);
  const path = url.searchParams.get("path") || "/";

  // Pageview count for path = denominator for section reach %.
  const [pvRow] = await db
    .select({
      pageviews: sql<number>`count(*)::int`,
      uniqueVisitors: sql<number>`count(distinct ${analyticsPageview.visitorId})::int`,
    })
    .from(analyticsPageview)
    .where(
      and(
        gte(analyticsPageview.startedAt, from),
        lt(analyticsPageview.startedAt, to),
        sql`${analyticsPageview.path} = ${path}`,
      ),
    );

  const observed = await db
    .select({
      sectionId: analyticsSectionView.sectionId,
      impressions: sql<number>`count(*)::int`,
      uniqueVisitors: sql<number>`count(distinct ${analyticsSectionView.visitorId})::int`,
      avgDwellMs: sql<number>`coalesce(avg(${analyticsSectionView.dwellMs}), 0)::int`,
      avgVisiblePct: sql<number>`coalesce(avg(${analyticsSectionView.maxVisiblePct}), 0)::int`,
    })
    .from(analyticsSectionView)
    .where(
      and(
        gte(analyticsSectionView.firstSeenAt, from),
        lt(analyticsSectionView.firstSeenAt, to),
        sql`${analyticsSectionView.pagePath} = ${path}`,
      ),
    )
    .groupBy(analyticsSectionView.sectionId);

  const observedMap = new Map(observed.map((r) => [r.sectionId, r]));
  const registered = getRegisteredSections(path);

  const sections = registered.map((def) => {
    const o = observedMap.get(def.id);
    return {
      id: def.id,
      label: def.label,
      registered: true,
      impressions: Number(o?.impressions ?? 0),
      uniqueVisitors: Number(o?.uniqueVisitors ?? 0),
      avgDwellMs: Number(o?.avgDwellMs ?? 0),
      avgVisiblePct: Number(o?.avgVisiblePct ?? 0),
    };
  });

  // Surface unregistered (drift detection).
  const registeredIds = new Set(registered.map((r) => r.id));
  for (const o of observed) {
    if (!registeredIds.has(o.sectionId)) {
      sections.push({
        id: o.sectionId,
        label: o.sectionId,
        registered: false,
        impressions: Number(o.impressions),
        uniqueVisitors: Number(o.uniqueVisitors),
        avgDwellMs: Number(o.avgDwellMs),
        avgVisiblePct: Number(o.avgVisiblePct),
      });
    }
  }

  const pageviews = Number(pvRow?.pageviews ?? 0);
  const uniqueVisitors = Number(pvRow?.uniqueVisitors ?? 0);

  return NextResponse.json({
    range: { from: from.toISOString(), to: to.toISOString() },
    path,
    pages: listAllRegisteredPaths(),
    pageviews,
    uniqueVisitors,
    sections: sections.map((s) => ({
      ...s,
      reachPct:
        uniqueVisitors > 0 ? (s.uniqueVisitors / uniqueVisitors) * 100 : 0,
    })),
  });
}
