"use client";

import { MacbookScroll } from "@/components/ui/macbook-scroll";
import { useLanguage } from "@/lib/language-context";

export function MacbookScrollSection() {
  const { t } = useLanguage();
  return (
    <div className="w-full overflow-hidden bg-[#1a1a1a]">
      <MacbookScroll
        title={<span>{t("What Tenger Capital will offer:")}</span>}
        src={`/about-us/dashboard.png`}
        showGradient={false}
      />
    </div>
  );
}
