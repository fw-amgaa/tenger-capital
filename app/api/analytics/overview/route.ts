import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { and, gte, lt, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  analyticsPageview,
  analyticsSession,
  analyticsVisitor,
} from "@/lib/db/schema";
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

  // Daily series.
  const series = await db
    .select({
      day: sql<string>`to_char(date_trunc('day', ${analyticsSession.startedAt}), 'YYYY-MM-DD')`,
      visitors: sql<number>`count(distinct ${analyticsSession.visitorId})::int`,
      sessions: sql<number>`count(*)::int`,
      pageviews: sql<number>`coalesce(sum(${analyticsSession.pageviews}), 0)::int`,
      bounces: sql<number>`coalesce(sum(case when ${analyticsSession.isBounce} then 1 else 0 end), 0)::int`,
      durationMs: sql<number>`coalesce(sum(${analyticsSession.durationMs}), 0)::bigint`,
    })
    .from(analyticsSession)
    .where(
      and(gte(analyticsSession.startedAt, from), lt(analyticsSession.startedAt, to)),
    )
    .groupBy(sql`1`)
    .orderBy(sql`1`);

  // Totals.
  const [totals] = await db
    .select({
      visitors: sql<number>`count(distinct ${analyticsSession.visitorId})::int`,
      sessions: sql<number>`count(*)::int`,
      pageviews: sql<number>`coalesce(sum(${analyticsSession.pageviews}), 0)::int`,
      bounces: sql<number>`coalesce(sum(case when ${analyticsSession.isBounce} then 1 else 0 end), 0)::int`,
      durationMs: sql<number>`coalesce(sum(${analyticsSession.durationMs}), 0)::bigint`,
    })
    .from(analyticsSession)
    .where(
      and(gte(analyticsSession.startedAt, from), lt(analyticsSession.startedAt, to)),
    );

  // New visitors (first_seen inside the window).
  const [newVisitorsRow] = await db
    .select({
      newVisitors: sql<number>`count(*)::int`,
    })
    .from(analyticsVisitor)
    .where(
      and(
        gte(analyticsVisitor.firstSeenAt, from),
        lt(analyticsVisitor.firstSeenAt, to),
      ),
    );

  // Live: visitors with pageviews in the last 5 min.
  const liveCutoff = new Date(Date.now() - 5 * 60 * 1000);
  const [live] = await db
    .select({
      visitors: sql<number>`count(distinct ${analyticsPageview.visitorId})::int`,
      pageviews: sql<number>`count(*)::int`,
    })
    .from(analyticsPageview)
    .where(gte(analyticsPageview.startedAt, liveCutoff));

  return NextResponse.json({
    range: { from: from.toISOString(), to: to.toISOString() },
    totals: {
      visitors: Number(totals?.visitors ?? 0),
      newVisitors: Number(newVisitorsRow?.newVisitors ?? 0),
      sessions: Number(totals?.sessions ?? 0),
      pageviews: Number(totals?.pageviews ?? 0),
      bounces: Number(totals?.bounces ?? 0),
      durationMs: Number(totals?.durationMs ?? 0),
    },
    live: {
      visitors: Number(live?.visitors ?? 0),
      pageviews: Number(live?.pageviews ?? 0),
    },
    series: series.map((r) => ({
      day: r.day,
      visitors: Number(r.visitors),
      sessions: Number(r.sessions),
      pageviews: Number(r.pageviews),
      bounces: Number(r.bounces),
      durationMs: Number(r.durationMs),
    })),
  });
}
