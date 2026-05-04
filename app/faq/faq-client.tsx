"use client";

import { useMemo, useState } from "react";
import Header from "@/components/sections/header";
import Footer from "@/components/sections/footer";
import { ScrollControlProvider } from "@/components/scroll-control";
import { TrackedSection } from "@/components/analytics/tracked-section";
import type { FaqContent } from "@/lib/faq/data";
import {
  FaqBanner,
  FaqCategorySection,
  FaqCatnav,
  FaqHelp,
  FaqPopular,
  FaqSearch,
  useActiveCategory,
} from "./components";
import "./faq.css";

export default function FaqClient({ content }: { content: FaqContent }) {
  const { categories: cats, popular, promo } = content;
  const [query, setQuery] = useState("");

  const totalQs = useMemo(
    () => cats.reduce((a, c) => a + c.questions.length, 0),
    [cats],
  );

  const matchCount = useMemo(() => {
    if (!query) return totalQs;
    const q = query.toLowerCase();
    return cats.reduce(
      (acc, c) =>
        acc +
        c.questions.filter(
          (x) =>
            x.q.toLowerCase().includes(q) ||
            (x.qEn || "").toLowerCase().includes(q) ||
            x.a.toLowerCase().includes(q),
        ).length,
      0,
    );
  }, [query, cats, totalQs]);

  const catIds = useMemo(() => cats.map((c) => c.id), [cats]);
  const activeId = useActiveCategory(catIds);

  return (
    <ScrollControlProvider>
      <div className="faq-shell">
        <Header headerMode="light" />

        <div className="faq-section faq-top">
          <div className="faq-eyebrow">
            FAQ
            <span className="dot" />
            Тусламж · Help center
          </div>
        </div>

        <div className="faq-section">
          <TrackedSection id="faq-banner">
            <FaqBanner promo={promo} />
          </TrackedSection>
        </div>

        <FaqSearch
          value={query}
          onChange={setQuery}
          totalQs={totalQs}
          matchCount={matchCount}
        />

        <FaqCatnav cats={cats} activeId={activeId} />

        <TrackedSection id="faq-popular">
          <FaqPopular cats={cats} popular={popular} />
        </TrackedSection>

        <div className="faq-section">
          {cats.map((c) => (
            <FaqCategorySection key={c.id} cat={c} queryFilter={query} />
          ))}
        </div>

        <TrackedSection id="faq-help">
          <FaqHelp />
        </TrackedSection>

        <Footer />
      </div>
    </ScrollControlProvider>
  );
}
