"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface IntroAnimationProps {
  text?: string;
  onComplete?: () => void;
  typingDuration?: number;
  fadeDuration?: number;
}

export function IntroAnimation({
  text = "Tenger Capital",
  onComplete,
  typingDuration = 3000,
  fadeDuration = 1000,
}: IntroAnimationProps) {
  const [visible, setVisible] = useState(true);
  const ref = useRef(null);

  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const fadeTimer = setTimeout(() => {
      setVisible(false);
      // onComplete?.();
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
      className="fixed inset-0 z-100 flex items-center justify-center bg-black"
    >
      {text.split("").map((letter, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.2, delay: index * 0.1 }}
        >
          {letter}
        </motion.span>
      ))}
    </h2>
  );
}
