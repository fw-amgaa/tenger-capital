import type { Metadata } from "next";
import { getFaqContent } from "@/lib/faq/data";
import FaqClient from "./faq-client";

export const metadata: Metadata = {
  title: "FAQ — Tenger Capital",
  description:
    "Tenger Capital — Түгээмэл асуултууд. Данс нээх, орлого зарлага, бүтээгдэхүүн, шимтгэл, аюулгүй байдал, татвар.",
};

export const dynamic = "force-dynamic";
export const revalidate = 60;

export default async function FaqPage() {
  const content = await getFaqContent();
  return <FaqClient content={content} />;
}
