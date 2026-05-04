import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { and, gte, lt, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { analyticsSession } from "@/lib/db/schema";
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

  const whereTime = and(
    gte(analyticsSession.startedAt, from),
    lt(analyticsSession.startedAt, to),
  );

  // Country breakdown.
  const countries = await db
    .select({
      country: analyticsSession.country,
      visitors: sql<number>`count(distinct ${analyticsSession.visitorId})::int`,
      sessions: sql<number>`count(*)::int`,
    })
    .from(analyticsSession)
    .where(whereTime)
    .groupBy(analyticsSession.country)
    .orderBy(sql`count(distinct ${analyticsSession.visitorId}) desc`);

  // Mongolia regions.
  const mnRegions = await db
    .select({
      region: analyticsSession.region,
      visitors: sql<number>`count(distinct ${analyticsSession.visitorId})::int`,
      sessions: sql<number>`count(*)::int`,
    })
    .from(analyticsSession)
    .where(
      and(
        whereTime,
        sql`${analyticsSession.country} = 'MN'`,
      ),
    )
    .groupBy(analyticsSession.region)
    .orderBy(sql`count(distinct ${analyticsSession.visitorId}) desc`);

  // UB cities (district guesses from city header).
  const ubCities = await db
    .select({
      city: analyticsSession.city,
      visitors: sql<number>`count(distinct ${analyticsSession.visitorId})::int`,
      sessions: sql<number>`count(*)::int`,
    })
    .from(analyticsSession)
    .where(
      and(
        whereTime,
        sql`${analyticsSession.country} = 'MN'`,
        sql`(${analyticsSession.region} = '1' or ${analyticsSession.city} ilike '%ulan%' or ${analyticsSession.city} ilike '%ulaanbaatar%')`,
      ),
    )
    .groupBy(analyticsSession.city)
    .orderBy(sql`count(distinct ${analyticsSession.visitorId}) desc`);

  // Devices.
  const devices = await db
    .select({
      device: analyticsSession.device,
      sessions: sql<number>`count(*)::int`,
    })
    .from(analyticsSession)
    .where(whereTime)
    .groupBy(analyticsSession.device)
    .orderBy(sql`count(*) desc`);

  // Browsers.
  const browsers = await db
    .select({
      browser: analyticsSession.browser,
      sessions: sql<number>`count(*)::int`,
    })
    .from(analyticsSession)
    .where(whereTime)
    .groupBy(analyticsSession.browser)
    .orderBy(sql`count(*) desc`);

  // OS.
  const oses = await db
    .select({
      os: analyticsSession.os,
      sessions: sql<number>`count(*)::int`,
    })
    .from(analyticsSession)
    .where(whereTime)
    .groupBy(analyticsSession.os)
    .orderBy(sql`count(*) desc`);

  // Languages.
  const languages = await db
    .select({
      language: analyticsSession.language,
      sessions: sql<number>`count(*)::int`,
    })
    .from(analyticsSession)
    .where(whereTime)
    .groupBy(analyticsSession.language)
    .orderBy(sql`count(*) desc`);

  return NextResponse.json({
    range: { from: from.toISOString(), to: to.toISOString() },
    countries: countries.map((c) => ({
      code: c.country,
      visitors: Number(c.visitors),
      sessions: Number(c.sessions),
    })),
    mongoliaRegions: mnRegions.map((r) => ({
      code: r.region,
      visitors: Number(r.visitors),
      sessions: Number(r.sessions),
    })),
    ubCities: ubCities.map((r) => ({
      city: r.city,
      visitors: Number(r.visitors),
      sessions: Number(r.sessions),
    })),
    devices: devices.map((d) => ({
      kind: d.device,
      sessions: Number(d.sessions),
    })),
    browsers: browsers.map((d) => ({
      kind: d.browser,
      sessions: Number(d.sessions),
    })),
    oses: oses.map((d) => ({ kind: d.os, sessions: Number(d.sessions) })),
    languages: languages.map((d) => ({
      kind: d.language,
      sessions: Number(d.sessions),
    })),
  });
}
