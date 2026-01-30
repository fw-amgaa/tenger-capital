"use client";

import { useAnimationFrame } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import Seperator from "../seperator";
import { useLanguage } from "@/lib/language-context";

const techLogos = [
  { src: "/partners/Alliance capital.png", alt: "Alliance capital" },
  { src: "/partners/AODE.png", alt: "AODE" },
  { src: "/partners/bers capital.png", alt: "bers capital" },
  { src: "/partners/bers finance.png", alt: "bers finance" },
  { src: "/partners/bichil globus.png", alt: "bichil globus" },
  { src: "/partners/bichil globus.svg", alt: "bichil globus" },
  { src: "/partners/eco car.png", alt: "eco car" },
  { src: "/partners/finco.svg", alt: "finco" },
  { src: "/partners/FRC.png", alt: "FRC" },
  { src: "/partners/global town.png", alt: "global town" },
  { src: "/partners/IBKR.png", alt: "IBKR" },
  { src: "/partners/KA mining.png", alt: "KA mining" },
  { src: "/partners/khan -altai.png", alt: "khan -altai" },
  { src: "/partners/lend mn.png", alt: "lend mn" },
  { src: "/partners/MASD.png", alt: "MASD" },
  { src: "/partners/master group.png", alt: "master group" },
  { src: "/partners/monaybox.png", alt: "monaybox" },
  { src: "/partners/mongol alt.png", alt: "mongol alt" },
  { src: "/partners/monos.png", alt: "monos" },
  { src: "/partners/MSE.png", alt: "MSE" },
  { src: "/partners/mtrip.png", alt: "mtrip" },
  { src: "/partners/MTZ.png", alt: "MTZ" },
  { src: "/partners/munkhiin useg.png", alt: "munkhiin useg" },
  { src: "/partners/neocity.png", alt: "neocity" },
  { src: "/partners/neocity.svg", alt: "neocity" },
  { src: "/partners/numus.png", alt: "numus" },
  { src: "/partners/premier invest.png", alt: "premier invest" },
  { src: "/partners/shunkhlai.png", alt: "shunkhlai" },
  { src: "/partners/tsetsens maining.png", alt: "tsetsens maiming" },
];

export default function Partners() {
  const baseX = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useAnimationFrame((t, delta) => {
    if (!containerRef.current) return;
    const speed = 0.05; // adjust speed here
    baseX.current -= speed * delta;
    if (baseX.current <= -containerRef.current.scrollWidth / 2) {
      baseX.current = 0; // reset when half scrolled (since duplicated)
    }
    containerRef.current.style.transform = `translateX(${baseX.current}px)`;
  });

  return (
    <div className="section-container flex flex-col gap-8">
      <Seperator />

      <div className="grid md:grid-cols-2">
        <h1 className="text-4xl">{t("Partners")}</h1>

        <div className="flex flex-col gap-6">
          <p className="text-lg leading-[1.4]">{t("Partners")}</p>
        </div>
      </div>

      <div className="relative overflow-hidden flex items-center justify-center w-full min-h-[160px] md:mt-24 md:mb-32">
        <div className="absolute left-0 top-0 h-full bg-red w-20 z-10" />

        <div
          ref={containerRef}
          className="flex gap-12 items-center absolute will-change-transform"
        >
          {[...techLogos, ...techLogos].map((logo, i) => (
            <div
              key={i}
              className="w-[120px] h-[40px] flex items-center justify-center"
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={120}
                height={40}
                className="object-cover grayscale hover:grayscale-0 transition-all duration-300 ease-in-out cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
