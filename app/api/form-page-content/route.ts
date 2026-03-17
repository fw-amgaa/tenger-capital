import { db } from "@/lib/db";
import { formPageContent } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const content = await db
    .select()
    .from(formPageContent)
    .where(eq(formPageContent.id, "singleton"))
    .limit(1);

  return NextResponse.json(content[0] || null);
}

export async function PUT(req: Request) {
  const { title, titleEn, description, descriptionEn, paragraphs, paragraphsEn, images } = await req.json();

  await db
    .insert(formPageContent)
    .values({
      id: "singleton",
      title: title || null,
      titleEn: titleEn || null,
      description: description || null,
      descriptionEn: descriptionEn || null,
      paragraphs: paragraphs || [],
      paragraphsEn: paragraphsEn || [],
      images: images || [],
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: formPageContent.id,
      set: {
        title: title || null,
        titleEn: titleEn || null,
        description: description || null,
        descriptionEn: descriptionEn || null,
        paragraphs: paragraphs || [],
        paragraphsEn: paragraphsEn || [],
        images: images || [],
        updatedAt: new Date(),
      },
    });

  return NextResponse.json({ success: true });
}
