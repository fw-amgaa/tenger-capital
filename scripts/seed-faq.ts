import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { config } from "dotenv";
import { eq } from "drizzle-orm";
import {
  FAQ_CATEGORIES,
  FAQ_POPULAR,
  FAQ_PROMO,
} from "../lib/faq/content";
import { faqCategory, faqPromo, faqQuestion } from "../lib/db/schema";

config({ path: ".env.local" });
config({ path: ".env" });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

const PROMO_ID = "default";

async function main() {
  console.log("Seeding FAQ content...");

  // ── Promo singleton ──
  const existingPromo = await db
    .select()
    .from(faqPromo)
    .where(eq(faqPromo.id, PROMO_ID))
    .limit(1);
  const promoValues = {
    id: PROMO_ID,
    eyebrowMn: FAQ_PROMO.eyebrow,
    eyebrowEn: FAQ_PROMO.eyebrow,
    metaMn: FAQ_PROMO.meta,
    metaEn: FAQ_PROMO.meta,
    titleMn: FAQ_PROMO.title,
    titleEn: FAQ_PROMO.titleEn ?? FAQ_PROMO.title,
    blurbMn: FAQ_PROMO.blurb,
    blurbEn: FAQ_PROMO.blurbEn ?? FAQ_PROMO.blurb,
    ctaMn: FAQ_PROMO.cta,
    ctaEn: FAQ_PROMO.ctaEn ?? FAQ_PROMO.cta,
    glyph: FAQ_PROMO.glyph,
    cornerLabel: FAQ_PROMO.cornerLabel,
    enabled: true,
    updatedAt: new Date(),
  };
  if (existingPromo.length === 0) {
    await db.insert(faqPromo).values(promoValues);
    console.log("  + promo (created)");
  } else {
    await db.update(faqPromo).set(promoValues).where(eq(faqPromo.id, PROMO_ID));
    console.log("  · promo (updated)");
  }

  // ── Build a set of popular qids for quick lookup ──
  const popularByQid = new Map<string, number>();
  FAQ_POPULAR.forEach((p, i) => popularByQid.set(p.qid, i + 1));

  // ── Categories + their questions ──
  for (let i = 0; i < FAQ_CATEGORIES.length; i++) {
    const cat = FAQ_CATEGORIES[i];

    const existing = await db
      .select()
      .from(faqCategory)
      .where(eq(faqCategory.slug, cat.id))
      .limit(1);

    const catValues = {
      slug: cat.id,
      icon: cat.icon,
      labelMn: cat.label,
      labelEn: cat.labelEn,
      introMn: cat.intro,
      introEn: cat.introEn ?? cat.intro,
      videoTitleMn: cat.videoTitle,
      videoTitleEn: cat.videoTitleEn,
      videoDuration: cat.videoDuration,
      videoThumb: cat.videoThumb,
      videoThumbNote: cat.videoThumbNote,
      accent: cat.accent,
      sortOrder: i,
      published: true,
      updatedAt: new Date(),
    };

    let categoryRowId: string;
    if (existing.length === 0) {
      const [row] = await db
        .insert(faqCategory)
        .values(catValues)
        .returning({ id: faqCategory.id });
      categoryRowId = row.id;
      console.log(`  + category ${cat.id}`);
    } else {
      categoryRowId = existing[0].id;
      await db
        .update(faqCategory)
        .set(catValues)
        .where(eq(faqCategory.id, categoryRowId));
      // Wipe old questions so re-seeding produces a clean state.
      await db
        .delete(faqQuestion)
        .where(eq(faqQuestion.categoryId, categoryRowId));
      console.log(`  · category ${cat.id} (refreshed)`);
    }

    // ── Questions for this category ──
    for (let j = 0; j < cat.questions.length; j++) {
      const q = cat.questions[j];
      const popularRank = popularByQid.get(q.id) ?? null;
      await db.insert(faqQuestion).values({
        categoryId: categoryRowId,
        qMn: q.q,
        qEn: q.qEn ?? "",
        aMn: q.a,
        aEn: q.aEn ?? "",
        helpful: q.helpful ?? 0,
        isPopular: popularRank !== null,
        popularRank,
        sortOrder: j,
        published: true,
      });
    }
    console.log(`    · seeded ${cat.questions.length} question(s)`);
  }

  console.log("Done.");
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
