import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { desc, gte, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { analyticsEvent } from "@/lib/db/schema";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cutoff = new Date(Date.now() - 5 * 60 * 1000);

  // Active visitors: latest pageview per visitor in last 5 min.
  const visitors = await db.execute(sql`
    SELECT DISTINCT ON (p.visitor_id)
      p.visitor_id as visitor_id,
      p.session_id as session_id,
      p.path as path,
      p.started_at as started_at,
      coalesce(p.duration_ms, extract(epoch from (now() - p.started_at)) * 1000) as duration_ms,
      s.country as country,
      s.region as region,
      s.city as city,
      s.device as device,
      s.browser as browser
    FROM analytics_pageview p
    LEFT JOIN analytics_session s ON s.id = p.session_id
    WHERE p.started_at >= ${cutoff}
    ORDER BY p.visitor_id, p.started_at DESC
    LIMIT 100
  `);

  // Last 30 events for the activity feed.
  const events = await db
    .select({
      id: analyticsEvent.id,
      type: analyticsEvent.type,
      name: analyticsEvent.name,
      target: analyticsEvent.target,
      path: analyticsEvent.path,
      occurredAt: analyticsEvent.occurredAt,
    })
    .from(analyticsEvent)
    .where(gte(analyticsEvent.occurredAt, cutoff))
    .orderBy(desc(analyticsEvent.occurredAt))
    .limit(30);

  type Row = {
    visitor_id: string;
    session_id: string;
    path: string;
    started_at: Date | string;
    duration_ms: string | number;
    country: string | null;
    region: string | null;
    city: string | null;
    device: string | null;
    browser: string | null;
  };

  const rows = ((visitors as unknown) as { rows: Row[] }).rows ??
    ((visitors as unknown) as Row[]);

  return NextResponse.json({
    cutoff: cutoff.toISOString(),
    visitors: (rows as Row[]).map((r) => ({
      visitorId: r.visitor_id,
      sessionId: r.session_id,
      path: r.path,
      startedAt: new Date(r.started_at).toISOString(),
      durationMs: Number(r.duration_ms),
      country: r.country,
      region: r.region,
      city: r.city,
      device: r.device,
      browser: r.browser,
    })),
    events: events.map((e) => ({
      id: e.id,
      type: e.type,
      name: e.name,
      target: e.target,
      path: e.path,
      occurredAt: e.occurredAt,
    })),
  });
}
