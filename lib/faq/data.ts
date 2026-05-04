import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  faqCategory,
  faqPromo,
  faqQuestion,
  type FaqCategoryRow,
  type FaqPromoRow,
  type FaqQuestionRow,
} from "@/lib/db/schema";
import type {
  FaqCategory,
  FaqPopularRef,
  FaqPromo,
  FaqQuestion,
} from "./content";
import { FAQ_CATEGORIES, FAQ_POPULAR, FAQ_PROMO } from "./content";

export const FAQ_PROMO_SINGLETON_ID = "default";

export function rowToQuestion(row: FaqQuestionRow): FaqQuestion {
  return {
    id: row.id,
    q: row.qMn || row.qEn,
    qEn: row.qEn || undefined,
    a: row.aMn || row.aEn,
    aEn: row.aEn || undefined,
    helpful: row.helpful || undefined,
  };
}

export function rowToCategory(
  row: FaqCategoryRow,
  questionRows: FaqQuestionRow[],
): FaqCategory {
  return {
    id: row.slug,
    icon: row.icon,
    label: row.labelMn || row.labelEn,
    labelEn: row.labelEn || row.labelMn,
    intro: row.introMn || row.introEn,
    introEn: row.introEn || row.introMn,
    videoTitle: row.videoTitleMn || row.videoTitleEn,
    videoTitleEn: row.videoTitleEn || row.videoTitleMn,
    videoDuration: row.videoDuration,
    videoThumb: row.videoThumb,
    videoThumbNote: row.videoThumbNote,
    accent: row.accent,
    questions: questionRows
      .filter((q) => q.categoryId === row.id && q.published)
      .map(rowToQuestion),
  };
}

export function rowToPromo(row: FaqPromoRow | undefined): FaqPromo {
  if (!row || !row.enabled) return FAQ_PROMO;
  return {
    eyebrow: row.eyebrowMn || FAQ_PROMO.eyebrow,
    meta: row.metaMn || FAQ_PROMO.meta,
    title: row.titleMn || FAQ_PROMO.title,
    titleEn: row.titleEn || undefined,
    blurb: row.blurbMn || FAQ_PROMO.blurb,
    blurbEn: row.blurbEn || undefined,
    cta: row.ctaMn || FAQ_PROMO.cta,
    ctaEn: row.ctaEn || undefined,
    glyph: row.glyph || FAQ_PROMO.glyph,
    cornerLabel: row.cornerLabel || FAQ_PROMO.cornerLabel,
  };
}

export type FaqContent = {
  categories: FaqCategory[];
  popular: FaqPopularRef[];
  promo: FaqPromo;
};

const STATIC_FALLBACK: FaqContent = {
  categories: FAQ_CATEGORIES,
  popular: FAQ_POPULAR,
  promo: FAQ_PROMO,
};

export async function getFaqContent(opts?: {
  includeDrafts?: boolean;
}): Promise<FaqContent> {
  const includeDrafts = !!opts?.includeDrafts;

  try {
    return await loadFromDb(includeDrafts);
  } catch (err) {
    // Tables not yet migrated, or DB unreachable — fall back to bundled
    // static content so /faq still renders. After running `pnpm db:push`
    // and `pnpm db:seed-faq`, the DB path takes over.
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[faq] getFaqContent fell back to static content:",
        (err as Error).message,
      );
    }
    return STATIC_FALLBACK;
  }
}

async function loadFromDb(includeDrafts: boolean): Promise<FaqContent> {
  const catRows = await db
    .select()
    .from(faqCategory)
    .orderBy(asc(faqCategory.sortOrder), asc(faqCategory.createdAt));
  const filteredCats = includeDrafts
    ? catRows
    : catRows.filter((c) => c.published);

  const qRows = await db
    .select()
    .from(faqQuestion)
    .orderBy(asc(faqQuestion.sortOrder), asc(faqQuestion.createdAt));
  const filteredQs = includeDrafts ? qRows : qRows.filter((q) => q.published);

  const categories = filteredCats.map((row) => rowToCategory(row, filteredQs));

  const popular: FaqPopularRef[] = filteredQs
    .filter((q) => q.isPopular)
    .map((q) => {
      const cat = filteredCats.find((c) => c.id === q.categoryId);
      return cat
        ? {
            qid: q.id,
            catId: cat.slug,
            rank: q.popularRank ?? 0,
          }
        : null;
    })
    .filter((p): p is FaqPopularRef & { rank: number } => p !== null)
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 5)
    .map((p) => ({ qid: p.qid, catId: p.catId }));

  const promoRows = await db
    .select()
    .from(faqPromo)
    .where(eq(faqPromo.id, FAQ_PROMO_SINGLETON_ID))
    .limit(1);
  const promo = rowToPromo(promoRows[0]);

  // Re-key questions to db ids in popular refs that referenced existing q.id;
  // but the FAQ_POPULAR shape uses qid from the question table directly,
  // and our components look up by `cats.find(...).questions.find((x) => x.id === p.qid)`.
  // Question.id in the rendered shape = row.id (uuid). So popular.qid = uuid too. Good.

  return { categories, popular, promo };
}
