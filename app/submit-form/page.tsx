"use client";

import { ScrollControlProvider } from "@/components/scroll-control";
import FAQ from "@/components/sections/faq";
import Footer from "@/components/sections/footer";
import Header from "@/components/sections/header";
import { useLanguage } from "@/lib/language-context";
import { ContactForm } from "./form";
import { useEffect, useState } from "react";
import { FormPageContent } from "@/lib/db/schema";
import { TrackedSection } from "@/components/analytics/tracked-section";

export default function SubmitFormPage() {
  const { t, language } = useLanguage();
  const [content, setContent] = useState<FormPageContent | null>(null);

  useEffect(() => {
    fetch("/api/form-page-content")
      .then((r) => r.json())
      .then(setContent)
      .catch(() => {});
  }, []);

  // Language-aware field helpers (fallback to MN if EN not set)
  const displayTitle = content
    ? (language === "en" ? content.titleEn || content.title : content.title)
    : null;
  const displayDescription = content
    ? (language === "en" ? content.descriptionEn || content.description : content.description)
    : null;
  const displayParagraphs = content
    ? (language === "en"
        ? (content.paragraphsEn && content.paragraphsEn.length > 0 ? content.paragraphsEn : content.paragraphs)
        : content.paragraphs)
    : null;

  const hasContent =
    content &&
    (displayTitle ||
      displayDescription ||
      (displayParagraphs && displayParagraphs.length > 0) ||
      (content.images && content.images.length > 0));

  return (
    <ScrollControlProvider>
      <Header />
      <TrackedSection id="submit-form-intro">
        <div className="section-container text-8xl h-screen flex items-center justify-center">
          {t("invitation")}
        </div>
      </TrackedSection>

      {hasContent && (
        <TrackedSection id="submit-form-content" className="section-container max-w-[768px] py-12 md:py-20">
          <div className="max-w-3xl mx-auto space-y-4">
            {/* Title */}
            {displayTitle && (
              <h2 className="text-3xl md:text-5xl font-[var(--font-moisette)] leading-tight tracking-tight">
                {displayTitle}
              </h2>
            )}

            {/* Description */}
            {displayDescription && (
              <p className="text-md md:text-md leading-relaxed opacity-70 mb-16">
                {displayDescription}
              </p>
            )}

            {/* Images */}
            {content.images && content.images.length > 0 && (
              <div
                className={[
                  "grid gap-3 mt-6",
                  content.images.length === 1
                    ? "grid-cols-1"
                    : content.images.length === 2
                      ? "grid-cols-2"
                      : "grid-cols-2 md:grid-cols-3",
                ].join(" ")}
              >
                {content.images.map((url, i) => (
                  <div
                    key={i}
                    className="overflow-hidden rounded-2xl aspect-video bg-white/5"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Paragraphs */}
            {displayParagraphs && displayParagraphs.length > 0 && (
              <div className="space-y-5 mt-16">
                {displayParagraphs.map((para, i) => (
                  <div
                    key={i}
                    className="rich-content"
                    dangerouslySetInnerHTML={{ __html: para }}
                  />
                ))}
              </div>
            )}

            <div className="border-t border-white/10 pt-4" />
          </div>
        </TrackedSection>
      )}

      <TrackedSection id="submit-form">
        <ContactForm />
      </TrackedSection>
      <TrackedSection id="faq" className="my-16 md:my-32">
        <FAQ />
      </TrackedSection>
      <Footer />
    </ScrollControlProvider>
  );
}
