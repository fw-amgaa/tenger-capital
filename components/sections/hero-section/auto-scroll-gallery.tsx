"use client";

import { useLanguage } from "@/lib/language-context";
import Image from "next/image";

export default function AutoScrollGallery() {
  const { language } = useLanguage();
  return (
    <div className="w-full md:w-[45%] aspect-[279/333] md:aspect-[500/630] rounded-3xl overflow-hidden relative">
      <Image
        src={language === "en" ? "/home/hero_en.jpg" : "/home/hero_mn.jpg"}
        alt="hero"
        fill
        objectFit="contain"
        objectPosition="left"
      />
    </div>
  );
}
