"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useLanguage } from "@/lib/language-context";
import { pickLang, type PartnerPageBundle } from "@/lib/partners/shared";
import { AmbientOrb, GrowingRule, SectionEyebrow } from "./_decor";

export default function PartnerIntroduction({
  bundle,
}: {
  bundle: PartnerPageBundle;
}) {
  const { language } = useLanguage();
  const { page, introImages } = bundle;

  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y1 = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const y2 = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const y3 = useTransform(scrollYProgress, [0, 1], [60, -60]);

  const html = pickLang(language, page.introHtmlMn, page.introHtmlEn);
  const title = pickLang(language, page.introTitleMn, page.introTitleEn);
  const partnerName = pickLang(language, page.nameMn, page.nameEn);

  return (
    <section className="relative section-container py-32 md:py-44">
      <AmbientOrb
        className="-top-24 right-0 h-[400px] w-[400px]"
        intensity={0.1}
      />
      <GrowingRule />

      <div className="grid md:grid-cols-12 gap-12 mt-12 md:mt-16">
        {/* Sticky left rail */}
        <div className="md:col-span-5">
          <div className="md:sticky md:top-32 flex flex-col gap-8">
            <SectionEyebrow
              index={1}
              label={language === "en" ? "Introduction" : "Танилцуулга"}
            />

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="font-[var(--font-moisette)] tracking-tight leading-[1.02] text-4xl md:text-5xl lg:text-6xl"
            >
              {title || partnerName}
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="flex flex-col gap-3"
            >
              <span className="text-[10px] uppercase tracking-[0.28em] text-white/45">
                {language === "en" ? "In partnership with" : "Хамтрагч"}
              </span>
              <div className="flex items-center gap-3">
                <span
                  className="h-8 w-1 rounded-full"
                  style={{ background: "var(--partner-primary)" }}
                />
                <span className="text-base text-white/80">{partnerName}</span>
                <span className="text-white/30">×</span>
                <span className="text-base text-white/80">Tenger Capital</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right: rich body + image collage */}
        <div ref={ref} className="md:col-span-7 flex flex-col gap-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8 }}
            className="rich-content text-base md:text-[17px] text-white/75"
            dangerouslySetInnerHTML={{ __html: html }}
          />

          {introImages.length > 0 ? (
            <div className="grid grid-cols-12 gap-4 md:gap-5">
              {introImages.slice(0, 4).map((img, i) => {
                const yMotion = i % 3 === 0 ? y1 : i % 3 === 1 ? y2 : y3;
                let cls = "col-span-12";
                let aspect = "aspect-[16/10]";
                if (introImages.length >= 2) {
                  if (i === 0) {
                    cls = "col-span-12 md:col-span-7";
                    aspect = "aspect-[5/4]";
                  } else if (i === 1) {
                    cls = "col-span-12 md:col-span-5 md:mt-12";
                    aspect = "aspect-[4/5]";
                  } else if (i === 2) {
                    cls = "col-span-6";
                    aspect = "aspect-square";
                  } else {
                    cls = "col-span-6 md:mt-10";
                    aspect = "aspect-square";
                  }
                }
                return (
                  <motion.figure
                    key={img.id}
                    style={{ y: yMotion }}
                    className={`${cls} relative overflow-hidden rounded-2xl bg-white/5`}
                  >
                    <div className={`relative ${aspect}`}>
                      <Image
                        src={img.url}
                        alt={pickLang(language, img.captionMn, img.captionEn)}
                        fill
                        className="object-cover"
                        sizes="(min-width: 768px) 33vw, 50vw"
                      />
                      <div
                        aria-hidden
                        className="absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(to top, rgba(10,10,10,0.45), transparent 50%)",
                        }}
                      />
                      <div
                        className="pointer-events-none absolute inset-0 rounded-2xl"
                        style={{
                          boxShadow:
                            "inset 0 0 0 1px rgba(255,255,255,0.06)",
                        }}
                      />
                    </div>
                    {(img.captionMn || img.captionEn) && (
                      <figcaption className="absolute bottom-3 left-3 right-3 text-[11px] uppercase tracking-wider text-white/80">
                        {pickLang(language, img.captionMn, img.captionEn)}
                      </figcaption>
                    )}
                  </motion.figure>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
