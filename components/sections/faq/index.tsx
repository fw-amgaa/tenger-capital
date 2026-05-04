"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import GradientBorderButton from "../../gradient-border-button";
import Seperator from "../../seperator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../ui/accordion";
import { useLanguage } from "@/lib/language-context";
import { FAQ_CATEGORIES, type FaqCategory } from "@/lib/faq/content";

type FaqHomeCategory = Pick<
  FaqCategory,
  "id" | "icon" | "label" | "labelEn" | "intro" | "introEn"
>;

const FALLBACK_CATEGORIES: FaqHomeCategory[] = FAQ_CATEGORIES.map((c) => ({
  id: c.id,
  icon: c.icon,
  label: c.label,
  labelEn: c.labelEn,
  intro: c.intro,
  introEn: c.introEn,
}));

const FAQ = () => {
  const { language, t } = useLanguage();
  const [categories, setCategories] =
    useState<FaqHomeCategory[]>(FALLBACK_CATEGORIES);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/faq")
      .then((r) => r.json())
      .then((data: { categories?: FaqCategory[] }) => {
        if (cancelled) return;
        if (Array.isArray(data?.categories) && data.categories.length > 0) {
          setCategories(
            data.categories.map((c) => ({
              id: c.id,
              icon: c.icon,
              label: c.label,
              labelEn: c.labelEn,
              intro: c.intro,
              introEn: c.introEn,
            })),
          );
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="section-container flex flex-col gap-8 relative">
      <Seperator />

      <div className="grid md:grid-cols-2 z-1">
        <h1 className="text-4xl mb-12">{t("Frequently Asked Questions")}</h1>

        <Accordion type="single" collapsible className="w-full">
          {categories.map((cat) => {
            const label = language === "en" ? cat.labelEn || cat.label : cat.label;
            const intro =
              language === "en" ? cat.introEn || cat.intro : cat.intro;
            return (
              <AccordionItem key={cat.id} value={cat.id}>
                <AccordionTrigger>{label}</AccordionTrigger>
                <AccordionContent className="opacity-80 leading-relaxed p-6 pt-0 flex flex-col gap-4 items-start">
                  {intro ? <p>{intro}</p> : null}
                  <Link
                    href={`/faq#cat-${cat.id}`}
                    data-tc-cta={`home-faq-category-${cat.id}`}
                  >
                    <GradientBorderButton>
                      {language === "en"
                        ? "VIEW ALL QUESTIONS"
                        : "БҮХ АСУУЛТЫГ ҮЗЭХ"}
                    </GradientBorderButton>
                  </Link>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </div>
  );
};

export default FAQ;
