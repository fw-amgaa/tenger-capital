// Server-only data layer. Imports the database, must NOT be imported from
// client components — use `lib/partners/shared.ts` for shared types/helpers.
import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  partnerCondition,
  partnerFaq,
  partnerHeroSlide,
  partnerIntroImage,
  partnerLink,
  partnerPage,
  partnerSocial,
  partnerUnderwriterLogo,
  type PartnerPageRow,
} from "@/lib/db/schema";
import type { PartnerPageBundle } from "./shared";

export { pickLang, slugify, PARTNER_SECTION_IDS } from "./shared";
export type {
  PartnerPageBundle,
  PartnerSectionId,
  PartnerSocialKind,
} from "./shared";

export async function getPartnerPageBySlug(
  slug: string,
  opts: { includeUnpublished?: boolean } = {},
): Promise<PartnerPageBundle | null> {
  const rows = await db
    .select()
    .from(partnerPage)
    .where(eq(partnerPage.slug, slug))
    .limit(1);
  const page = rows[0];
  if (!page) return null;
  if (!page.published && !opts.includeUnpublished) return null;
  return loadRelations(page);
}

export async function getPartnerPageById(
  id: string,
): Promise<PartnerPageBundle | null> {
  const rows = await db
    .select()
    .from(partnerPage)
    .where(eq(partnerPage.id, id))
    .limit(1);
  const page = rows[0];
  if (!page) return null;
  return loadRelations(page);
}

async function loadRelations(page: PartnerPageRow): Promise<PartnerPageBundle> {
  const [heroSlides, introImages, conditions, faqs, links, socials, underwriters] =
    await Promise.all([
      db
        .select()
        .from(partnerHeroSlide)
        .where(eq(partnerHeroSlide.pageId, page.id))
        .orderBy(asc(partnerHeroSlide.sortOrder)),
      db
        .select()
        .from(partnerIntroImage)
        .where(eq(partnerIntroImage.pageId, page.id))
        .orderBy(asc(partnerIntroImage.sortOrder)),
      db
        .select()
        .from(partnerCondition)
        .where(eq(partnerCondition.pageId, page.id))
        .orderBy(asc(partnerCondition.sortOrder)),
      db
        .select()
        .from(partnerFaq)
        .where(eq(partnerFaq.pageId, page.id))
        .orderBy(asc(partnerFaq.sortOrder)),
      db
        .select()
        .from(partnerLink)
        .where(eq(partnerLink.pageId, page.id))
        .orderBy(asc(partnerLink.sortOrder)),
      db
        .select()
        .from(partnerSocial)
        .where(eq(partnerSocial.pageId, page.id))
        .orderBy(asc(partnerSocial.sortOrder)),
      db
        .select()
        .from(partnerUnderwriterLogo)
        .where(eq(partnerUnderwriterLogo.pageId, page.id))
        .orderBy(asc(partnerUnderwriterLogo.sortOrder)),
    ]);

  return { page, heroSlides, introImages, conditions, faqs, links, socials, underwriters };
}
