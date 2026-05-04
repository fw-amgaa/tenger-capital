import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
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
} from "@/lib/db/schema";

type SectionsBody = {
  heroSlides?: Array<{ type?: string; url: string }>;
  introImages?: Array<{ url: string; captionMn?: string; captionEn?: string }>;
  conditions?: Array<{
    iconLabel?: string;
    titleMn?: string;
    titleEn?: string;
    bodyMn?: string;
    bodyEn?: string;
  }>;
  faqs?: Array<{
    qMn?: string;
    qEn?: string;
    aMn?: string;
    aEn?: string;
  }>;
  links?: Array<{ labelMn?: string; labelEn?: string; url: string }>;
  socials?: Array<{ kind: string; url: string }>;
  underwriters?: Array<{
    labelMn?: string;
    labelEn?: string;
    logoUrl: string;
  }>;
};

export async function PUT(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  const existing = await db
    .select({ id: partnerPage.id })
    .from(partnerPage)
    .where(eq(partnerPage.id, id))
    .limit(1);
  if (existing.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body: SectionsBody = await req.json().catch(() => ({}));

  if (Array.isArray(body.heroSlides)) {
    await db.delete(partnerHeroSlide).where(eq(partnerHeroSlide.pageId, id));
    if (body.heroSlides.length > 0) {
      await db.insert(partnerHeroSlide).values(
        body.heroSlides
          .filter((s) => s.url)
          .map((s, i) => ({
            pageId: id,
            type: s.type === "video" ? "video" : "image",
            url: s.url,
            sortOrder: i,
          })),
      );
    }
  }

  if (Array.isArray(body.introImages)) {
    await db.delete(partnerIntroImage).where(eq(partnerIntroImage.pageId, id));
    if (body.introImages.length > 0) {
      await db.insert(partnerIntroImage).values(
        body.introImages
          .filter((s) => s.url)
          .map((s, i) => ({
            pageId: id,
            url: s.url,
            captionMn: s.captionMn ?? "",
            captionEn: s.captionEn ?? "",
            sortOrder: i,
          })),
      );
    }
  }

  if (Array.isArray(body.conditions)) {
    await db.delete(partnerCondition).where(eq(partnerCondition.pageId, id));
    if (body.conditions.length > 0) {
      await db.insert(partnerCondition).values(
        body.conditions.map((c, i) => ({
          pageId: id,
          iconLabel: c.iconLabel ?? "",
          titleMn: c.titleMn ?? "",
          titleEn: c.titleEn ?? "",
          bodyMn: c.bodyMn ?? "",
          bodyEn: c.bodyEn ?? "",
          sortOrder: i,
        })),
      );
    }
  }

  if (Array.isArray(body.faqs)) {
    await db.delete(partnerFaq).where(eq(partnerFaq.pageId, id));
    if (body.faqs.length > 0) {
      await db.insert(partnerFaq).values(
        body.faqs.map((f, i) => ({
          pageId: id,
          qMn: f.qMn ?? "",
          qEn: f.qEn ?? "",
          aMn: f.aMn ?? "",
          aEn: f.aEn ?? "",
          sortOrder: i,
        })),
      );
    }
  }

  if (Array.isArray(body.links)) {
    await db.delete(partnerLink).where(eq(partnerLink.pageId, id));
    if (body.links.length > 0) {
      await db.insert(partnerLink).values(
        body.links
          .filter((l) => l.url)
          .map((l, i) => ({
            pageId: id,
            labelMn: l.labelMn ?? "",
            labelEn: l.labelEn ?? "",
            url: l.url,
            sortOrder: i,
          })),
      );
    }
  }

  if (Array.isArray(body.socials)) {
    await db.delete(partnerSocial).where(eq(partnerSocial.pageId, id));
    if (body.socials.length > 0) {
      await db.insert(partnerSocial).values(
        body.socials
          .filter((s) => s.kind && s.url)
          .map((s, i) => ({
            pageId: id,
            kind: s.kind,
            url: s.url,
            sortOrder: i,
          })),
      );
    }
  }

  if (Array.isArray(body.underwriters)) {
    await db
      .delete(partnerUnderwriterLogo)
      .where(eq(partnerUnderwriterLogo.pageId, id));
    if (body.underwriters.length > 0) {
      await db.insert(partnerUnderwriterLogo).values(
        body.underwriters
          .filter((u) => u.logoUrl)
          .map((u, i) => ({
            pageId: id,
            labelMn: u.labelMn ?? "",
            labelEn: u.labelEn ?? "",
            logoUrl: u.logoUrl,
            sortOrder: i,
          })),
      );
    }
  }

  return NextResponse.json({ success: true });
}
