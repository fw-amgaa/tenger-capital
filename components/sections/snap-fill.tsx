"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

type SnapFillProps = {
  children?: React.ReactNode;
  initialPadding?: number; // px
  initialRadius?: number; // px
  className?: string;
};

export default function SnapFillSection({
  children,
  initialPadding = 24,
  initialRadius = 24,
  className,
}: SnapFillProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  // Long section progress across 400vh: 0 when bottom enters, 1 when leaving
  const { scrollYProgress: sectionProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Approach progress just for the initial fill-in (first ~15% of the section)
  const approachProgress = useTransform(sectionProgress, [0, 0.15], [0, 1]);

  // Padding via CSS variable scaling of the shared --gutter
  const radius = useTransform(approachProgress, [0, 1], [initialRadius, 0]);
  const margin = useTransform(approachProgress, [0, 1], [48, 0]);

  // Chart progress while sticky (from after approach to near the end)
  const chartProgress = useTransform(sectionProgress, [0.15, 0.95], [0, 1]);

  // Stage 1 → 2: title fades out
  const titleOpacity = useTransform(chartProgress, [0, 0.15, 0.22], [1, 1, 0]);
  const titleY = useTransform(chartProgress, [0, 0.22], [0, -12]);

  // Bars fade in
  const barsOpacity = useTransform(chartProgress, [0.18, 0.3], [0, 1]);

  // Horizontal pan across bars
  const barsTranslateX = useTransform(chartProgress, [0.3, 0.8], [0, -800]);

  // Final stage: zoom out to show all bars
  const overviewScale = useTransform(chartProgress, [0.8, 1], [1, 0.7]);

  return (
    <section
      ref={ref}
      className={cn(
        // Give room to scroll through stages; sticky child will pin
        "h-[400vh] w-full",
        "flex items-center justify-center",
        "max-w-screen-2xl mx-auto",
        className ?? "",
      )}
    >
      {/* Sticky viewport container */}
      <motion.div
        style={{
          ["--snap-progress" as any]: approachProgress,
          borderRadius: radius,
          background: "var(--main-white)",
          marginLeft: margin,
          marginRight: margin,
        }}
        className="sticky top-0 h-[100vh] w-full box-border shadow-sm page-gutter overflow-hidden"
      >
        {children ?? (
          <div className="relative h-full w-full text-neutral-900">
            {/* Background line graph placeholder */}
            <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 1200 600" preserveAspectRatio="none">
              <path d="M0 420 L80 410 L140 430 L220 360 L300 380 L420 300 L520 340 L600 320 L700 380 L820 300 L980 360 L1200 320" fill="none" stroke="currentColor" strokeWidth="2" />
              {/* vertical grid */}
              {Array.from({ length: 12 }).map((_, i) => (
                <line key={i} x1={(i + 1) * 100} y1={40} x2={(i + 1) * 100} y2={560} stroke="currentColor" strokeWidth="1" opacity="0.08" />
              ))}
            </svg>

            {/* Title block (state 1) */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              style={{ opacity: titleOpacity, y: titleY }}
            >
              <div className="text-center">
                <h2 className="text-3xl md:text-5xl font-semibold">Markets move daily.</h2>
                <p className="mt-3 text-base md:text-lg opacity-70">Your focus shouldn’t.</p>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </section>
  );
}


