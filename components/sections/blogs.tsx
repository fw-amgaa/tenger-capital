"use client";

import BlogCard from "../blog-card";
import GradientBorderButton from "../gradient-border-button";
import Seperator from "../seperator";
import { useLanguage } from "@/lib/language-context";

const blogsData = [
  {
    title: "Understanding RSUs: A Comprehensive Guide",
    image: "/mockups/blogs/1.avif",
    publishedDate: "2025-10-01",
    tags: ["RSUs", "Equity", "Compensation"],
  },
  {
    title:
      "Workshop: What to Do with Your Equity Before You Sell, Quit, or Vest",
    image: "/mockups/blogs/2.avif",
    publishedDate: "2025-09-15",
    tags: ["Equity", "Investment", "Strategy"],
  },
  {
    title: "Simplify Your Investments: Consolidate Old Accounts",
    image: "/mockups/blogs/3.avif",
    publishedDate: "2025-08-30",
    tags: ["Tax", "Stock Options", "Finance"],
  },
];

const Blogs = () => {
  const { t } = useLanguage();

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
            <GradientBorderButton>{t("EXPLORE OUR BLOG")}</GradientBorderButton>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 my-16 md:my-36">
        {blogsData.map((blog, index) => (
          <BlogCard
            key={index}
            title={blog.title}
            image={blog.image}
            tags={blog.tags}
            publishedDate={blog.publishedDate}
          />
        ))}
      </div>
    </div>
  );
};

export default Blogs;
