import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { faqCategory } from "@/lib/db/schema";

const TEXT_FIELDS = [
  "icon",
  "labelMn",
  "labelEn",
  "introMn",
  "introEn",
  "videoTitleMn",
  "videoTitleEn",
  "videoDuration",
  "videoThumb",
  "videoThumbNote",
  "accent",
  "slug",
] as const;

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const rows = await db
    .select()
    .from(faqCategory)
    .where(eq(faqCategory.id, id))
    .limit(1);
  if (rows.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(rows[0]);
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
  const body = await req.json().catch(() => ({}));
  const update: Record<string, unknown> = {
    updatedAt: new Date(),
  };
  for (const field of TEXT_FIELDS) {
    if (field in body) update[field] = String(body[field] ?? "");
  }
  if ("sortOrder" in body && Number.isFinite(body.sortOrder)) {
    update.sortOrder = Number(body.sortOrder);
  }
  if ("published" in body) update.published = !!body.published;

  const [row] = await db
    .update(faqCategory)
    .set(update)
    .where(eq(faqCategory.id, id))
    .returning();

  if (!row) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(row);
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
  await db.delete(faqCategory).where(eq(faqCategory.id, id));
  return NextResponse.json({ ok: true });
}
