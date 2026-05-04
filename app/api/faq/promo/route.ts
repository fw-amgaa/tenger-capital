import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { faqPromo } from "@/lib/db/schema";
import { FAQ_PROMO_SINGLETON_ID } from "@/lib/faq/data";

const TEXT_FIELDS = [
  "eyebrowMn",
  "eyebrowEn",
  "metaMn",
  "metaEn",
  "titleMn",
  "titleEn",
  "blurbMn",
  "blurbEn",
  "ctaMn",
  "ctaEn",
  "glyph",
  "cornerLabel",
] as const;

export async function GET() {
  const rows = await db
    .select()
    .from(faqPromo)
    .where(eq(faqPromo.id, FAQ_PROMO_SINGLETON_ID))
    .limit(1);
  return NextResponse.json(rows[0] ?? null);
}

export async function PATCH(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const update: Record<string, unknown> = { updatedAt: new Date() };
  const insertValues: Record<string, unknown> = {
    id: FAQ_PROMO_SINGLETON_ID,
  };
  for (const field of TEXT_FIELDS) {
    if (field in body) {
      const v = String(body[field] ?? "");
      update[field] = v;
      insertValues[field] = v;
    }
  }
  if ("enabled" in body) {
    update.enabled = !!body.enabled;
    insertValues.enabled = !!body.enabled;
  }

  const existing = await db
    .select({ id: faqPromo.id })
    .from(faqPromo)
    .where(eq(faqPromo.id, FAQ_PROMO_SINGLETON_ID))
    .limit(1);

  if (existing.length === 0) {
    const [row] = await db
      .insert(faqPromo)
      .values(insertValues as typeof faqPromo.$inferInsert)
      .returning();
    return NextResponse.json(row);
  }

  const [row] = await db
    .update(faqPromo)
    .set(update)
    .where(eq(faqPromo.id, FAQ_PROMO_SINGLETON_ID))
    .returning();
  return NextResponse.json(row);
}
