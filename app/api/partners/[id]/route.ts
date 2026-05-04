import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { partnerPage } from "@/lib/db/schema";
import { getPartnerPageById, slugify } from "@/lib/partners/data";

const STRING_FIELDS: (keyof typeof partnerPage.$inferInsert)[] = [
  "slug",
  "nameMn",
  "nameEn",
  "partnerLogoUrl",
  "tengerLogoUrl",
  "primaryColor",
  "pdfUrl",
  "pdfCtaLabelMn",
  "pdfCtaLabelEn",
  "orderUrl",
  "orderCtaLabelMn",
  "orderCtaLabelEn",
  "heroEyebrowMn",
  "heroEyebrowEn",
  "heroTitleMn",
  "heroTitleEn",
  "heroSubtitleMn",
  "heroSubtitleEn",
  "introTitleMn",
  "introTitleEn",
  "introHtmlMn",
  "introHtmlEn",
  "conditionsTitleMn",
  "conditionsTitleEn",
  "conditionsLedeMn",
  "conditionsLedeEn",
  "downloadTitleMn",
  "downloadTitleEn",
  "downloadDescMn",
  "downloadDescEn",
  "faqTitleMn",
  "faqTitleEn",
  "footerSubscribeTitleMn",
  "footerSubscribeTitleEn",
  "footerLinksTitleMn",
  "footerLinksTitleEn",
  "footerEmail",
  "footerPhone",
];

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const bundle = await getPartnerPageById(id);
  if (!bundle) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (!bundle.page.published) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
  }
  return NextResponse.json(bundle);
}

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  const existing = await db
    .select()
    .from(partnerPage)
    .where(eq(partnerPage.id, id))
    .limit(1);
  if (existing.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json().catch(() => ({}));
  type Update = Partial<typeof partnerPage.$inferInsert>;
  const next: Update = { updatedAt: new Date() };

  for (const k of STRING_FIELDS) {
    if (k in body) (next as Record<string, unknown>)[k] = body[k] ?? null;
  }
  if ("slug" in body && typeof body.slug === "string" && body.slug.trim()) {
    next.slug = slugify(body.slug);
  }
  if ("published" in body) next.published = !!body.published;

  const updated = await db
    .update(partnerPage)
    .set(next)
    .where(eq(partnerPage.id, id))
    .returning();

  return NextResponse.json(updated[0]);
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  await db.delete(partnerPage).where(eq(partnerPage.id, id));
  return NextResponse.json({ success: true });
}
