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

  const channels = await db
    .select({
      channel: sql<string>`
        case
          when ${analyticsSession.utmSource} is not null and ${analyticsSession.utmSource} <> '' then 'Кампанит'
          when ${analyticsSession.referrerHost} is null or ${analyticsSession.referrerHost} = '' then 'Шууд'
          when ${analyticsSession.referrerHost} ~ '(google|bing|yahoo|duckduckgo|yandex|baidu)' then 'Хайлт'
          when ${analyticsSession.referrerHost} ~ '(facebook|instagram|twitter|x\\.com|linkedin|t\\.co|tiktok|youtube)' then 'Сошиал'
          else 'Лавлагаа'
        end`,
      sessions: sql<number>`count(*)::int`,
      visitors: sql<number>`count(distinct ${analyticsSession.visitorId})::int`,
    })
    .from(analyticsSession)
    .where(whereTime)
    .groupBy(sql`1`)
    .orderBy(sql`count(*) desc`);

  const referrers = await db
    .select({
      host: analyticsSession.referrerHost,
      sessions: sql<number>`count(*)::int`,
      visitors: sql<number>`count(distinct ${analyticsSession.visitorId})::int`,
    })
    .from(analyticsSession)
    .where(
      and(
        whereTime,
        sql`${analyticsSession.referrerHost} is not null and ${analyticsSession.referrerHost} <> ''`,
      ),
    )
    .groupBy(analyticsSession.referrerHost)
    .orderBy(sql`count(*) desc`)
    .limit(50);

  const utm = await db
    .select({
      source: analyticsSession.utmSource,
      medium: analyticsSession.utmMedium,
      campaign: analyticsSession.utmCampaign,
      sessions: sql<number>`count(*)::int`,
      visitors: sql<number>`count(distinct ${analyticsSession.visitorId})::int`,
    })
    .from(analyticsSession)
    .where(
      and(
        whereTime,
        sql`coalesce(${analyticsSession.utmSource}, '') <> ''`,
      ),
    )
    .groupBy(
      analyticsSession.utmSource,
      analyticsSession.utmMedium,
      analyticsSession.utmCampaign,
    )
    .orderBy(sql`count(*) desc`)
    .limit(50);

  return NextResponse.json({
    range: { from: from.toISOString(), to: to.toISOString() },
    channels: channels.map((c) => ({
      channel: c.channel,
      sessions: Number(c.sessions),
      visitors: Number(c.visitors),
    })),
    referrers: referrers.map((r) => ({
      host: r.host,
      sessions: Number(r.sessions),
      visitors: Number(r.visitors),
    })),
    utm: utm.map((u) => ({
      source: u.source,
      medium: u.medium,
      campaign: u.campaign,
      sessions: Number(u.sessions),
      visitors: Number(u.visitors),
    })),
  });
}
