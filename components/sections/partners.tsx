"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import GradientBorderButton from "../gradient-border-button";

const techLogos = [
  { src: "/logo/logo_main_white.png", alt: "OpenAI" },
  { src: "/logo/logo_main_black.png", alt: "OpenAI" },
  { src: "/logo/logo_main_light.png", alt: "OpenAI" },
  { src: "/logo/logo_main_dark.png", alt: "OpenAI" },
];

export default function Partners() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % techLogos.length);
    }, 2500); // change logo every 2.5s
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="flex flex-col md:flex-row w-full min-h-[400px] rounded-3xl bg-[#0a0a0a] text-white p-8 gap-8 md:gap-16">
      {/* LEFT PANEL */}
      <div className="flex flex-col justify-center md:w-1/2 space-y-6">
        <p className="text-sm md:text-base text-gray-300 leading-relaxed">
          Titan clients include professionals from some of the most iconic
          institutions in the US.
        </p>
        <div className="flex flex-wrap gap-3">
          <GradientBorderButton>Tech</GradientBorderButton>
          <GradientBorderButton>Gov’t</GradientBorderButton>
          <GradientBorderButton>Finance</GradientBorderButton>
          <GradientBorderButton>Others</GradientBorderButton>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex justify-center items-center md:w-1/2 relative overflow-hidden rounded-3xl bg-[#111]">
        <AnimatePresence mode="wait">
          <motion.div
            key={techLogos[index].src}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="absolute flex justify-center items-center w-full h-full"
          >
            <Image
              src={techLogos[index].src}
              alt={techLogos[index].alt}
              width={160}
              height={160}
              className="object-contain opacity-90"
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
