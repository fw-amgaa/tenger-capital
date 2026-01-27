"use client";

import AutoScrollGallery from "./auto-scroll-gallery";
import GradientBorderButton from "../../gradient-border-button";
import { motion } from "framer-motion";
import TextCarousel from "../../ui/text-carousel";
import InfoBubbleDialog from "../info-bubble-dialog";
import Link from "next/link";
import { useLanguage } from "@/lib/language-context";

export default function HeroSection({ introDone }: { introDone: boolean }) {
  const { t } = useLanguage();

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: introDone ? 1 : 0 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="section-container mt-32 md:mt-0 md:h-screen relative flex flex-wrap items-center justify-center md:justify-between md:px-16 lg:px-32 xl:px-48 space-y-8 md:gap-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: introDone ? 1 : 0, y: introDone ? 0 : 40 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="z-10 md:w-[370px] text-center md:text-left"
      >
        <div className="flex items-center gap-4 justify-center md:justify-start">
          <TextCarousel
            items={[
              t("Established in 2007."),
              t("One of top 3 securities as of 2026."),
              t("Raised over ₮300 Billion in 2025H2."),
            ]}
          />
          <InfoBubbleDialog
            items={[
              t("Established in 2007."),
              t("One of top 3 securities as of 2026."),
              t("Raised over ₮300 Billion in 2025H2."),
            ]}
          />
        </div>
        <h1 className="text-4xl md:text-5xl tracking-tight text-primary mb-4 mt-6">
          {t("Create Value Through Investing")}
        </h1>
        <p className="text-sm font-light text-muted-foreground max-w-xl mx-auto mb-8">
          {t("Underwriting | Brokerage | Wealth Management")}
        </p>

        <div className="flex gap-2 justify-center md:justify-start">
          <Link
            href="https://xacex.tengercapital.mn/auth/login"
            target="_blank"
          >
            <GradientBorderButton>{t("OPEN")}</GradientBorderButton>
          </Link>
          <GradientBorderButton hasBorder={false} borderAnimation={false}>
            {t("SUBMIT YOUR PROJECT")}
          </GradientBorderButton>
        </div>
      </motion.div>

      <AutoScrollGallery />
    </motion.main>
  );
}
