import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { config } from "dotenv";
import { eq } from "drizzle-orm";
import {
  partnerCondition,
  partnerFaq,
  partnerHeroSlide,
  partnerIntroImage,
  partnerLink,
  partnerPage,
  partnerSocial,
  partnerUnderwriterLogo,
} from "../lib/db/schema";

config({ path: ".env.local" });
config({ path: ".env" });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

const SLUG = "golomt-capital";

async function main() {
  console.log(`Seeding partner page: ${SLUG}…`);

  const existing = await db
    .select()
    .from(partnerPage)
    .where(eq(partnerPage.slug, SLUG))
    .limit(1);

  let pageId: string;
  if (existing.length > 0) {
    pageId = existing[0].id;
    await db
      .update(partnerPage)
      .set({
        nameMn: "Голомт Капитал",
        nameEn: "Golomt Capital",
        primaryColor: "#dc2626",
        pdfUrl: null,
        pdfCtaLabelMn: "Танилцуулга татах",
        pdfCtaLabelEn: "Download intro",
        orderUrl: null,
        orderCtaLabelMn: "Захиалга өгөх",
        orderCtaLabelEn: "Place order",
        heroEyebrowMn: "Хамтран ажиллагаа",
        heroEyebrowEn: "Partnership",
        heroTitleMn: "Голомт Капитал × Тэнгэр Капитал",
        heroTitleEn: "Golomt Capital × Tenger Capital",
        heroSubtitleMn:
          "Хамтын ажиллагааны хүрээнд танилцуулагдсан өндөр өгөөжтэй санхүүжилтийн боломж.",
        heroSubtitleEn:
          "A high-yield financing opportunity surfaced through our joint underwriting program.",
        introTitleMn: "Бид яагаад хамтран ажиллах ёстой вэ",
        introTitleEn: "Why we partner",
        introHtmlMn:
          "<p>Голомт Капитал болон Тэнгэр Капитал нь Монголын хөрөнгийн зах зээлд олон жилийн туршлагатай мэргэжлийн баг хамт олонтой. Бид хамтдаа клиентдээ хамгийн өндөр стандарттай үнэт цаасны үйлчилгээг хүргэх зорилгоор нэгдсэн билээ.</p><p>Энэхүү хамтын ажиллагаа нь үнэт цаас гаргагч болон хөрөнгө оруулагч талуудад ил тод, хариуцлагатай, өндөр өгөөжтэй санхүүжилтийн боломжийг бий болгоно.</p>",
        introHtmlEn:
          "<p>Golomt Capital and Tenger Capital are two of the most experienced securities firms operating in Mongolia. Together, we serve clients with the highest professional standards.</p><p>This partnership creates transparent, accountable, high-yield financing opportunities for both issuers and investors.</p>",
        conditionsTitleMn: "Бүтээгдэхүүний нөхцөл",
        conditionsTitleEn: "Product conditions",
        conditionsLedeMn:
          "Доорх есөн нөхцөлийг анхаарч уншина уу — энэхүү бондын суурь шинж чанарууд эндээс эхэлнэ.",
        conditionsLedeEn:
          "These nine conditions describe the core characteristics of the offering.",
        downloadTitleMn: "Бүрэн танилцуулгыг татаж аваарай",
        downloadTitleEn: "Get the full brief",
        downloadDescMn:
          "Бондын бүтэц, хүү, хугацаа болон эрсдэлийн бүрэн тайлбарыг PDF файлаас уншина уу.",
        downloadDescEn:
          "The PDF brief covers structure, coupon, tenor, and the full risk disclosure.",
        faqTitleMn: "Түгээмэл асуултууд",
        faqTitleEn: "Frequently asked questions",
        footerSubscribeTitleMn: "Бидэнтэй нэгдэх",
        footerSubscribeTitleEn: "Join us",
        footerLinksTitleMn: "Хэрэгцээт линк",
        footerLinksTitleEn: "Useful links",
        footerEmail: "info@tengercapital.mn",
        footerPhone: "+976 7711 0272",
        published: true,
      })
      .where(eq(partnerPage.id, pageId));
    console.log("  ↻ updated existing page");
  } else {
    const [created] = await db
      .insert(partnerPage)
      .values({
        slug: SLUG,
        nameMn: "Голомт Капитал",
        nameEn: "Golomt Capital",
        primaryColor: "#dc2626",
        pdfCtaLabelMn: "Танилцуулга татах",
        pdfCtaLabelEn: "Download intro",
        orderCtaLabelMn: "Захиалга өгөх",
        orderCtaLabelEn: "Place order",
        heroEyebrowMn: "Хамтран ажиллагаа",
        heroEyebrowEn: "Partnership",
        heroTitleMn: "Голомт Капитал × Тэнгэр Капитал",
        heroTitleEn: "Golomt Capital × Tenger Capital",
        heroSubtitleMn:
          "Хамтын ажиллагааны хүрээнд танилцуулагдсан өндөр өгөөжтэй санхүүжилтийн боломж.",
        heroSubtitleEn:
          "A high-yield financing opportunity surfaced through our joint underwriting program.",
        introTitleMn: "Бид яагаад хамтран ажиллах ёстой вэ",
        introTitleEn: "Why we partner",
        introHtmlMn:
          "<p>Голомт Капитал болон Тэнгэр Капитал нь Монголын хөрөнгийн зах зээлд олон жилийн туршлагатай мэргэжлийн баг хамт олонтой.</p>",
        introHtmlEn:
          "<p>Golomt Capital and Tenger Capital are two of the most experienced securities firms operating in Mongolia.</p>",
        conditionsTitleMn: "Бүтээгдэхүүний нөхцөл",
        conditionsTitleEn: "Product conditions",
        conditionsLedeMn:
          "Доорх есөн нөхцөлийг анхаарч уншина уу.",
        conditionsLedeEn:
          "These nine conditions describe the core characteristics.",
        downloadTitleMn: "Бүрэн танилцуулгыг татаж аваарай",
        downloadTitleEn: "Get the full brief",
        downloadDescMn:
          "Бондын бүтэц, хүү, хугацаа болон эрсдэлийн бүрэн тайлбарыг PDF файлаас уншина уу.",
        downloadDescEn:
          "The PDF brief covers structure, coupon, tenor, and the full risk disclosure.",
        faqTitleMn: "Түгээмэл асуултууд",
        faqTitleEn: "Frequently asked questions",
        footerEmail: "info@tengercapital.mn",
        footerPhone: "+976 7711 0272",
        published: true,
      })
      .returning();
    pageId = created.id;
    console.log("  + created new page");
  }

  // Wipe & re-insert child collections
  await Promise.all([
    db.delete(partnerHeroSlide).where(eq(partnerHeroSlide.pageId, pageId)),
    db.delete(partnerIntroImage).where(eq(partnerIntroImage.pageId, pageId)),
    db.delete(partnerCondition).where(eq(partnerCondition.pageId, pageId)),
    db.delete(partnerFaq).where(eq(partnerFaq.pageId, pageId)),
    db.delete(partnerLink).where(eq(partnerLink.pageId, pageId)),
    db.delete(partnerSocial).where(eq(partnerSocial.pageId, pageId)),
    db
      .delete(partnerUnderwriterLogo)
      .where(eq(partnerUnderwriterLogo.pageId, pageId)),
  ]);

  await db.insert(partnerHeroSlide).values([
    {
      pageId,
      type: "image",
      url: "/home/hero.jpg",
      sortOrder: 0,
    },
    {
      pageId,
      type: "image",
      url: "/home/udirdamj.jpg",
      sortOrder: 1,
    },
  ]);

  await db.insert(partnerIntroImage).values([
    { pageId, url: "/home/hero.jpg", captionMn: "", captionEn: "", sortOrder: 0 },
    { pageId, url: "/home/udirdamj.jpg", captionMn: "", captionEn: "", sortOrder: 1 },
  ]);

  await db.insert(partnerCondition).values([
    {
      pageId,
      iconLabel: "01",
      titleMn: "Хүү",
      titleEn: "Coupon",
      bodyMn: "Жилийн 18%-21% хүртэл тогтмол хүү.",
      bodyEn: "Fixed annual coupon between 18% and 21%.",
      sortOrder: 0,
    },
    {
      pageId,
      iconLabel: "02",
      titleMn: "Хугацаа",
      titleEn: "Tenor",
      bodyMn: "12, 18 эсвэл 24 сар сонгох боломжтой.",
      bodyEn: "Choose from 12, 18, or 24 months.",
      sortOrder: 1,
    },
    {
      pageId,
      iconLabel: "03",
      titleMn: "Доод дүн",
      titleEn: "Minimum",
      bodyMn: "10 сая төгрөгөөс эхлэн хөрөнгө оруулна.",
      bodyEn: "Invest from 10 million MNT.",
      sortOrder: 2,
    },
    {
      pageId,
      iconLabel: "04",
      titleMn: "Тооцоолол",
      titleEn: "Settlement",
      bodyMn: "Улирал тутамд хүүгийн төлбөр шилжүүлнэ.",
      bodyEn: "Coupon paid quarterly.",
      sortOrder: 3,
    },
    {
      pageId,
      iconLabel: "05",
      titleMn: "Хадгалалт",
      titleEn: "Custody",
      bodyMn: "Төвлөрсөн хадгаламжийн төвд найдвартай хадгалагдана.",
      bodyEn: "Securely held at the Central Securities Depository.",
      sortOrder: 4,
    },
    {
      pageId,
      iconLabel: "06",
      titleMn: "Эрсдэлийн зэрэглэл",
      titleEn: "Risk grade",
      bodyMn: "Дунд зэрэглэлийн өрийн хэрэгсэл.",
      bodyEn: "Investment-grade debt instrument.",
      sortOrder: 5,
    },
    {
      pageId,
      iconLabel: "07",
      titleMn: "Татвар",
      titleEn: "Tax",
      bodyMn: "Иргэний орлогын татварын дагуу хасагдана.",
      bodyEn: "Subject to standard withholding tax.",
      sortOrder: 6,
    },
    {
      pageId,
      iconLabel: "08",
      titleMn: "Хөрвөх чадвар",
      titleEn: "Liquidity",
      bodyMn: "OTC зах зээлд эргүүлэн худалдах боломжтой.",
      bodyEn: "Tradable on the OTC market.",
      sortOrder: 7,
    },
    {
      pageId,
      iconLabel: "09",
      titleMn: "Хяналт",
      titleEn: "Oversight",
      bodyMn: "СЗХ-ны зохицуулалтын дор үйл ажиллагаа явагдана.",
      bodyEn: "Regulated by Mongolia's Financial Regulatory Commission.",
      sortOrder: 8,
    },
  ]);

  await db.insert(partnerFaq).values([
    {
      pageId,
      qMn: "Хэрхэн захиалга өгөх вэ?",
      qEn: "How do I place an order?",
      aMn: "Энэхүү хуудасны 'Захиалга өгөх' товчин дээр дарж өргөдлөө илгээнэ үү. Манай брокер 24 цагийн дотор холбогдоно.",
      aEn: "Click the 'Place order' button on this page. Our broker will reach out within 24 hours.",
      sortOrder: 0,
    },
    {
      pageId,
      qMn: "Хамгийн бага хөрөнгө оруулалтын хэмжээ хэд вэ?",
      qEn: "What's the minimum investment?",
      aMn: "10 сая төгрөгөөс эхлэн хүлээн авна.",
      aEn: "We accept orders from 10 million MNT.",
      sortOrder: 1,
    },
    {
      pageId,
      qMn: "Хүүг хэрхэн төлдөг вэ?",
      qEn: "How is interest paid?",
      aMn: "Улирал тутам таны үнэт цаасны дансанд шилжүүлнэ.",
      aEn: "Quarterly transfers to your securities account.",
      sortOrder: 2,
    },
  ]);

  await db.insert(partnerLink).values([
    {
      pageId,
      labelMn: "Голомт Капитал ҮЦК",
      labelEn: "Golomt Capital SC",
      url: "https://golomtcapital.mn",
      sortOrder: 0,
    },
    {
      pageId,
      labelMn: "Тэнгэр Капитал ҮЦК",
      labelEn: "Tenger Capital SC",
      url: "https://tengercapital.mn",
      sortOrder: 1,
    },
    {
      pageId,
      labelMn: "Монголын хөрөнгийн бирж",
      labelEn: "Mongolian Stock Exchange",
      url: "https://mse.mn",
      sortOrder: 2,
    },
    {
      pageId,
      labelMn: "Санхүүгийн зохицуулах хороо",
      labelEn: "Financial Regulatory Commission",
      url: "https://frc.mn",
      sortOrder: 3,
    },
  ]);

  await db.insert(partnerSocial).values([
    { pageId, kind: "facebook", url: "https://facebook.com/tengercapital", sortOrder: 0 },
    { pageId, kind: "twitter", url: "https://twitter.com/tengercapital", sortOrder: 1 },
    { pageId, kind: "linkedin", url: "https://linkedin.com/company/tenger-capital", sortOrder: 2 },
    { pageId, kind: "youtube", url: "https://youtube.com/@tengercapital", sortOrder: 3 },
    { pageId, kind: "instagram", url: "https://instagram.com/tengercapital", sortOrder: 4 },
  ]);

  console.log("✓ Seeded.");
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  pool.end();
  process.exit(1);
});
