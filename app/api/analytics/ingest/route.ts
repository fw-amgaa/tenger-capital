import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  analyticsVisitor,
  analyticsSession,
  analyticsPageview,
  analyticsSectionView,
  analyticsEvent,
} from "@/lib/db/schema";
import {
  clamp,
  extractReferrerHost,
  isAdminCookiePresent,
  isBotUserAgent,
  isUuid,
  parseUserAgent,
  readGeoHeaders,
  safePath,
  safeText,
} from "@/lib/analytics/server-utils";
import type {
  IngestEvent,
  IngestPageview,
  IngestPayload,
  IngestSection,
} from "@/lib/analytics/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_ITEMS = 100;
const MAX_BODY_BYTES = 64 * 1024;

export async function POST(request: Request) {
  // Admin cookie short-circuit (cheap exclusion).
  if (isAdminCookiePresent(request.headers.get("cookie"))) {
    return new NextResponse(null, { status: 204 });
  }

  const ua = request.headers.get("user-agent");
  if (isBotUserAgent(ua)) {
    return new NextResponse(null, { status: 204 });
  }

  // Body size guard.
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  }

  let payload: IngestPayload;
  try {
    payload = (await request.json()) as IngestPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!isUuid(payload.visitorId) || !isUuid(payload.sessionId)) {
    return NextResponse.json({ error: "Invalid IDs" }, { status: 400 });
  }

  const items = Array.isArray(payload.items) ? payload.items.slice(0, MAX_ITEMS) : [];
  if (items.length === 0 && !payload.init) {
    return new NextResponse(null, { status: 204 });
  }

  const { device, os, browser } = parseUserAgent(ua || "");
  const geo = readGeoHeaders(request.headers);
  const language = safeText(payload.init?.language, 8) || null;
  const init = payload.init;

  // Compute aggregate deltas client supplied as items.
  const pageviewItems = items.filter(
    (i): i is IngestPageview => i.kind === "pageview",
  );
  const sectionItems = items.filter(
    (i): i is IngestSection => i.kind === "section",
  );
  const eventItems = items.filter(
    (i): i is IngestEvent => i.kind === "event",
  );

  const pageviewDeltaCount = pageviewItems.length;
  const totalDurationDelta = pageviewItems.reduce(
    (acc, p) => acc + clamp(p.durationMs ?? 0, 0, 60 * 60 * 1000),
    0,
  );
  const lastPageview = pageviewItems[pageviewItems.length - 1];
  const lastEndedAt = pageviewItems.reduce<Date | null>((acc, p) => {
    const t = p.endedAt ?? p.startedAt;
    if (!t) return acc;
    const d = new Date(t);
    if (Number.isNaN(d.getTime())) return acc;
    return acc && acc > d ? acc : d;
  }, null);

  try {
    // 1. Upsert visitor.
    await db
      .insert(analyticsVisitor)
      .values({
        id: payload.visitorId,
        country: geo.country,
        region: geo.region,
        city: geo.city,
        device,
        os,
        browser,
        language,
        userAgent: safeText(ua, 512),
      })
      .onConflictDoUpdate({
        target: analyticsVisitor.id,
        set: {
          lastSeenAt: new Date(),
          country: sql`coalesce(${analyticsVisitor.country}, excluded.country)`,
          region: sql`coalesce(${analyticsVisitor.region}, excluded.region)`,
          city: sql`coalesce(${analyticsVisitor.city}, excluded.city)`,
          device,
          os,
          browser,
          language: sql`coalesce(excluded.language, ${analyticsVisitor.language})`,
        },
      });

    // 2. Upsert session.
    const referrer = init?.referrer ?? null;
    const referrerHost = extractReferrerHost(referrer);

    await db
      .insert(analyticsSession)
      .values({
        id: payload.sessionId,
        visitorId: payload.visitorId,
        landingPath: init?.landingPath ? safePath(init.landingPath) : "/",
        exitPath: lastPageview ? safePath(lastPageview.path) : null,
        referrer: safeText(referrer, 1024),
        referrerHost,
        utmSource: safeText(init?.utmSource, 128),
        utmMedium: safeText(init?.utmMedium, 128),
        utmCampaign: safeText(init?.utmCampaign, 128),
        utmTerm: safeText(init?.utmTerm, 128),
        utmContent: safeText(init?.utmContent, 128),
        language,
        country: geo.country,
        region: geo.region,
        city: geo.city,
        device,
        os,
        browser,
        pageviews: pageviewDeltaCount,
        durationMs: totalDurationDelta,
        isBounce: pageviewDeltaCount <= 1,
        endedAt: lastEndedAt,
      })
      .onConflictDoUpdate({
        target: analyticsSession.id,
        set: {
          pageviews: sql`${analyticsSession.pageviews} + ${pageviewDeltaCount}`,
          durationMs: sql`${analyticsSession.durationMs} + ${totalDurationDelta}`,
          endedAt: sql`coalesce(excluded.ended_at, ${analyticsSession.endedAt})`,
          exitPath: sql`coalesce(excluded.exit_path, ${analyticsSession.exitPath})`,
          isBounce: sql`(${analyticsSession.pageviews} + ${pageviewDeltaCount}) <= 1`,
          country: sql`coalesce(${analyticsSession.country}, excluded.country)`,
          region: sql`coalesce(${analyticsSession.region}, excluded.region)`,
          city: sql`coalesce(${analyticsSession.city}, excluded.city)`,
        },
      });

    // 3. Pageviews (upsert by id so beacon updates work).
    if (pageviewItems.length > 0) {
      const rows = pageviewItems
        .filter((p) => isUuid(p.id))
        .map((p) => ({
          id: p.id,
          sessionId: payload.sessionId,
          visitorId: payload.visitorId,
          path: safePath(p.path),
          query: safeText(p.query, 512),
          title: safeText(p.title, 256),
          startedAt: new Date(p.startedAt),
          endedAt: p.endedAt ? new Date(p.endedAt) : null,
          durationMs:
            p.durationMs != null ? clamp(p.durationMs, 0, 60 * 60 * 1000) : null,
          maxScrollPct: clamp(p.maxScrollPct ?? 0, 0, 100),
          viewportW: p.viewportW ?? null,
          viewportH: p.viewportH ?? null,
          isExit: !!p.isExit,
        }));
      if (rows.length > 0) {
        await db
          .insert(analyticsPageview)
          .values(rows)
          .onConflictDoUpdate({
            target: analyticsPageview.id,
            set: {
              endedAt: sql`coalesce(excluded.ended_at, ${analyticsPageview.endedAt})`,
              durationMs: sql`coalesce(excluded.duration_ms, ${analyticsPageview.durationMs})`,
              maxScrollPct: sql`greatest(${analyticsPageview.maxScrollPct}, excluded.max_scroll_pct)`,
              isExit: sql`excluded.is_exit or ${analyticsPageview.isExit}`,
            },
          });
      }
    }

    // 4. Section views (upsert by id; merge dwell + visibility).
    if (sectionItems.length > 0) {
      const rows = sectionItems
        .filter((s) => isUuid(s.id) && isUuid(s.pageviewId))
        .map((s) => ({
          id: s.id,
          pageviewId: s.pageviewId,
          sessionId: payload.sessionId,
          visitorId: payload.visitorId,
          pagePath: safePath(s.pagePath),
          sectionId: safeText(s.sectionId, 64) || "unknown",
          firstSeenAt: new Date(s.firstSeenAt),
          lastSeenAt: new Date(s.lastSeenAt),
          dwellMs: clamp(s.dwellMs, 0, 6 * 60 * 60 * 1000),
          maxVisiblePct: clamp(s.maxVisiblePct, 0, 100),
        }));
      if (rows.length > 0) {
        await db
          .insert(analyticsSectionView)
          .values(rows)
          .onConflictDoUpdate({
            target: analyticsSectionView.id,
            set: {
              lastSeenAt: sql`greatest(excluded.last_seen_at, ${analyticsSectionView.lastSeenAt})`,
              dwellMs: sql`greatest(excluded.dwell_ms, ${analyticsSectionView.dwellMs})`,
              maxVisiblePct: sql`greatest(excluded.max_visible_pct, ${analyticsSectionView.maxVisiblePct})`,
            },
          });
      }
    }

    // 5. Generic events.
    if (eventItems.length > 0) {
      const rows = eventItems
        .filter((e) => isUuid(e.id))
        .map((e) => ({
          id: e.id,
          sessionId: payload.sessionId,
          visitorId: payload.visitorId,
          pageviewId: isUuid(e.pageviewId) ? e.pageviewId : null,
          type: safeText(e.type, 64) || "unknown",
          name: safeText(e.name, 128),
          target: safeText(e.target, 256),
          value: safeText(e.value, 256),
          payload: e.payload ?? null,
          path: e.path ? safePath(e.path) : null,
          occurredAt: new Date(e.occurredAt),
        }));
      if (rows.length > 0) {
        await db
          .insert(analyticsEvent)
          .values(rows)
          .onConflictDoNothing({ target: analyticsEvent.id });
      }
    }

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error("[analytics ingest] failed", err);
    return NextResponse.json({ error: "Ingest failed" }, { status: 500 });
  }
}
