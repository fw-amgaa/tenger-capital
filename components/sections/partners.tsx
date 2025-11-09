"use client";

import { useAnimationFrame } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import GradientBorderButton from "../gradient-border-button";
import Seperator from "../seperator";

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
    <div className="section-container flex flex-col gap-8">
      <Seperator />

      <div className="grid md:grid-cols-2">
        <h1 className="text-4xl">Partners</h1>

        <div className="flex flex-col gap-6">
          <p className="text-lg leading-[1.4]">
            We partner with only the rich and wealthy, not with some fodders, peasants and commoners.
          </p>
        </div>
      </div>

      <div className="relative overflow-hidden flex items-center justify-center w-full min-h-[160px] mt-48 mb-64">
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
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
