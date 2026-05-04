import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { journalSubscriber } from "@/lib/db/schema";
import { auth } from "@/lib/auth";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  const body = await req.json();
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!email || !EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ error: "invalid email" }, { status: 400 });
  }
  const source =
    typeof body.source === "string" && body.source ? body.source : "journal-newsletter";

  const result = await db
    .insert(journalSubscriber)
    .values({ email, source })
    .onConflictDoNothing({ target: journalSubscriber.email })
    .returning();

  return NextResponse.json({
    success: true,
    duplicate: result.length === 0,
  });
}

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const rows = await db
    .select()
    .from(journalSubscriber)
    .orderBy(desc(journalSubscriber.createdAt));
  return NextResponse.json(rows);
}
