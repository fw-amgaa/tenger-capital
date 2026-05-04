"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Download, ShoppingBag } from "lucide-react";
import GradientBorderButton from "@/components/gradient-border-button";
import { useLanguage } from "@/lib/language-context";
import { pickLang, type PartnerPageBundle } from "@/lib/partners/shared";
import { AmbientOrb, ScrollCue } from "./_decor";

const FALLBACK_IMAGE = "/home/hero.jpg";

export default function PartnerHero({ bundle }: { bundle: PartnerPageBundle }) {
  const { language } = useLanguage();
  const { page, heroSlides } = bundle;
  const [index, setIndex] = useState(0);

  const slides = useMemo(
    () =>
      heroSlides.length > 0
        ? heroSlides
        : [
            {
              id: "fallback",
              type: "image",
              url: FALLBACK_IMAGE,
              pageId: page.id,
              sortOrder: 0,
            },
          ],
    [heroSlides, page.id],
  );
  const current = slides[index] ?? slides[0];

  useEffect(() => {
    if (slides.length <= 1) return;
    if (current.type !== "image") return;
    const t = setTimeout(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 6500);
    return () => clearTimeout(t);
  }, [index, slides, current.type]);

  // Parallax for the image card
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -30]);

  const titleText =
    pickLang(language, page.heroTitleMn, page.heroTitleEn) ||
    pickLang(language, page.nameMn, page.nameEn);
  const eyebrow = pickLang(language, page.heroEyebrowMn, page.heroEyebrowEn);
  const subtitle = pickLang(language, page.heroSubtitleMn, page.heroSubtitleEn);
  const partnerName = pickLang(language, page.nameMn, page.nameEn);

  return (
    <section
      ref={ref}
      className="relative min-h-screen w-full overflow-hidden flex items-center pt-24 md:pt-0"
    >
      {/* ambient lighting */}
      <AmbientOrb
        className="-top-40 -right-40 h-[640px] w-[640px]"
        intensity={0.22}
      />
      <AmbientOrb
        className="bottom-0 -left-40 h-[480px] w-[480px]"
        intensity={0.14}
      />

      {/* faint editorial grid */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "120px 120px",
        }}
      />

      <div className="section-container relative z-10 grid md:grid-cols-12 gap-10 md:gap-8 items-center w-full py-12 md:py-0">
        {/* Left: editorial text block */}
        <motion.div
          style={{ y: titleY }}
          className="md:col-span-7 lg:col-span-7 flex flex-col gap-7 z-10"
        >
          {/* top meta strip */}
          <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.28em] text-white/45">
            <span
              className="font-mono tabular-nums"
              style={{ color: "var(--partner-primary)" }}
            >
              ({String(new Date().getFullYear()).slice(-2)} ·{" "}
              {String(new Date().getMonth() + 1).padStart(2, "0")})
            </span>
            <span aria-hidden className="h-px w-10 bg-white/15" />
            <span>{language === "en" ? "Partnership" : "Хамтын ажиллагаа"}</span>
            <span aria-hidden className="h-px w-10 bg-white/15" />
            <span>{partnerName}</span>
          </div>

          {/* eyebrow tagline */}
          {eyebrow ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 self-start rounded-full border border-white/12 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-white/65 backdrop-blur"
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: "var(--partner-primary)" }}
              />
              {eyebrow}
            </motion.div>
          ) : null}

          {/* huge editorial title */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="font-[var(--font-moisette)] tracking-tight leading-[0.95] text-[44px] sm:text-6xl md:text-7xl lg:text-[88px] xl:text-[104px]"
          >
            {titleText}
          </motion.h1>

          {/* subtitle */}
          {subtitle ? (
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="text-base md:text-lg lg:text-xl text-white/65 max-w-2xl leading-relaxed"
            >
              {subtitle}
            </motion.p>
          ) : null}

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6 }}
            className="flex flex-wrap gap-3 mt-2"
          >
            {page.pdfUrl ? (
              <a
                href={page.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-tc-cta={`partner-${page.slug}-hero-pdf`}
              >
                <GradientBorderButton iconComponent={<Download size={12} />}>
                  {pickLang(language, page.pdfCtaLabelMn, page.pdfCtaLabelEn)}
                </GradientBorderButton>
              </a>
            ) : null}
            {page.orderUrl ? (
              <Link
                href={page.orderUrl}
                target="_blank"
                data-tc-cta={`partner-${page.slug}-hero-order`}
              >
                <GradientBorderButton
                  hasBorder={false}
                  borderAnimation={false}
                  iconComponent={<ShoppingBag size={12} />}
                >
                  {pickLang(
                    language,
                    page.orderCtaLabelMn,
                    page.orderCtaLabelEn,
                  )}
                </GradientBorderButton>
              </Link>
            ) : (
              <button
                type="button"
                data-tc-cta={`partner-${page.slug}-hero-order`}
                className="cursor-pointer"
              >
                <GradientBorderButton
                  hasBorder={false}
                  borderAnimation={false}
                  iconComponent={<ShoppingBag size={12} />}
                >
                  {pickLang(
                    language,
                    page.orderCtaLabelMn,
                    page.orderCtaLabelEn,
                  )}
                </GradientBorderButton>
              </button>
            )}
          </motion.div>
        </motion.div>

        {/* Right: image card with parallax + corner labels */}
        <motion.div
          style={{ y: imgY }}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative md:col-span-5 lg:col-span-5 w-full aspect-[4/5] md:aspect-[5/7] rounded-[28px] overflow-hidden bg-white/5"
        >
          <AnimatePresence mode="sync">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.4, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              {current.type === "video" ? (
                <video
                  src={current.url}
                  autoPlay
                  muted
                  loop
                  playsInline
                  onEnded={() => setIndex((i) => (i + 1) % slides.length)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Image
                  src={current.url}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 42vw, 100vw"
                  priority={index === 0}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* image overlay gradient */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(10,10,10,0.55), transparent 45%)",
            }}
          />

          {/* corner badges */}
          <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full border border-white/15 bg-black/30 backdrop-blur px-3 py-1 text-[10px] uppercase tracking-widest text-white/80">
            <span
              className="h-1.5 w-1.5 rounded-full animate-pulse"
              style={{ background: "var(--partner-primary)" }}
            />
            Live
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 text-white">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase tracking-[0.22em] opacity-70">
                {language === "en" ? "Featured asset" : "Онцлох хөрөнгө"}
              </span>
              <span className="text-sm font-medium opacity-95">
                {partnerName}
              </span>
            </div>
            <span className="font-mono tabular-nums text-[10px] opacity-70">
              {String(index + 1).padStart(2, "0")} /{" "}
              {String(slides.length).padStart(2, "0")}
            </span>
          </div>

          {/* inner ring */}
          <div
            className="pointer-events-none absolute inset-0 rounded-[28px]"
            style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)" }}
          />
        </motion.div>
      </div>

      <ScrollCue />

      {/* slide picker */}
      {slides.length > 1 ? (
        <div className="absolute bottom-6 right-6 md:right-12 flex gap-1.5">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setIndex(i)}
              aria-label={`Slide ${i + 1}`}
              className="h-1 transition-all"
              style={{
                width: i === index ? 24 : 8,
                background:
                  i === index
                    ? "var(--partner-primary)"
                    : "rgba(255,255,255,0.25)",
                borderRadius: 999,
              }}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
