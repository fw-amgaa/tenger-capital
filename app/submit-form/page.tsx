"use client";

import { ScrollControlProvider } from "@/components/scroll-control";
import FAQ from "@/components/sections/faq";
import Footer from "@/components/sections/footer";
import Header from "@/components/sections/header";
import { useLanguage } from "@/lib/language-context";
import { ContactForm } from "./form";
import { useEffect, useState } from "react";
import { FormPageContent } from "@/lib/db/schema";

export default function SubmitFormPage() {
  const { t } = useLanguage();
  const [content, setContent] = useState<FormPageContent | null>(null);

  useEffect(() => {
    fetch("/api/form-page-content")
      .then((r) => r.json())
      .then(setContent)
      .catch(() => {});
  }, []);

  const hasContent =
    content &&
    (content.title ||
      content.description ||
      (content.paragraphs && content.paragraphs.length > 0) ||
      (content.images && content.images.length > 0));

  return (
    <ScrollControlProvider>
      <Header />
      <div className="section-container text-8xl h-screen flex items-center justify-center">
        {t("REACH OUT TO US.page")}
      </div>

      {hasContent && (
        <div className="section-container max-w-[768px] py-12 md:py-20">
          <div className="max-w-3xl mx-auto space-y-4">
            {/* Title */}
            {content.title && (
              <h2 className="text-3xl md:text-5xl font-[var(--font-moisette)] leading-tight tracking-tight">
                {content.title}
              </h2>
            )}

            {/* Description */}
            {content.description && (
              <p className="text-md md:text-md leading-relaxed opacity-70 mb-16">
                {content.description}
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
            {content.paragraphs && content.paragraphs.length > 0 && (
              <div className="space-y-5 mt-16">
                {content.paragraphs.map((para, i) => (
                  <p
                    key={i}
                    className="text-base md:text-lg leading-relaxed opacity-60"
                  >
                    {para}
                  </p>
                ))}
              </div>
            )}

            <div className="border-t border-white/10 pt-4" />
          </div>
        </div>
      )}

      <ContactForm />
      <div className="my-16 md:my-32">
        <FAQ />
      </div>
      <Footer />
    </ScrollControlProvider>
  );
}
