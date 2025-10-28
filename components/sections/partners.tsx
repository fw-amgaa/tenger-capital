"use client";

import { useAnimationFrame } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import GradientBorderButton from "../gradient-border-button";

const techLogos = [
  { src: "/partners/binance.png", alt: "binance" },
  { src: "/partners/mastercard.png", alt: "mastercard" },
  { src: "/partners/pay-pal.png", alt: "paypal" },
  { src: "/partners/google.webp", alt: "google" },
];

export default function Partners() {
  const baseX = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

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
    <section className="flex flex-col md:flex-row w-full text-white gap-4 md:gap-8 mb-16 md:mb-64">
      {/* LEFT PANEL */}
      <div className="flex flex-col items-center justify-center space-y-6 bg-[#1a1a1a] rounded-3xl p-8 aspect-[0.75]">
        <p className="text-xs md:text-sm text-gray-300 leading-relaxed text-center">
          Tenger capital clients include professionals from some of the most
          iconic institutions in Mongolia.
        </p>
        <div className="flex flex-wrap gap-3">
          <GradientBorderButton showArrow={false}>Tech</GradientBorderButton>
          <GradientBorderButton showArrow={false} borderAnimation={false}>
            Gov’t
          </GradientBorderButton>
          <GradientBorderButton showArrow={false} borderAnimation={false}>
            Finance
          </GradientBorderButton>
          <GradientBorderButton showArrow={false} borderAnimation={false}>
            Others
          </GradientBorderButton>
        </div>
      </div>

      {/* RIGHT PANEL — Infinite Carousel */}
      <div className="relative overflow-hidden rounded-3xl bg-[#1a1a1a] flex items-center justify-center md:w-2/3 min-h-[160px]">
        <div
          ref={containerRef}
          className="flex gap-12 items-center absolute will-change-transform"
        >
          {[...techLogos, ...techLogos].map((logo, i) => (
            <div
              key={i}
              className="w-[160px] h-[60px] flex items-center justify-center"
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={160}
                height={60}
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
