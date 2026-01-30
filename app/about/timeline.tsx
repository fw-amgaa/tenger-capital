"use client";

import { Timeline } from "@/components/ui/timeline";
import { useLanguage } from "@/lib/language-context";
import Image from "next/image";

function TimelineItem({
  title,
  facts,
  imagePath,
  reverse,
}: {
  title: string;
  facts: string[];
  imagePath: string;
  reverse?: boolean;
}) {
  return (
    <div className="grid grid-cols-2 gap-8 md:gap-16 lg:gap-24 items-center">
      {reverse && (
        <div>
          <div className="mb-2 h-px w-24 bg-gradient-to-r from-[rgb(255,153,0)] to-transparent" />
          {facts.map((fact, index) => (
            <p
              key={index}
              className="mb-5 h-10 text-xs font-normal md:text-sm text-neutral-200"
            >
              {fact}
            </p>
          ))}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:gap-4">
        <div className="border rounded-sm overflow-hidden w-full h-24 lg:h-36 xl:h-48 bg-[#111111] p-1">
          <div className="relative bg-black w-full h-full rounded-xs">
            <Image src={imagePath} alt={title} objectFit="cover" fill />
          </div>
        </div>
      </div>
      {!reverse && (
        <div>
          <div className="mb-2 h-px w-24 bg-gradient-to-r from-[rgb(255,153,0)] to-transparent" />
          {facts.map((fact, index) => (
            <p
              key={index}
              className="mb-5 h-10 text-xs font-normal md:text-sm text-neutral-200"
            >
              {fact}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export function TimelineSection() {
  const { t } = useLanguage();
  const data = [
    {
      title: "2007",
      content: (
        <div key="1" className="flex flex-col gap-8 md:gap-16">
          <TimelineItem
            title="Songdo"
            facts={[t("timeline.2007.songdo")]}
            imagePath="/timeline/songdo.png"
          />

          <TimelineItem
            title="Gemnet"
            facts={[t("timeline.2007.gemnet")]}
            imagePath="/timeline/gemnet.png"
            reverse
          />

          <TimelineItem
            title="Premium Concrete"
            facts={[t("timeline.2007.premium")]}
            imagePath="/timeline/premium-concrete.png"
          />

          <TimelineItem
            title="Master Group"
            facts={[
              t("timeline.2007.master1"),
              t("timeline.2007.master2"),
            ]}
            imagePath="/partners/master group.png"
            reverse
          />

          <TimelineItem
            title="Tenger Insurance"
            facts={[
              t("timeline.2007.tenger1"),
              t("timeline.2007.tenger2"),
            ]}
            imagePath="/timeline/tenger.png"
          />
        </div>
      ),
    },
    {
      title: t("2023 Q3"),
      content: (
        <div key="2">
          <div className="mb-2 h-px w-24 bg-gradient-to-r from-[rgb(255,153,0)] to-transparent" />
          <p className="mb-8 text-xs font-normal md:text-sm text-neutral-200">
            {t("timeline.2023q3.lendmn")}
          </p>
          <p className="mb-8 text-xs font-normal md:text-sm text-neutral-200">
            {t("timeline.2023q3.agro")}
          </p>
        </div>
      ),
    },
    {
      title: t("2023 Q4"),
      content: (
        <div key="2">
          <div className="mb-2 h-px w-24 bg-gradient-to-r from-[rgb(255,153,0)] to-transparent" />
          <p className="mb-8 text-xs font-normal md:text-sm dark:text-neutral-200">
            {t("timeline.2023q4.lendmn")}
          </p>
          <p className="mb-8 text-xs font-normal md:text-sm dark:text-neutral-200">
            {t("timeline.2023q4.bumbiin")}
          </p>
          <p className="mb-8 text-xs font-normal md:text-sm dark:text-neutral-200">
            {t("timeline.2023q4.health")}
          </p>
        </div>
      ),
    },
    {
      title: t("2024 Q1"),
      content: (
        <div key="2">
          <div className="mb-2 h-px w-24 bg-gradient-to-r from-[rgb(255,153,0)] to-transparent" />
          <p className="mb-8 text-xs font-normal md:text-sm dark:text-neutral-200">
            {t("timeline.2024q1.gsb")}
          </p>
          <p className="mb-8 text-xs font-normal md:text-sm dark:text-neutral-200">
            {t("timeline.2024q1.lendmn")}
          </p>
        </div>
      ),
    },
    {
      title: t("2024 Q2"),
      content: (
        <div key="2">
          <div className="mb-2 h-px w-24 bg-gradient-to-r from-[rgb(255,153,0)] to-transparent" />
          <p className="mb-8 text-xs font-normal md:text-sm dark:text-neutral-200">
            {t("timeline.2024q2.dem")}
          </p>
          <p className="mb-8 text-xs font-normal md:text-sm dark:text-neutral-200">
            {t("timeline.2024q2.platin")}
          </p>
        </div>
      ),
    },
    {
      title: t("2024 Q4"),
      content: (
        <div key="2">
          <div className="mb-2 h-px w-24 bg-gradient-to-r from-[rgb(255,153,0)] to-transparent" />
          <p className="mb-8 text-xs font-normal md:text-sm dark:text-neutral-200">
            {t("timeline.2024q4.shunkhlai")}
          </p>
        </div>
      ),
    },
    {
      title: t("2025 Q1"),
      content: (
        <div key="3">
          <div className="mb-8">
            <div className="mb-2 h-px w-24 bg-gradient-to-r from-[rgb(255,153,0)] to-transparent" />
            <p className="mb-8 text-xs font-normal md:text-sm dark:text-neutral-200">
              {t("timeline.2025q1.abts")}
            </p>
            <p className="mb-8 text-xs font-normal md:text-sm dark:text-neutral-200">
              {t("timeline.2025q1.khan")}
            </p>
            <p className="mb-8 text-xs font-normal md:text-sm dark:text-neutral-200">
              {t("timeline.2025q1.premier")}
            </p>
          </div>
        </div>
      ),
    },
    {
      title: t("2025 Q2"),
      content: (
        <div key="3">
          <div className="mb-8">
            <div className="mb-2 h-px w-24 bg-gradient-to-r from-[rgb(255,153,0)] to-transparent" />
            <p className="mb-8 text-xs font-normal md:text-sm dark:text-neutral-200">
              {t("timeline.2025q2.bers")}
            </p>
            <p className="mb-8 text-xs font-normal md:text-sm dark:text-neutral-200">
              {t("timeline.2025q2.eco")}
            </p>
            <p className="mb-8 text-xs font-normal md:text-sm dark:text-neutral-200">
              {t("timeline.2025q2.munkhiin")}
            </p>
            <p className="mb-8 text-xs font-normal md:text-sm dark:text-neutral-200">
              {t("timeline.2025q2.alliance")}
            </p>
            <p className="mb-8 text-xs font-normal md:text-sm dark:text-neutral-200">
              {t("timeline.2025q2.mongolalt")}
            </p>
          </div>
        </div>
      ),
    },
    {
      title: t("2025 Q3"),
      content: (
        <div key="3">
          <div className="mb-8">
            <div className="mb-2 h-px w-24 bg-gradient-to-r from-[rgb(255,153,0)] to-transparent" />
            <p className="mb-8 text-xs font-normal md:text-sm dark:text-neutral-200">
              {t("timeline.2025q3.bichil")}
            </p>
            <p className="mb-8 text-xs font-normal md:text-sm dark:text-neutral-200">
              {t("timeline.2025q3.monblox")}
            </p>
            <p className="mb-8 text-xs font-normal md:text-sm dark:text-neutral-200">
              {t("timeline.2025q3.westhill")}
            </p>
            <p className="mb-8 text-xs font-normal md:text-sm dark:text-neutral-200">
              {t("timeline.2025q3.finco")}
            </p>
          </div>
        </div>
      ),
    },
  ];
  return (
    <div className="relative w-full overflow-clip">
      <Timeline data={data} />
    </div>
  );
}
