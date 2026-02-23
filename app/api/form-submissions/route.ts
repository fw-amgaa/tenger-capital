import { db } from "@/lib/db";
import { formSubmission } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const submissions = await db
    .select()
    .from(formSubmission)
    .orderBy(desc(formSubmission.createdAt));

  return NextResponse.json(submissions);
}

export async function POST(request: Request) {
  const body = await request.json();

  const newSubmission = await db
    .insert(formSubmission)
    .values({
      name: body.name,
      email: body.email,
      phone: body.phone,
      hasAccount: body.hasAccount,
      investAmount: body.investAmount,
    })
    .returning();

  return NextResponse.json(newSubmission[0]);
}
