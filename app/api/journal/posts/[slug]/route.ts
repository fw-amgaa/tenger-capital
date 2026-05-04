import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { journalPost } from "@/lib/db/schema";
import { auth } from "@/lib/auth";

async function findBySlugOrId(slug: string) {
  const bySlug = await db
    .select()
    .from(journalPost)
    .where(eq(journalPost.slug, slug))
    .limit(1);
  if (bySlug.length > 0) return bySlug[0];
  // Fallback: dashboard pages may identify by uuid
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
  if (isUuid) {
    const byId = await db
      .select()
      .from(journalPost)
      .where(eq(journalPost.id, slug))
      .limit(1);
    return byId[0];
  }
  return undefined;
}

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ slug: string }> },
) {
  const { slug } = await ctx.params;
  const post = await findBySlugOrId(slug);
  if (!post) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (!post.published) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
  }
  return NextResponse.json(post);
}

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ slug: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await ctx.params;
  const existing = await findBySlugOrId(slug);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json();

  if (body.featured === true && !existing.featured) {
    await db
      .update(journalPost)
      .set({ featured: false })
      .where(eq(journalPost.featured, true));
  }

  const willPublish = body.published === true && !existing.published;
  type PostUpdate = Partial<typeof journalPost.$inferInsert>;
  const next: PostUpdate = {
    updatedAt: new Date(),
  };
  const stringFields: (keyof typeof journalPost.$inferInsert)[] = [
    "slug",
    "title",
    "titleEn",
    "excerpt",
    "excerptEn",
    "bodyHtml",
    "bodyHtmlEn",
    "lede",
    "ledeEn",
    "category",
    "author",
    "authorRole",
    "authorInitials",
    "coverImage",
  ];
  for (const k of stringFields) {
    if (k in body) (next as Record<string, unknown>)[k] = body[k] ?? null;
  }
  if ("tags" in body && Array.isArray(body.tags)) next.tags = body.tags;
  if ("readTime" in body && typeof body.readTime === "number")
    next.readTime = body.readTime;
  if ("featured" in body) next.featured = !!body.featured;
  if ("published" in body) {
    next.published = !!body.published;
    if (willPublish) next.publishedAt = new Date();
    if (body.published === false) next.publishedAt = null;
  }

  const updated = await db
    .update(journalPost)
    .set(next)
    .where(eq(journalPost.id, existing.id))
    .returning();

  return NextResponse.json(updated[0]);
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ slug: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await ctx.params;
  const existing = await findBySlugOrId(slug);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await db.delete(journalPost).where(eq(journalPost.id, existing.id));
  return NextResponse.json({ success: true });
}
