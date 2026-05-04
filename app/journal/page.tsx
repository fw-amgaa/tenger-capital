import type { Metadata } from "next";
import { eq, sql } from "drizzle-orm";
import { ScrollControlProvider } from "@/components/scroll-control";
import Header from "@/components/sections/header";
import Footer from "@/components/sections/footer";
import { db } from "@/lib/db";
import { journalPost } from "@/lib/db/schema";
import { rowToJournalPost } from "@/lib/journal/data";
import JournalListPage from "./journal-page";
import "./journal.css";

export const metadata: Metadata = {
  title: "The Tenger Journal — Шинжилгээ, бичвэр, хөрөнгө оруулалтын ой санамж",
  description:
    "Хөрөнгө оруулалт, эдийн засаг, санхүүгийн боловсрол. Тэнгэр Капиталын редакцын баг долоо хоног бүр шинэ дугаар хүргэнэ.",
};

export const dynamic = "force-dynamic";
export const revalidate = 60;

export default async function Page() {
  const rows = await db
    .select()
    .from(journalPost)
    .where(eq(journalPost.published, true))
    .orderBy(
      sql`COALESCE(${journalPost.publishedAt}, ${journalPost.createdAt}) DESC`,
    );

  const posts = rows.map(rowToJournalPost);

  return (
    <ScrollControlProvider>
      <Header headerMode="light" />
      <div className="j-root">
        <JournalListPage posts={posts} />
        <Footer />
      </div>
    </ScrollControlProvider>
  );
}
