import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { asc, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { partnerPage } from "@/lib/db/schema";
import { slugify } from "@/lib/partners/data";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const includeDrafts = url.searchParams.get("drafts") === "1";

  const session = includeDrafts
    ? await auth.api.getSession({ headers: await headers() })
    : null;
  const isAdmin = !!session?.user;

  const where =
    !isAdmin || !includeDrafts ? eq(partnerPage.published, true) : undefined;

  const rows = await db
    .select()
    .from(partnerPage)
    .where(where)
    .orderBy(asc(partnerPage.createdAt));

  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const nameMn = String(body.nameMn ?? "").trim();
  const nameEn = String(body.nameEn ?? "").trim();
  if (!nameMn && !nameEn) {
    return NextResponse.json(
      { error: "Name is required (Mongolian or English)" },
      { status: 400 },
    );
  }

  const baseSlug =
    slugify(body.slug || nameEn || nameMn) || `partner-${Date.now()}`;
  let slug = baseSlug;
  let suffix = 1;
  while (true) {
    const existing = await db
      .select({ id: partnerPage.id })
      .from(partnerPage)
      .where(eq(partnerPage.slug, slug))
      .limit(1);
    if (existing.length === 0) break;
    slug = `${baseSlug}-${++suffix}`;
  }

  const [row] = await db
    .insert(partnerPage)
    .values({
      slug,
      nameMn,
      nameEn,
      primaryColor: String(body.primaryColor || "#f5875a"),
      published: false,
    })
    .returning();

  return NextResponse.json(row, { status: 201 });
}
