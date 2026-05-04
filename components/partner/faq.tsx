"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/lib/language-context";
import { pickLang, type PartnerPageBundle } from "@/lib/partners/shared";
import { GrowingRule, SectionEyebrow } from "./_decor";

export default function PartnerFaq({ bundle }: { bundle: PartnerPageBundle }) {
  const { language } = useLanguage();
  const { page, faqs } = bundle;
  const [open, setOpen] = useState<string | null>(null);
  const title = pickLang(language, page.faqTitleMn, page.faqTitleEn);

  return (
    <section className="relative section-container py-32 md:py-44">
      <GrowingRule />

      <div className="grid md:grid-cols-12 gap-10 mt-12 md:mt-16">
        <div className="md:col-span-4">
          <div className="md:sticky md:top-32 flex flex-col gap-6">
            <SectionEyebrow
              index={4}
              label={language === "en" ? "Questions" : "Асуултууд"}
            />
            <h2 className="font-[var(--font-moisette)] tracking-tight leading-[1.02] text-4xl md:text-5xl lg:text-6xl">
              {title ||
                (language === "en"
                  ? "Frequently asked"
                  : "Түгээмэл асуулт")}
            </h2>
            <p className="text-sm text-white/50 max-w-xs leading-relaxed">
              {language === "en"
                ? "Can't find what you're looking for? Reach out to our team using the contact details in the footer."
                : "Хариулт олдоогүй бол доод хэсэгт байгаа холбоо барих мэдээллээр манай багтай холбогдоно уу."}
            </p>
          </div>
        </div>

        <div className="md:col-span-8 flex flex-col">
          {faqs.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/10 p-12 text-white/30 text-sm">
              {language === "en"
                ? "Add FAQ entries in the dashboard"
                : "Хяналтын самбараас FAQ нэмнэ үү"}
            </div>
          ) : (
            <ul>
              {faqs.map((q, i) => {
                const isOpen = open === q.id;
                return (
                  <motion.li
                    key={q.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{
                      duration: 0.6,
                      delay: i * 0.04,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="border-t border-white/8 last:border-b"
                  >
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : q.id)}
                      className="group w-full flex items-start gap-5 md:gap-8 py-6 md:py-7 text-left cursor-pointer"
                    >
                      <span
                        className="font-mono tabular-nums text-[11px] uppercase tracking-widest pt-1 transition-colors"
                        style={{
                          color: isOpen
                            ? "var(--partner-primary)"
                            : "rgba(255,255,255,0.35)",
                        }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="flex-1 text-lg md:text-xl lg:text-2xl text-white/90 group-hover:text-white transition-colors leading-snug">
                        {pickLang(language, q.qMn, q.qEn)}
                      </span>
                      <motion.span
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="shrink-0 mt-1 flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full border border-white/12 group-hover:border-white/30 transition-colors"
                        style={{
                          color: isOpen
                            ? "var(--partner-primary)"
                            : "rgba(255,255,255,0.7)",
                        }}
                      >
                        <Plus size={16} />
                      </motion.span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="pl-12 md:pl-[60px] pr-12 md:pr-16 pb-7 -mt-2 flex gap-5">
                            <span
                              aria-hidden
                              className="block w-px shrink-0"
                              style={{ background: "var(--partner-primary)" }}
                            />
                            <p className="text-sm md:text-[15px] text-white/65 leading-relaxed">
                              {pickLang(language, q.aMn, q.aEn)}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
