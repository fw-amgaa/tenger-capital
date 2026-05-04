import { notFound } from "next/navigation";
import { eq, asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { faqCategory, faqQuestion } from "@/lib/db/schema";
import CategoryEditor from "./category-editor";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const catRows = await db
    .select()
    .from(faqCategory)
    .where(eq(faqCategory.id, id))
    .limit(1);
  const cat = catRows[0];
  if (!cat) notFound();

  const questions = await db
    .select()
    .from(faqQuestion)
    .where(eq(faqQuestion.categoryId, id))
    .orderBy(asc(faqQuestion.sortOrder), asc(faqQuestion.createdAt));

  return <CategoryEditor cat={cat} questions={questions} />;
}
