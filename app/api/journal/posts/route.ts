import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { journalPost } from "@/lib/db/schema";
import { auth } from "@/lib/auth";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\p{Letter}\p{Number}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const includeDrafts = url.searchParams.get("drafts") === "1";
  const category = url.searchParams.get("category");

  const session = includeDrafts
    ? await auth.api.getSession({ headers: await headers() })
    : null;
  const isAdmin = !!session?.user;
  const filters = [];
  if (!isAdmin || !includeDrafts) filters.push(eq(journalPost.published, true));
  if (category && category !== "all")
    filters.push(eq(journalPost.category, category));

  const where = filters.length > 0 ? and(...filters) : undefined;

  const rows = await db
    .select()
    .from(journalPost)
    .where(where)
    .orderBy(
      sql`COALESCE(${journalPost.publishedAt}, ${journalPost.createdAt}) DESC`,
    );

  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  if (!body.title || typeof body.title !== "string") {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }

  const slugInput =
    typeof body.slug === "string" && body.slug.trim()
      ? slugify(body.slug)
      : slugify(body.title);
  if (!slugInput) {
    return NextResponse.json({ error: "invalid slug" }, { status: 400 });
  }

  // If marking this post as featured, un-feature any others first.
  if (body.featured) {
    await db
      .update(journalPost)
      .set({ featured: false })
      .where(eq(journalPost.featured, true));
  }

  const published = !!body.published;
  const inserted = await db
    .insert(journalPost)
    .values({
      slug: slugInput,
      title: body.title,
      titleEn: body.titleEn || null,
      excerpt: body.excerpt || "",
      excerptEn: body.excerptEn || null,
      bodyHtml: body.bodyHtml || "",
      bodyHtmlEn: body.bodyHtmlEn || null,
      lede: body.lede || "",
      ledeEn: body.ledeEn || null,
      category: body.category || "Шинжилгээ",
      tags: Array.isArray(body.tags) ? body.tags : [],
      author: body.author || "",
      authorRole: body.authorRole || "",
      authorInitials: body.authorInitials || "",
      coverImage: body.coverImage || null,
      readTime: typeof body.readTime === "number" ? body.readTime : 5,
      featured: !!body.featured,
      published,
      publishedAt: published ? new Date() : null,
    })
    .returning();

  return NextResponse.json(inserted[0]);
}
