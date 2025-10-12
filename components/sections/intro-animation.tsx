"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

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
  const [typingDone, setTypingDone] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const typingTimer = setTimeout(() => setTypingDone(true), typingDuration);
    const fadeTimer = setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, typingDuration + fadeDuration);

    return () => {
      clearTimeout(typingTimer);
      clearTimeout(fadeTimer);
    };
  }, [onComplete, typingDuration, fadeDuration]);

  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: typingDone ? 0 : 1 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
    >
      <motion.h1
        className="text-white text-4xl md:text-6xl font-semibold font-sans"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <span className="typing-effect">{text}</span>
      </motion.h1>
    </motion.div>
  );
}
