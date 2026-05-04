// Client-safe partner helpers and types.
// IMPORTANT: do not import db/server-only modules here — this file is
// transitively imported by `"use client"` components.

import type {
  PartnerConditionRow,
  PartnerFaqRow,
  PartnerHeroSlideRow,
  PartnerIntroImageRow,
  PartnerLinkRow,
  PartnerPageRow,
  PartnerSocialRow,
  PartnerUnderwriterLogoRow,
} from "@/lib/db/schema";

export type PartnerSocialKind =
  | "facebook"
  | "twitter"
  | "linkedin"
  | "youtube"
  | "instagram";

export type PartnerPageBundle = {
  page: PartnerPageRow;
  heroSlides: PartnerHeroSlideRow[];
  introImages: PartnerIntroImageRow[];
  conditions: PartnerConditionRow[];
  faqs: PartnerFaqRow[];
  links: PartnerLinkRow[];
  socials: PartnerSocialRow[];
  underwriters: PartnerUnderwriterLogoRow[];
};

export function pickLang<T extends string | null>(
  language: "en" | "mn",
  mn: T,
  en: T,
): string {
  if (language === "en") return (en && en.trim() ? en : mn) ?? "";
  return (mn && mn.trim() ? mn : en) ?? "";
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\p{Letter}\p{Number}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

export const PARTNER_SECTION_IDS = {
  hero: "hero",
  introduction: "introduction",
  conditions: "conditions",
  download: "download",
  faq: "faq",
  contact: "contact",
} as const;

export type PartnerSectionId =
  (typeof PARTNER_SECTION_IDS)[keyof typeof PARTNER_SECTION_IDS];
