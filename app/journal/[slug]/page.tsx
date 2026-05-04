import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { eq, sql, and, ne } from "drizzle-orm";
import { ScrollControlProvider } from "@/components/scroll-control";
import Header from "@/components/sections/header";
import Footer from "@/components/sections/footer";
import { db } from "@/lib/db";
import { journalPost } from "@/lib/db/schema";
import { rowToJournalPost } from "@/lib/journal/data";
import ArticlePage from "./article-page";
import "../journal.css";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const rows = await db
    .select()
    .from(journalPost)
    .where(and(eq(journalPost.slug, slug), eq(journalPost.published, true)))
    .limit(1);
  const post = rows[0];
  if (!post) return { title: "The Tenger Journal" };
  return {
    title: `${post.title} — The Tenger Journal`,
    description: post.excerpt,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const rows = await db
    .select()
    .from(journalPost)
    .where(and(eq(journalPost.slug, slug), eq(journalPost.published, true)))
    .limit(1);
  const row = rows[0];
  if (!row) notFound();

  const post = rowToJournalPost(row);

  const relatedRows = await db
    .select()
    .from(journalPost)
    .where(
      and(eq(journalPost.published, true), ne(journalPost.id, row.id)),
    )
    .orderBy(
      sql`CASE WHEN ${journalPost.category} = ${row.category} THEN 0 ELSE 1 END`,
      sql`COALESCE(${journalPost.publishedAt}, ${journalPost.createdAt}) DESC`,
    )
    .limit(3);
  const related = relatedRows.map(rowToJournalPost);

  return (
    <ScrollControlProvider>
      <Header headerMode="light" />
      <div className="j-root">
        <ArticlePage post={post} related={related} />
        <Footer />
      </div>
    </ScrollControlProvider>
  );
}
