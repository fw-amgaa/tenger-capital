"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import BlogCard from "../blog-card";
import GradientBorderButton from "../gradient-border-button";
import Seperator from "../seperator";
import { useLanguage } from "@/lib/language-context";
import type { JournalPost } from "@/lib/journal/data";

type JournalPostApiRow = {
  id: string;
  slug: string;
  title: string;
  category: string;
  tags: string[];
  coverImage: string | null;
  publishedAt: string | null;
  createdAt: string;
};

const FALLBACK_IMAGE = "/mockups/blogs/1.avif";

function apiRowToCardPost(row: JournalPostApiRow): JournalPost {
  const date = (row.publishedAt ?? row.createdAt).slice(0, 10);
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: "",
    category: row.category,
    tags: row.tags ?? [],
    author: "",
    authorRole: "",
    initials: "",
    date,
    readTime: "",
    views: "",
    image: row.coverImage || FALLBACK_IMAGE,
    coverGrad: "",
    coverNote: "",
  };
}

const FALLBACK_POSTS: JournalPost[] = [
  {
    id: "fallback-1",
    slug: "rsus-explained",
    title: "Understanding RSUs: A Comprehensive Guide",
    excerpt: "",
    category: "Боловсрол",
    tags: ["RSUs", "Equity", "Compensation"],
    author: "",
    authorRole: "",
    initials: "",
    date: "2025-10-01",
    readTime: "10",
    views: "0",
    image: "/mockups/blogs/1.avif",
    coverGrad: "",
    coverNote: "",
  },
  {
    id: "fallback-2",
    slug: "what-to-do-with-equity",
    title:
      "Workshop: What to Do with Your Equity Before You Sell, Quit, or Vest",
    excerpt: "",
    category: "Боловсрол",
    tags: ["Equity", "Investment", "Strategy"],
    author: "",
    authorRole: "",
    initials: "",
    date: "2025-09-15",
    readTime: "10",
    views: "0",
    image: "/mockups/blogs/2.avif",
    coverGrad: "",
    coverNote: "",
  },
  {
    id: "fallback-3",
    slug: "consolidate-old-accounts",
    title: "Simplify Your Investments: Consolidate Old Accounts",
    excerpt: "",
    category: "Зөвлөмж",
    tags: ["Tax", "Stock Options", "Finance"],
    author: "",
    authorRole: "",
    initials: "",
    date: "2025-08-30",
    readTime: "10",
    views: "0",
    image: "/mockups/blogs/3.avif",
    coverGrad: "",
    coverNote: "",
  },
];

const Blogs = () => {
  const { t } = useLanguage();
  const [posts, setPosts] = useState<JournalPost[]>(FALLBACK_POSTS);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/journal/posts")
      .then((r) => r.json())
      .then((rows: JournalPostApiRow[]) => {
        if (cancelled) return;
        if (Array.isArray(rows) && rows.length > 0) {
          setPosts(rows.slice(0, 3).map(apiRowToCardPost));
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="section-container flex flex-col gap-8">
      <Seperator />

      <div className="grid md:grid-cols-2">
        <h1 className="text-4xl">{t("Our Thinking")}</h1>

        <div className="flex flex-col gap-6 mt-8 md:mt-0">
          <p className="text-md md:text-lg leading-[1.4]">
            {t("What's top of mind for our investment team")}
          </p>

          <div className="mt-4">
            <Link href="/journal" data-tc-cta="home-explore-blog">
              <GradientBorderButton>
                {t("EXPLORE OUR BLOG")}
              </GradientBorderButton>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 my-16 md:my-36">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/journal/${post.slug}`}
            data-tc-cta={`home-blog-card-${post.slug}`}
            className="block"
          >
            <BlogCard
              title={post.title}
              image={post.image}
              tags={[post.category, ...post.tags.slice(0, 1)]}
              publishedDate={post.date}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Blogs;
