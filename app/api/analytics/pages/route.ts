import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { and, gte, lt, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { analyticsPageview, analyticsSession } from "@/lib/db/schema";
import { auth } from "@/lib/auth";

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

  const rows = await db
    .select({
      path: analyticsPageview.path,
      pageviews: sql<number>`count(*)::int`,
      uniqueVisitors: sql<number>`count(distinct ${analyticsPageview.visitorId})::int`,
      avgDurationMs: sql<number>`coalesce(avg(${analyticsPageview.durationMs}), 0)::int`,
      avgScrollPct: sql<number>`coalesce(avg(${analyticsPageview.maxScrollPct}), 0)::int`,
      exits: sql<number>`coalesce(sum(case when ${analyticsPageview.isExit} then 1 else 0 end), 0)::int`,
    })
    .from(analyticsPageview)
    .where(
      and(
        gte(analyticsPageview.startedAt, from),
        lt(analyticsPageview.startedAt, to),
      ),
    )
    .groupBy(analyticsPageview.path)
    .orderBy(sql`count(*) desc`)
    .limit(100);

  // Bounces by landing path.
  const bounceRows = await db
    .select({
      path: analyticsSession.landingPath,
      bounces: sql<number>`coalesce(sum(case when ${analyticsSession.isBounce} then 1 else 0 end), 0)::int`,
      sessions: sql<number>`count(*)::int`,
    })
    .from(analyticsSession)
    .where(
      and(
        gte(analyticsSession.startedAt, from),
        lt(analyticsSession.startedAt, to),
      ),
    )
    .groupBy(analyticsSession.landingPath);

  const bounceMap = new Map(
    bounceRows
      .filter((r): r is typeof r & { path: string } => !!r.path)
      .map((r) => [r.path, { bounces: Number(r.bounces), sessions: Number(r.sessions) }]),
  );

  return NextResponse.json({
    range: { from: from.toISOString(), to: to.toISOString() },
    rows: rows.map((r) => {
      const b = bounceMap.get(r.path);
      const sessionsAsLanding = b?.sessions ?? 0;
      const bounces = b?.bounces ?? 0;
      const bounceRate =
        sessionsAsLanding > 0 ? (bounces / sessionsAsLanding) * 100 : 0;
      const exitRate = r.pageviews > 0 ? (Number(r.exits) / Number(r.pageviews)) * 100 : 0;
      return {
        path: r.path,
        pageviews: Number(r.pageviews),
        uniqueVisitors: Number(r.uniqueVisitors),
        avgDurationMs: Number(r.avgDurationMs),
        avgScrollPct: Number(r.avgScrollPct),
        bounceRate,
        exitRate,
        bounces,
        exits: Number(r.exits),
      };
    }),
  });
}
