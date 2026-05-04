import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { journalComment } from "@/lib/db/schema";
import { auth } from "@/lib/auth";

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const body = await req.json();

  type CommentUpdate = Partial<typeof journalComment.$inferInsert>;
  const next: CommentUpdate = {};
  if ("approved" in body) next.approved = !!body.approved;
  if ("isAuthor" in body) next.isAuthor = !!body.isAuthor;
  if ("body" in body && typeof body.body === "string") next.body = body.body;
  if ("likes" in body && typeof body.likes === "number") next.likes = body.likes;

  const updated = await db
    .update(journalComment)
    .set(next)
    .where(eq(journalComment.id, id))
    .returning();
  if (updated.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
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
  await db.delete(journalComment).where(eq(journalComment.id, id));
  return NextResponse.json({ success: true });
}
