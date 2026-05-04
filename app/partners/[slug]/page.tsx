import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPartnerPageBySlug } from "@/lib/partners/data";
import PartnerClient from "./partner-client";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const bundle = await getPartnerPageBySlug(slug);
  if (!bundle) return { title: "Tenger Capital — Partner" };
  const name = bundle.page.nameMn || bundle.page.nameEn;
  const subtitle =
    bundle.page.heroSubtitleMn || bundle.page.heroSubtitleEn || undefined;
  return {
    title: `${name} — Tenger Capital`,
    description: subtitle,
  };
}

export default async function PartnerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const bundle = await getPartnerPageBySlug(slug);
  if (!bundle) notFound();
  return <PartnerClient bundle={bundle} />;
}
