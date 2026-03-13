import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { formPageContent } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";

export async function GET() {
  const content = await db
    .select()
    .from(formPageContent)
    .where(eq(formPageContent.id, "singleton"))
    .limit(1);

  return NextResponse.json(content[0] || null);
}

export async function PUT(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, description, paragraphs, images } = await req.json();

  await db
    .insert(formPageContent)
    .values({
      id: "singleton",
      title: title || null,
      description: description || null,
      paragraphs: paragraphs || [],
      images: images || [],
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: formPageContent.id,
      set: {
        title: title || null,
        description: description || null,
        paragraphs: paragraphs || [],
        images: images || [],
        updatedAt: new Date(),
      },
    });

  return NextResponse.json({ success: true });
}
