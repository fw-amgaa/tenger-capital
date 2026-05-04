"use client";

import { motion } from "framer-motion";
import { Download, FileText } from "lucide-react";
import GradientBorderButton from "@/components/gradient-border-button";
import { useLanguage } from "@/lib/language-context";
import { pickLang, type PartnerPageBundle } from "@/lib/partners/shared";
import { AmbientOrb, SectionEyebrow } from "./_decor";

export default function PartnerDownload({
  bundle,
}: {
  bundle: PartnerPageBundle;
}) {
  const { language } = useLanguage();
  const { page } = bundle;

  const title = pickLang(language, page.downloadTitleMn, page.downloadTitleEn);
  const desc = pickLang(language, page.downloadDescMn, page.downloadDescEn);
  const ctaLabel = pickLang(language, page.pdfCtaLabelMn, page.pdfCtaLabelEn);
  const partnerName = pickLang(language, page.nameMn, page.nameEn);

  return (
    <section className="section-container py-20 md:py-28">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-[32px] overflow-hidden border border-white/8 p-8 md:p-14 lg:p-16"
        style={{
          background:
            "linear-gradient(135deg, color-mix(in oklch, var(--partner-primary) 14%, #0a0a0a) 0%, #0a0a0a 65%)",
        }}
      >
        <AmbientOrb
          className="-right-20 -top-20 h-[420px] w-[420px]"
          intensity={0.32}
        />
        <motion.div
          aria-hidden
          animate={{ rotate: 360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          className="absolute -right-32 top-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full opacity-25"
          style={{
            background:
              "conic-gradient(from 0deg, transparent, var(--partner-primary), transparent 60%)",
            filter: "blur(60px)",
          }}
        />

        {/* faint editorial grid in the bg */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px)",
            backgroundSize: "80px 100%",
          }}
        />

        <div className="relative z-10 grid md:grid-cols-12 gap-10 items-end">
          {/* Text */}
          <div className="md:col-span-7 flex flex-col gap-6">
            <SectionEyebrow
              index={3}
              label={language === "en" ? "Download" : "Татах"}
            />
            <h2 className="font-[var(--font-moisette)] tracking-tight leading-[1.02] text-4xl md:text-5xl lg:text-6xl">
              {title ||
                (language === "en"
                  ? "Get the full brief"
                  : "Бүрэн танилцуулгыг авах")}
            </h2>
            {desc ? (
              <p className="text-base md:text-lg text-white/70 max-w-2xl leading-relaxed">
                {desc}
              </p>
            ) : null}

            <div className="flex flex-wrap items-center gap-4 mt-2">
              {page.pdfUrl ? (
                <a
                  href={page.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-tc-cta={`partner-${page.slug}-download-block`}
                >
                  <GradientBorderButton iconComponent={<Download size={14} />}>
                    {ctaLabel}
                  </GradientBorderButton>
                </a>
              ) : (
                <span className="text-sm text-white/40">
                  {language === "en"
                    ? "PDF not yet available"
                    : "PDF файл бэлэн биш"}
                </span>
              )}

              <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.22em] text-white/45">
                <span>PDF</span>
                <span aria-hidden className="h-px w-6 bg-white/15" />
                <span>MN · EN</span>
                <span aria-hidden className="h-px w-6 bg-white/15" />
                <span>2026</span>
              </div>
            </div>
          </div>

          {/* PDF mockup card */}
          <motion.div
            initial={{ opacity: 0, x: 24, rotate: -2 }}
            whileInView={{ opacity: 1, x: 0, rotate: -4 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ rotate: -2, y: -6 }}
            className="md:col-span-5 relative justify-self-center md:justify-self-end w-full max-w-[300px] aspect-[3/4] rounded-2xl overflow-hidden"
            style={{
              background:
                "linear-gradient(160deg, color-mix(in oklch, var(--partner-primary) 40%, #0a0a0a) 0%, #0a0a0a 100%)",
              boxShadow:
                "0 30px 80px -20px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)",
            }}
          >
            {/* Mock content */}
            <div className="absolute inset-0 p-6 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <FileText
                  size={18}
                  style={{ color: "var(--partner-primary)" }}
                />
                <span className="font-mono text-[9px] uppercase tracking-widest text-white/45">
                  {String(new Date().getFullYear()).slice(-2)}/
                  {String(new Date().getMonth() + 1).padStart(2, "0")}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-[10px] uppercase tracking-[0.22em] text-white/55">
                  {language === "en" ? "Investment brief" : "Хөрөнгө оруулалтын танилцуулга"}
                </span>
                <span className="font-[var(--font-moisette)] text-2xl tracking-tight leading-tight text-white">
                  {partnerName}
                </span>

                <div className="mt-4 flex flex-col gap-1.5">
                  <span className="h-px w-full bg-white/10" />
                  <span className="h-px w-2/3 bg-white/10" />
                  <span className="h-px w-1/2 bg-white/10" />
                </div>
              </div>
            </div>

            {/* corner stripe */}
            <span
              aria-hidden
              className="absolute -top-px -left-px h-16 w-1 rounded-full"
              style={{ background: "var(--partner-primary)" }}
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
