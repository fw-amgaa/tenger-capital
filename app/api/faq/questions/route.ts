import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { asc, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { faqQuestion } from "@/lib/db/schema";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const categoryId = url.searchParams.get("categoryId");

  const baseQuery = db
    .select()
    .from(faqQuestion)
    .orderBy(asc(faqQuestion.sortOrder), asc(faqQuestion.createdAt));

  const rows = categoryId
    ? await baseQuery.where(eq(faqQuestion.categoryId, categoryId))
    : await baseQuery;

  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const categoryId = String(body.categoryId ?? "").trim();
  if (!categoryId) {
    return NextResponse.json(
      { error: "categoryId required" },
      { status: 400 },
    );
  }

  const [row] = await db
    .insert(faqQuestion)
    .values({
      categoryId,
      qMn: String(body.qMn ?? ""),
      qEn: String(body.qEn ?? ""),
      aMn: String(body.aMn ?? ""),
      aEn: String(body.aEn ?? ""),
      helpful: Number.isFinite(body.helpful) ? Number(body.helpful) : 0,
      isPopular: !!body.isPopular,
      popularRank: Number.isFinite(body.popularRank)
        ? Number(body.popularRank)
        : null,
      sortOrder: Number.isFinite(body.sortOrder) ? Number(body.sortOrder) : 0,
      published: body.published === false ? false : true,
    })
    .returning();

  return NextResponse.json(row, { status: 201 });
}
