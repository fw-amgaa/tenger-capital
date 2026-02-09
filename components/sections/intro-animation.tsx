"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useLanguage } from "@/lib/language-context";
import { cn } from "@/lib/utils";

interface IntroAnimationProps {
  onComplete?: () => void;
  typingDuration?: number;
  fadeDuration?: number;
}

export function IntroAnimation({
  onComplete,
  typingDuration = 3000,
  fadeDuration = 0,
}: IntroAnimationProps) {
  const { t, language } = useLanguage();
  const [visible, setVisible] = useState(true);
  const ref = useRef(null);

  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const fadeTimer = setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, typingDuration + fadeDuration);

    return () => {
      clearTimeout(fadeTimer);
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [onComplete, typingDuration, fadeDuration]);

  if (!visible) return null;

  return (
    <h2
      ref={ref}
      className={cn(
        "fixed inset-0 z-100 flex items-center justify-center bg-black text-2xl md:text-4xl lg:text-6xl px-2 sm:px-8",
        language === "mn" ? "flex-col" : "flex-wrap",
      )}
    >
      {(() => {
        const text = t("Create Value Through Investing");
        const letterDelay = language === "mn" ? 0.04 : 0.05;
        let globalIndex = 0;

        if (language === "mn") {
          const mid = text.indexOf(" ", Math.floor(text.length / 2));
          const lines =
            mid > -1 ? [text.slice(0, mid), text.slice(mid + 1)] : [text];
          return lines.map((line, lineIdx) => (
            <span
              key={lineIdx}
              className="flex w-full justify-center items-center"
            >
              {line.split("").map((letter) => {
                const i = globalIndex++;
                return (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.2, delay: i * letterDelay }}
                  >
                    {letter === " " ? "\u00A0" : letter}
                  </motion.span>
                );
              })}
            </span>
          ));
        }

        return text.split("").map((letter, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.2, delay: index * letterDelay }}
          >
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
        ));
      })()}
    </h2>
  );
}
