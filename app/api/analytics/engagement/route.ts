import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { and, gte, lt, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { analyticsEvent, analyticsPageview } from "@/lib/db/schema";
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

const SCROLL_BUCKETS = [
  { label: "0-25%", min: 0, max: 25 },
  { label: "25-50%", min: 25, max: 50 },
  { label: "50-75%", min: 50, max: 75 },
  { label: "75-99%", min: 75, max: 99 },
  { label: "100%", min: 99, max: 101 },
];

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const { from, to } = parseRange(url);

  const ctaRows = await db
    .select({
      name: analyticsEvent.name,
      target: analyticsEvent.target,
      type: analyticsEvent.type,
      clicks: sql<number>`count(*)::int`,
      uniqueSessions: sql<number>`count(distinct ${analyticsEvent.sessionId})::int`,
    })
    .from(analyticsEvent)
    .where(
      and(
        gte(analyticsEvent.occurredAt, from),
        lt(analyticsEvent.occurredAt, to),
        sql`${analyticsEvent.type} in ('cta_click', 'button_click', 'link_click', 'outbound_click', 'mailto_click', 'tel_click')`,
      ),
    )
    .groupBy(analyticsEvent.name, analyticsEvent.target, analyticsEvent.type)
    .orderBy(sql`count(*) desc`)
    .limit(50);

  const outbound = await db
    .select({
      target: analyticsEvent.target,
      clicks: sql<number>`count(*)::int`,
    })
    .from(analyticsEvent)
    .where(
      and(
        gte(analyticsEvent.occurredAt, from),
        lt(analyticsEvent.occurredAt, to),
        sql`${analyticsEvent.type} = 'outbound_click'`,
      ),
    )
    .groupBy(analyticsEvent.target)
    .orderBy(sql`count(*) desc`)
    .limit(20);

  const rage = await db
    .select({
      target: analyticsEvent.target,
      path: analyticsEvent.path,
      occurrences: sql<number>`count(*)::int`,
    })
    .from(analyticsEvent)
    .where(
      and(
        gte(analyticsEvent.occurredAt, from),
        lt(analyticsEvent.occurredAt, to),
        sql`${analyticsEvent.type} = 'rage_click'`,
      ),
    )
    .groupBy(analyticsEvent.target, analyticsEvent.path)
    .orderBy(sql`count(*) desc`)
    .limit(20);

  const scrollMilestones = await db
    .select({
      milestone: analyticsEvent.value,
      count: sql<number>`count(*)::int`,
    })
    .from(analyticsEvent)
    .where(
      and(
        gte(analyticsEvent.occurredAt, from),
        lt(analyticsEvent.occurredAt, to),
        sql`${analyticsEvent.type} = 'scroll_milestone'`,
      ),
    )
    .groupBy(analyticsEvent.value);

  // Scroll distribution from pageview.maxScrollPct.
  const pageviewBuckets = await Promise.all(
    SCROLL_BUCKETS.map(async (b) => {
      const [row] = await db
        .select({
          count: sql<number>`count(*)::int`,
        })
        .from(analyticsPageview)
        .where(
          and(
            gte(analyticsPageview.startedAt, from),
            lt(analyticsPageview.startedAt, to),
            sql`${analyticsPageview.maxScrollPct} >= ${b.min}`,
            sql`${analyticsPageview.maxScrollPct} < ${b.max}`,
          ),
        );
      return { label: b.label, count: Number(row?.count ?? 0) };
    }),
  );

  return NextResponse.json({
    range: { from: from.toISOString(), to: to.toISOString() },
    ctas: ctaRows.map((r) => ({
      name: r.name,
      target: r.target,
      type: r.type,
      clicks: Number(r.clicks),
      uniqueSessions: Number(r.uniqueSessions),
    })),
    outbound: outbound.map((r) => ({
      target: r.target,
      clicks: Number(r.clicks),
    })),
    rage: rage.map((r) => ({
      target: r.target,
      path: r.path,
      occurrences: Number(r.occurrences),
    })),
    scrollMilestones: scrollMilestones.map((r) => ({
      milestone: r.milestone,
      count: Number(r.count),
    })),
    scrollDistribution: pageviewBuckets,
  });
}
