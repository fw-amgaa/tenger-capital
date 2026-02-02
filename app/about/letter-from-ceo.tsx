"use client";

import { useLanguage } from "@/lib/language-context";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

export default function LetterFromCeo() {
  const ref = useRef(null);
  const isInView = useInView(ref);
  const { t } = useLanguage();

  return (
    <div
      ref={ref}
      style={{
        backgroundImage: 'url("/about-us/bg-pattern.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className="section-container px-8 md:px-16"
    >
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: isInView ? 1 : 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="md:mt-0 md:min-h-screen relative flex flex-wrap items-center justify-center md:justify-between md:px-16 lg:px-32 space-y-8 md:gap-16 py-16"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 40 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="z-10 md:w-[50%] text-center md:text-left"
        >
          <h1 className="text-4xl md:text-5xl tracking-tight text-primary mb-8 mt-6">
            {t("Letter from CEO")}
          </h1>
          <div className="max-w-xl mx-auto mb-8 flex flex-col gap-4">
            {t("ceo.letter").split("\n").map((paragraph, i) => (
              <p key={i} className="text-sm font-light italic text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </div>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            {t("ceo.regards")}
          </p>
          <p className="text-sm font-semibold text-primary mt-1">
            {t("ceo.name")}
          </p>
          <p className="text-xs text-muted-foreground">{t("ceo.title")}</p>
        </motion.div>

        <div className="w-full md:w-[40%] aspect-[279/333] md:aspect-[500/630] rounded-3xl overflow-hidden relative">
          <Image
            objectFit="cover"
            src={"/team-members/all-bw part1-3.jpg"}
            alt="hero"
            fill
          />
        </div>
      </motion.main>
    </div>
  );
}
