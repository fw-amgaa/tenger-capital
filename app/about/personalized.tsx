"use client";

import { useLanguage } from "@/lib/language-context";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Personalized() {
  const introDone = true;
  const { t } = useLanguage();
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: introDone ? 1 : 0 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="section-container mt-16 md:mt-0 md:h-screen relative flex flex-wrap items-center justify-center md:justify-between md:px-16 lg:px-32 xl:px-48 space-y-8 md:gap-8"
    >
      <div className="w-full md:w-[45%] aspect-[279/333] md:aspect-[500/630] rounded-3xl overflow-hidden relative">
        <Image
          src={"/about-us/personalized-service.jpg"}
          alt="hero"
          fill
          objectFit="cover"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: introDone ? 1 : 0, y: introDone ? 0 : 40 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="z-10 md:w-[370px] text-center md:text-left"
      >
        <h3 className="text-3xl md:text-4xl tracking-tight text-primary mb-1 mt-6">
          {t("A service as individual as you are")}
        </h3>
        <div className="mt-2 mb-4 h-px w-24 bg-gradient-to-r from-[rgb(255,153,0)] to-transparent" />

        <p className="text-md text-white/80">{t("personalized.desc")}</p>
      </motion.div>
    </motion.main>
  );
}
