import { NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { journalPost } from "@/lib/db/schema";

export async function POST(
  _req: Request,
  ctx: { params: Promise<{ slug: string }> },
) {
  const { slug } = await ctx.params;
  const result = await db
    .update(journalPost)
    .set({ views: sql`${journalPost.views} + 1` })
    .where(eq(journalPost.slug, slug))
    .returning({ views: journalPost.views });

  if (result.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ views: result[0].views });
}
