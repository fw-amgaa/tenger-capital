"use client";

import { motion, useInView } from "framer-motion";
import { PropsWithChildren, useRef } from "react";

export function ChartReveal({ children }: PropsWithChildren) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    margin: "-100px",
    once: true,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full h-full"
    >
      {isInView && children}
    </motion.div>
  );
}
