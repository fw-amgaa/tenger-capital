import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { and, gte, lt, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { analyticsEvent } from "@/lib/db/schema";
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

const FIELD_LABELS: Record<string, string> = {
  name: "Нэр",
  email: "И-мэйл",
  phone: "Утас",
  hasAccount: "Данс эсэх",
  investAmount: "Хөрөнгө",
};

const FIELD_ORDER = ["name", "email", "phone", "hasAccount", "investAmount"];

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const { from, to } = parseRange(url);

  const whereTime = and(
    gte(analyticsEvent.occurredAt, from),
    lt(analyticsEvent.occurredAt, to),
    sql`${analyticsEvent.name} = 'submit_form'`,
  );

  // Counts per event type.
  const counts = await db
    .select({
      type: analyticsEvent.type,
      n: sql<number>`count(*)::int`,
    })
    .from(analyticsEvent)
    .where(whereTime)
    .groupBy(analyticsEvent.type);

  const get = (t: string) => Number(counts.find((c) => c.type === t)?.n ?? 0);
  const opens = get("form_open");
  const firstInputs = get("form_first_input");
  const submitAttempts = get("form_submit_attempt");
  const submitSuccess = get("form_submit_success");
  const submitErrors = get("form_submit_error");
  const abandons = get("form_abandon");

  // Field focus counts.
  const fieldFocusRows = await db
    .select({
      target: analyticsEvent.target,
      n: sql<number>`count(*)::int`,
      uniqueSessions: sql<number>`count(distinct ${analyticsEvent.sessionId})::int`,
    })
    .from(analyticsEvent)
    .where(
      and(
        whereTime,
        sql`${analyticsEvent.type} = 'form_field_focus'`,
      ),
    )
    .groupBy(analyticsEvent.target);

  // Abandon "last touched" field.
  const abandonByLastField = await db
    .select({
      target: analyticsEvent.target,
      n: sql<number>`count(*)::int`,
    })
    .from(analyticsEvent)
    .where(
      and(
        whereTime,
        sql`${analyticsEvent.type} = 'form_abandon'`,
      ),
    )
    .groupBy(analyticsEvent.target);

  // Time-to-first-input distribution.
  const ttfiRows = await db
    .select({
      value: analyticsEvent.value,
    })
    .from(analyticsEvent)
    .where(
      and(
        whereTime,
        sql`${analyticsEvent.type} = 'form_first_input'`,
      ),
    )
    .limit(5000);
  const ttfis = ttfiRows
    .map((r) => Number(r.value))
    .filter((n) => Number.isFinite(n) && n >= 0 && n < 30 * 60_000);
  ttfis.sort((a, b) => a - b);
  const median = ttfis.length
    ? ttfis[Math.floor(ttfis.length / 2)]
    : 0;
  const p90 =
    ttfis.length > 0 ? ttfis[Math.floor(ttfis.length * 0.9)] : 0;

  // Time-to-submit distribution.
  const ttsRows = await db
    .select({ value: analyticsEvent.value })
    .from(analyticsEvent)
    .where(
      and(
        whereTime,
        sql`${analyticsEvent.type} = 'form_submit_success'`,
      ),
    )
    .limit(5000);
  const ttss = ttsRows
    .map((r) => Number(r.value))
    .filter((n) => Number.isFinite(n) && n >= 0 && n < 60 * 60_000);
  ttss.sort((a, b) => a - b);
  const ttsMedian = ttss.length ? ttss[Math.floor(ttss.length / 2)] : 0;

  const fields = FIELD_ORDER.map((id) => {
    const focus = fieldFocusRows.find((f) => f.target === id);
    const abandonRow = abandonByLastField.find((a) => a.target === id);
    return {
      id,
      label: FIELD_LABELS[id] ?? id,
      focuses: Number(focus?.n ?? 0),
      uniqueSessions: Number(focus?.uniqueSessions ?? 0),
      abandonHere: Number(abandonRow?.n ?? 0),
    };
  });

  return NextResponse.json({
    range: { from: from.toISOString(), to: to.toISOString() },
    funnel: {
      opens,
      firstInputs,
      submitAttempts,
      submitSuccess,
      submitErrors,
      abandons,
    },
    completionRate: opens > 0 ? (submitSuccess / opens) * 100 : 0,
    timeToFirstInput: { median, p90, samples: ttfis.length },
    timeToSubmit: { median: ttsMedian, samples: ttss.length },
    fields,
  });
}
