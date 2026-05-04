"use client";

import { useEffect, useMemo } from "react";
import { ScrollControlProvider } from "@/components/scroll-control";
import { TrackedSection } from "@/components/analytics/tracked-section";
import PartnerHeader from "@/components/partner/header";
import PartnerHero from "@/components/partner/hero";
import PartnerIntroduction from "@/components/partner/introduction";
import PartnerConditions from "@/components/partner/conditions";
import PartnerDownload from "@/components/partner/download";
import PartnerFaq from "@/components/partner/faq";
import PartnerFooter from "@/components/partner/footer";
import { GrainOverlay, MarqueeStrip } from "@/components/partner/_decor";
import { useLanguage } from "@/lib/language-context";
import {
  pickLang,
  type PartnerPageBundle,
} from "@/lib/partners/shared";

export default function PartnerClient({ bundle }: { bundle: PartnerPageBundle }) {
  const { language } = useLanguage();

  // Lock the page background to the partner palette
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--partner-primary",
      bundle.page.primaryColor || "#f5875a",
    );
    return () => {
      document.documentElement.style.removeProperty("--partner-primary");
    };
  }, [bundle.page.primaryColor]);

  const marqueeItems = useMemo(() => {
    const partnerName = pickLang(
      language,
      bundle.page.nameMn,
      bundle.page.nameEn,
    );
    const eyebrow = pickLang(
      language,
      bundle.page.heroEyebrowMn,
      bundle.page.heroEyebrowEn,
    );
    const items = [
      partnerName ? `${partnerName} × Tenger Capital` : "Tenger Capital",
      eyebrow,
      language === "en" ? "Trusted underwriting" : "Найдвартай андеррайтер",
      language === "en" ? "Issue 2026" : "2026 оны хувилбар",
      language === "en" ? "Regulated by FRC" : "СЗХ-ны зохицуулалтын дор",
    ].filter(Boolean) as string[];
    return items.length > 0 ? items : ["Tenger Capital"];
  }, [bundle.page, language]);

  return (
    <ScrollControlProvider>
    <div
      className="partner-page relative min-h-screen bg-[#0a0a0a] text-white selection:bg-[color-mix(in_oklch,var(--partner-primary)_60%,transparent)] selection:text-white"
      style={{
        ["--partner-primary" as string]: bundle.page.primaryColor || "#f5875a",
      }}
    >
      <GrainOverlay />

      <PartnerHeader bundle={bundle} />

      <main className="flex flex-col">
        <TrackedSection id="hero">
          <div id="hero">
            <PartnerHero bundle={bundle} />
          </div>
        </TrackedSection>

        <MarqueeStrip items={marqueeItems} />

        <TrackedSection id="introduction">
          <div id="introduction">
            <PartnerIntroduction bundle={bundle} />
          </div>
        </TrackedSection>

        <TrackedSection id="conditions">
          <div id="conditions">
            <PartnerConditions bundle={bundle} />
          </div>
        </TrackedSection>

        <TrackedSection id="download">
          <div id="download">
            <PartnerDownload bundle={bundle} />
          </div>
        </TrackedSection>

        <TrackedSection id="faq">
          <div id="faq">
            <PartnerFaq bundle={bundle} />
          </div>
        </TrackedSection>
      </main>

      <PartnerFooter bundle={bundle} />
    </div>
    </ScrollControlProvider>
  );
}
