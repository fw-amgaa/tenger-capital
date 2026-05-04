import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { and, asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { journalComment, journalPost } from "@/lib/db/schema";
import { auth } from "@/lib/auth";

function makeInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const postId = url.searchParams.get("postId");
  const slug = url.searchParams.get("slug");
  const all = url.searchParams.get("all") === "1";

  const session = all
    ? await auth.api.getSession({ headers: await headers() })
    : null;
  const isAdmin = !!session?.user;

  let resolvedPostId = postId;
  if (!resolvedPostId && slug) {
    const post = await db
      .select({ id: journalPost.id })
      .from(journalPost)
      .where(eq(journalPost.slug, slug))
      .limit(1);
    resolvedPostId = post[0]?.id ?? null;
  }

  const filters = [];
  if (resolvedPostId) filters.push(eq(journalComment.postId, resolvedPostId));
  if (!isAdmin || !all) filters.push(eq(journalComment.approved, true));
  const where = filters.length > 0 ? and(...filters) : undefined;

  const rows = await db
    .select()
    .from(journalComment)
    .where(where)
    .orderBy(asc(journalComment.createdAt));

  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const body = await req.json();
  const slug = typeof body.slug === "string" ? body.slug : null;
  const postId = typeof body.postId === "string" ? body.postId : null;
  const authorName = typeof body.authorName === "string" ? body.authorName.trim() : "";
  const text = typeof body.body === "string" ? body.body.trim() : "";
  const parentId = typeof body.parentId === "string" ? body.parentId : null;

  if (!authorName || !text) {
    return NextResponse.json(
      { error: "authorName and body are required" },
      { status: 400 },
    );
  }
  if (text.length > 4000) {
    return NextResponse.json({ error: "comment too long" }, { status: 400 });
  }

  let resolvedPostId = postId;
  if (!resolvedPostId && slug) {
    const post = await db
      .select({ id: journalPost.id })
      .from(journalPost)
      .where(eq(journalPost.slug, slug))
      .limit(1);
    resolvedPostId = post[0]?.id ?? null;
  }
  if (!resolvedPostId) {
    return NextResponse.json({ error: "post not found" }, { status: 404 });
  }

  const inserted = await db
    .insert(journalComment)
    .values({
      postId: resolvedPostId,
      parentId,
      authorName,
      authorInitials: makeInitials(authorName),
      body: text,
    })
    .returning();

  return NextResponse.json(inserted[0]);
}
