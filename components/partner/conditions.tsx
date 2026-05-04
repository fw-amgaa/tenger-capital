"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/language-context";
import { pickLang, type PartnerPageBundle } from "@/lib/partners/shared";
import { AmbientOrb, GrowingRule, SectionEyebrow } from "./_decor";

export default function PartnerConditions({
  bundle,
}: {
  bundle: PartnerPageBundle;
}) {
  const { language } = useLanguage();
  const { page, conditions } = bundle;
  const items = conditions;

  const title = pickLang(language, page.conditionsTitleMn, page.conditionsTitleEn);
  const lede = pickLang(language, page.conditionsLedeMn, page.conditionsLedeEn);

  return (
    <section className="relative section-container py-32 md:py-44">
      <AmbientOrb
        className="-top-20 left-1/3 h-[420px] w-[420px]"
        intensity={0.08}
      />
      <GrowingRule />

      {/* header */}
      <div className="grid md:grid-cols-12 gap-8 mt-12 md:mt-16 mb-16 md:mb-20">
        <div className="md:col-span-5 flex flex-col gap-6">
          <SectionEyebrow
            index={2}
            label={language === "en" ? "Conditions" : "Нөхцөл"}
          />
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8 }}
            className="font-[var(--font-moisette)] tracking-tight leading-[1.02] text-4xl md:text-5xl lg:text-6xl"
          >
            {title || (language === "en" ? "The terms" : "Гэрээний нөхцөл")}
          </motion.h2>
        </div>
        {lede ? (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="md:col-span-6 md:col-start-7 text-base md:text-lg text-white/65 leading-relaxed self-end"
          >
            {lede}
          </motion.p>
        ) : null}
      </div>

      {items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/10 p-16 text-center text-white/30 text-sm">
          {language === "en"
            ? "Add conditions in the dashboard"
            : "Хяналтын самбараас нөхцөл нэмнэ үү"}
        </div>
      ) : (
        <div
          className="grid sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-white/8 rounded-[28px] overflow-hidden"
          style={{ background: "rgba(255,255,255,0.015)" }}
        >
          {items.map((c, i) => (
            <motion.article
              key={c.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.7,
                delay: (i % 3) * 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group relative border-r border-b border-white/8 p-7 md:p-8 lg:p-10 min-h-[260px] flex flex-col gap-5 transition-colors duration-500 hover:bg-white/[0.025]"
            >
              {/* hover accent line on top */}
              <span
                aria-hidden
                className="absolute top-0 left-0 h-px w-8 transition-all duration-500 group-hover:w-full"
                style={{ background: "var(--partner-primary)" }}
              />

              <header className="flex items-start justify-between gap-3">
                <span
                  className="font-[var(--font-moisette)] text-5xl md:text-6xl leading-none tracking-tight"
                  style={{ color: "var(--partner-primary)" }}
                >
                  {c.iconLabel || String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-mono tabular-nums text-[10px] uppercase tracking-widest text-white/30 mt-1">
                  {String(i + 1).padStart(2, "0")} /{" "}
                  {String(items.length).padStart(2, "0")}
                </span>
              </header>

              <div className="flex flex-col gap-2 mt-auto">
                <h3 className="text-lg md:text-xl font-medium leading-snug text-white/95">
                  {pickLang(language, c.titleMn, c.titleEn)}
                </h3>
                <p className="text-sm md:text-[15px] text-white/55 leading-relaxed">
                  {pickLang(language, c.bodyMn, c.bodyEn)}
                </p>
              </div>

              {/* corner ornament */}
              <span
                aria-hidden
                className="absolute bottom-3 right-3 h-1.5 w-1.5 rounded-full transition-opacity opacity-0 group-hover:opacity-100"
                style={{ background: "var(--partner-primary)" }}
              />
            </motion.article>
          ))}
        </div>
      )}
    </section>
  );
}
