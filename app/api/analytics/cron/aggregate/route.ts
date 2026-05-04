import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RAW_RETENTION_DAYS = 90;
const VISITOR_RETENTION_DAYS = 365;

function dayBounds(d: Date): { start: Date; end: Date; key: string } {
  const start = new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0),
  );
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  const key = start.toISOString().slice(0, 10);
  return { start, end, key };
}

async function aggregateDay(day: Date) {
  const { start, end, key } = dayBounds(day);

  await db.execute(sql`
    INSERT INTO analytics_daily_overview
      (day, visitors, new_visitors, sessions, pageviews, bounces, total_duration_ms)
    SELECT
      ${key},
      count(distinct s.visitor_id)::int,
      (SELECT count(*)::int FROM analytics_visitor v
        WHERE v.first_seen_at >= ${start} AND v.first_seen_at < ${end}),
      count(*)::int,
      coalesce(sum(s.pageviews), 0)::int,
      coalesce(sum(case when s.is_bounce then 1 else 0 end), 0)::int,
      coalesce(sum(s.duration_ms), 0)::bigint
    FROM analytics_session s
    WHERE s.started_at >= ${start} AND s.started_at < ${end}
    HAVING count(*) > 0
    ON CONFLICT (day) DO UPDATE SET
      visitors = excluded.visitors,
      new_visitors = excluded.new_visitors,
      sessions = excluded.sessions,
      pageviews = excluded.pageviews,
      bounces = excluded.bounces,
      total_duration_ms = excluded.total_duration_ms
  `);

  await db.execute(sql`
    INSERT INTO analytics_daily_path
      (day, path, pageviews, unique_visitors, avg_duration_ms, bounces, exits)
    SELECT
      ${key},
      p.path,
      count(*)::int,
      count(distinct p.visitor_id)::int,
      coalesce(avg(p.duration_ms), 0)::int,
      coalesce(sum(case when s.is_bounce and s.landing_path = p.path then 1 else 0 end), 0)::int,
      coalesce(sum(case when p.is_exit then 1 else 0 end), 0)::int
    FROM analytics_pageview p
    JOIN analytics_session s ON s.id = p.session_id
    WHERE p.started_at >= ${start} AND p.started_at < ${end}
    GROUP BY p.path
    ON CONFLICT (day, path) DO UPDATE SET
      pageviews = excluded.pageviews,
      unique_visitors = excluded.unique_visitors,
      avg_duration_ms = excluded.avg_duration_ms,
      bounces = excluded.bounces,
      exits = excluded.exits
  `);

  await db.execute(sql`
    INSERT INTO analytics_daily_section
      (day, page_path, section_id, impressions, unique_visitors, avg_dwell_ms)
    SELECT
      ${key},
      sv.page_path,
      sv.section_id,
      count(*)::int,
      count(distinct sv.visitor_id)::int,
      coalesce(avg(sv.dwell_ms), 0)::int
    FROM analytics_section_view sv
    WHERE sv.first_seen_at >= ${start} AND sv.first_seen_at < ${end}
    GROUP BY sv.page_path, sv.section_id
    ON CONFLICT (day, page_path, section_id) DO UPDATE SET
      impressions = excluded.impressions,
      unique_visitors = excluded.unique_visitors,
      avg_dwell_ms = excluded.avg_dwell_ms
  `);

  await db.execute(sql`
    INSERT INTO analytics_daily_geo
      (day, country, region, city, visitors, sessions, pageviews)
    SELECT
      ${key},
      coalesce(s.country, 'ZZ'),
      coalesce(s.region, ''),
      coalesce(s.city, ''),
      count(distinct s.visitor_id)::int,
      count(*)::int,
      coalesce(sum(s.pageviews), 0)::int
    FROM analytics_session s
    WHERE s.started_at >= ${start} AND s.started_at < ${end}
    GROUP BY coalesce(s.country, 'ZZ'), coalesce(s.region, ''), coalesce(s.city, '')
    ON CONFLICT (day, country, region, city) DO UPDATE SET
      visitors = excluded.visitors,
      sessions = excluded.sessions,
      pageviews = excluded.pageviews
  `);

  await db.execute(sql`
    INSERT INTO analytics_daily_acquisition
      (day, referrer_host, utm_source, utm_medium, utm_campaign, visitors, sessions)
    SELECT
      ${key},
      coalesce(s.referrer_host, ''),
      coalesce(s.utm_source, ''),
      coalesce(s.utm_medium, ''),
      coalesce(s.utm_campaign, ''),
      count(distinct s.visitor_id)::int,
      count(*)::int
    FROM analytics_session s
    WHERE s.started_at >= ${start} AND s.started_at < ${end}
    GROUP BY coalesce(s.referrer_host, ''), coalesce(s.utm_source, ''),
             coalesce(s.utm_medium, ''), coalesce(s.utm_campaign, '')
    ON CONFLICT (day, referrer_host, utm_source, utm_medium, utm_campaign) DO UPDATE SET
      visitors = excluded.visitors,
      sessions = excluded.sessions
  `);

  await db.execute(sql`
    INSERT INTO analytics_daily_device
      (day, device, os, browser, language, sessions)
    SELECT
      ${key},
      coalesce(s.device, ''),
      coalesce(s.os, ''),
      coalesce(s.browser, ''),
      coalesce(s.language, ''),
      count(*)::int
    FROM analytics_session s
    WHERE s.started_at >= ${start} AND s.started_at < ${end}
    GROUP BY coalesce(s.device, ''), coalesce(s.os, ''),
             coalesce(s.browser, ''), coalesce(s.language, '')
    ON CONFLICT (day, device, os, browser, language) DO UPDATE SET
      sessions = excluded.sessions
  `);

  return key;
}

