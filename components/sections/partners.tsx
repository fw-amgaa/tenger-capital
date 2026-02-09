"use client";

import { useAnimationFrame } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import Seperator from "../seperator";
import { useLanguage } from "@/lib/language-context";

const techLogos = Array.from({ length: 32 }, (_, i) => ({
  gray: `/partners/new/Cropped Grey/Cropped Grey (${i + 1}).png`,
  color: `/partners/new/Croped/Cropped (${i + 1}).png`,
  alt: `Partner ${i + 1}`,
}));

export default function Partners() {
  const baseX = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useAnimationFrame((t, delta) => {
    if (!containerRef.current) return;
    const speed = 0.05; // adjust speed here
    baseX.current -= speed * delta;
    if (baseX.current <= -containerRef.current.scrollWidth / 2) {
      baseX.current = 0; // reset when half scrolled (since duplicated)
    }
    containerRef.current.style.transform = `translateX(${baseX.current}px)`;
  });

  return (
    <div className="section-container flex flex-col gap-8">
      <Seperator />

      <div className="grid md:grid-cols-2">
        <h1 className="text-4xl">{t("Partners")}</h1>

        <div className="flex flex-col gap-6">
          <h3 className="text-lg leading-[1.4] max-w-[440px]">
            {t("partners.subtitle")}
          </h3>
        </div>
      </div>

      <div className="relative overflow-hidden flex items-center justify-center w-full min-h-[160px] md:mt-24 md:mb-32">
        <div className="absolute left-0 top-0 h-full bg-red w-20 z-10" />

        <div
          ref={containerRef}
          className="flex gap-12 items-center absolute will-change-transform"
        >
          {[...techLogos, ...techLogos].map((logo, i) => (
            <div
              key={i}
              className="w-[120px] h-[40px] flex items-center justify-center relative group cursor-pointer"
            >
              <Image
                src={logo.gray}
                alt={logo.alt}
                width={120}
                height={40}
                className="object-contain transition-opacity duration-300 ease-in-out group-hover:opacity-0"
              />
              <Image
                src={logo.color}
                alt={logo.alt}
                width={120}
                height={40}
                className="object-contain absolute inset-0 m-auto opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
