"use client";

import Image from "next/image";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { Download, ShoppingBag, Menu, X } from "lucide-react";
import GradientBorderButton from "@/components/gradient-border-button";
import { useLanguage } from "@/lib/language-context";
import { pickLang, type PartnerPageBundle } from "@/lib/partners/shared";
import { cn } from "@/lib/utils";

type NavItem = { id: string; labelMn: string; labelEn: string };

const NAV_ITEMS: NavItem[] = [
  { id: "hero", labelMn: "Эхлэл", labelEn: "Top" },
  { id: "introduction", labelMn: "Танилцуулга", labelEn: "About" },
  { id: "conditions", labelMn: "Нөхцөл", labelEn: "Conditions" },
  { id: "download", labelMn: "Татах", labelEn: "Download" },
  { id: "faq", labelMn: "Асуулт", labelEn: "FAQ" },
];

export default function PartnerHeader({
  bundle,
}: {
  bundle: PartnerPageBundle;
}) {
  const { language, toggleLanguage } = useLanguage();
  const { page } = bundle;
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 30));

  const tengerLogo = page.tengerLogoUrl || "/logo/logo_main_light_new.png";

  const handleNavClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileOpen(false);
  };

  return (
    <motion.header
      animate={{
        backgroundColor: scrolled ? "rgba(10,10,10,0.85)" : "rgba(10,10,10,0)",
        backdropFilter: scrolled ? "blur(14px)" : "blur(0px)",
        borderBottomColor: scrolled
          ? "rgba(255,255,255,0.08)"
          : "rgba(255,255,255,0)",
      }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-transparent"
    >
      <div className="section-container flex items-center justify-between gap-4 py-3 md:py-4">
        {/* Logos */}
        <div className="flex items-center gap-3 md:gap-5 shrink-0">
          <div className="relative h-7 md:h-9 w-[100px] md:w-[140px]">
            <Image
              src={tengerLogo}
              alt="Tenger Capital"
              fill
              className="object-contain object-left"
              sizes="140px"
              priority
            />
          </div>
          {page.partnerLogoUrl ? (
            <>
              <span
                className="hidden sm:inline-block h-6 w-px"
                style={{ background: "rgba(255,255,255,0.18)" }}
                aria-hidden
              />
              <div className="relative h-7 md:h-9 w-[100px] md:w-[140px]">
                <Image
                  src={page.partnerLogoUrl}
                  alt={pickLang(language, page.nameMn, page.nameEn)}
                  fill
                  className="object-contain object-left"
                  sizes="140px"
                  priority
                />
              </div>
            </>
          ) : null}
        </div>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className="px-3 py-2 text-xs uppercase tracking-wider text-white/60 hover:text-white transition-colors cursor-pointer"
            >
              {language === "en" ? item.labelEn : item.labelMn}
            </button>
          ))}
        </nav>

        {/* Right: language + CTAs */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          {/* <button
            onClick={toggleLanguage}
            className="hidden sm:inline-block px-3 py-1.5 text-[10px] font-semibold uppercase text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            {language === "en" ? "ENG" : "MGL"}
          </button> */}

          {page.pdfUrl ? (
            <a
              href={page.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-tc-cta={`partner-${page.slug}-pdf`}
              className="hidden md:inline-flex"
            >
              <GradientBorderButton
                hasBorder={false}
                borderAnimation={false}
                iconComponent={<Download size={12} />}
              >
                {pickLang(language, page.pdfCtaLabelMn, page.pdfCtaLabelEn)}
              </GradientBorderButton>
            </a>
          ) : null}

          {page.orderUrl ? (
            <a
              href={page.orderUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-tc-cta={`partner-${page.slug}-order`}
            >
              <GradientBorderButton iconComponent={<ShoppingBag size={12} />}>
                {pickLang(language, page.orderCtaLabelMn, page.orderCtaLabelEn)}
              </GradientBorderButton>
            </a>
          ) : (
            <button
              type="button"
              data-tc-cta={`partner-${page.slug}-order`}
              aria-label="Place order"
              className="cursor-pointer"
            >
              <GradientBorderButton iconComponent={<ShoppingBag size={12} />}>
                {pickLang(language, page.orderCtaLabelMn, page.orderCtaLabelEn)}
              </GradientBorderButton>
            </button>
          )}

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="lg:hidden text-white/70 hover:text-white p-2 cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      <motion.div
        initial={false}
        animate={{
          height: mobileOpen ? "auto" : 0,
          opacity: mobileOpen ? 1 : 0,
        }}
        transition={{ duration: 0.25 }}
        className={cn("lg:hidden overflow-hidden", "bg-black/95 backdrop-blur")}
      >
        <nav className="section-container flex flex-col py-4 gap-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className="text-left px-3 py-3 text-sm uppercase tracking-wider text-white/70 hover:text-white border-b border-white/5 cursor-pointer"
            >
              {language === "en" ? item.labelEn : item.labelMn}
            </button>
          ))}
          <button
            onClick={toggleLanguage}
            className="text-left px-3 py-3 text-xs uppercase tracking-wider text-white/50 cursor-pointer"
          >
            {language === "en" ? "ENG → MGL" : "MGL → ENG"}
          </button>
        </nav>
      </motion.div>
    </motion.header>
  );
}
