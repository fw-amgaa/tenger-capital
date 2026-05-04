import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { asc, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { faqCategory } from "@/lib/db/schema";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\p{Letter}\p{Number}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

export async function GET() {
  const rows = await db
    .select()
    .from(faqCategory)
    .orderBy(asc(faqCategory.sortOrder), asc(faqCategory.createdAt));
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const labelMn = String(body.labelMn ?? "").trim();
  const labelEn = String(body.labelEn ?? "").trim();
  if (!labelMn && !labelEn) {
    return NextResponse.json({ error: "Label required" }, { status: 400 });
  }

  const baseSlug = slugify(body.slug || labelEn || labelMn) || "category";
  let slug = baseSlug;
  let suffix = 1;
  while (true) {
    const existing = await db
      .select({ id: faqCategory.id })
      .from(faqCategory)
      .where(eq(faqCategory.slug, slug))
      .limit(1);
    if (existing.length === 0) break;
    slug = `${baseSlug}-${++suffix}`;
  }

  const [row] = await db
    .insert(faqCategory)
    .values({
      slug,
      icon: String(body.icon ?? ""),
      labelMn,
      labelEn,
      introMn: String(body.introMn ?? ""),
      introEn: String(body.introEn ?? ""),
      videoTitleMn: String(body.videoTitleMn ?? ""),
      videoTitleEn: String(body.videoTitleEn ?? ""),
      videoDuration: String(body.videoDuration ?? ""),
      videoThumb: String(body.videoThumb ?? ""),
      videoThumbNote: String(body.videoThumbNote ?? ""),
      accent: String(body.accent ?? "#f5875a"),
      sortOrder: Number.isFinite(body.sortOrder) ? Number(body.sortOrder) : 0,
      published: body.published === false ? false : true,
    })
    .returning();

  return NextResponse.json(row, { status: 201 });
}