async function cleanup() {
  const cutoff = new Date(Date.now() - RAW_RETENTION_DAYS * 24 * 60 * 60 * 1000);
  const visitorCutoff = new Date(
    Date.now() - VISITOR_RETENTION_DAYS * 24 * 60 * 60 * 1000,
  );
  await db.execute(
    sql`DELETE FROM analytics_event WHERE occurred_at < ${cutoff}`,
  );
  await db.execute(
    sql`DELETE FROM analytics_section_view WHERE first_seen_at < ${cutoff}`,
  );
  await db.execute(
    sql`DELETE FROM analytics_pageview WHERE started_at < ${cutoff}`,
  );
  await db.execute(
    sql`DELETE FROM analytics_session WHERE started_at < ${cutoff}`,
  );
  await db.execute(
    sql`DELETE FROM analytics_visitor WHERE last_seen_at < ${visitorCutoff}`,
  );
}

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    // In dev with no secret, allow vercel-cron header or local
    return true;
  }
  const auth = request.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const dayParam = url.searchParams.get("day");
  const backfillDays = Math.max(1, Math.min(90, Number(url.searchParams.get("days") || 1)));

  const aggregated: string[] = [];
  try {
    if (dayParam) {
      const d = new Date(dayParam);
      if (Number.isNaN(d.getTime())) {
        return NextResponse.json({ error: "Bad day" }, { status: 400 });
      }
      aggregated.push(await aggregateDay(d));
    } else {
      // Aggregate `backfillDays` worth of days, ending with yesterday.
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
      for (let i = backfillDays - 1; i >= 0; i--) {
        const d = new Date(yesterday.getTime() - i * 24 * 60 * 60 * 1000);
        aggregated.push(await aggregateDay(d));
      }
    }
    await cleanup();
    return NextResponse.json({ ok: true, aggregated });
  } catch (err) {
    console.error("[analytics aggregate] failed", err);
    return NextResponse.json({ error: "Aggregate failed" }, { status: 500 });
  }
}
