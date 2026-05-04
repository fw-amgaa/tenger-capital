"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

/** Section number + label, e.g. "(01) — INTRODUCTION" */
export function SectionEyebrow({
  index,
  label,
  className,
}: {
  index: number;
  label: string;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className={cn(
        "inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-white/45",
        className,
      )}
    >
      <span
        className="font-mono tabular-nums"
        style={{ color: "var(--partner-primary)" }}
      >
        ({String(index).padStart(2, "0")})
      </span>
      <span aria-hidden className="h-px w-8 bg-white/15" />
      <span>{label}</span>
    </motion.div>
  );
}

/** A horizontal rule that grows from 0 to full width once it enters the viewport. */
export function GrowingRule({ className }: { className?: string }) {
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      style={{ originX: 0, background: "rgba(255,255,255,0.12)" }}
      className={cn("h-px w-full", className)}
    />
  );
}

/** Big editorial number used as a section index. */
export function BigIndex({ n, total }: { n: number; total: number }) {
  return (
    <div className="flex items-baseline gap-2 font-mono tabular-nums text-white/55">
      <span
        className="text-2xl"
        style={{ color: "var(--partner-primary)" }}
      >
        {String(n).padStart(2, "0")}
      </span>
      <span className="text-xs opacity-60">/ {String(total).padStart(2, "0")}</span>
    </div>
  );
}

/** A repeating scrolling text strip with a separator glyph. */
export function MarqueeStrip({
  items,
  duration = 28,
  className,
}: {
  items: string[];
  duration?: number;
  className?: string;
}) {
  // duplicate for seamless loop
  const loop = [...items, ...items, ...items, ...items];
  return (
    <div
      className={cn(
        "relative overflow-hidden border-y border-white/8 py-5 select-none",
        className,
      )}
    >
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
        className="flex shrink-0 whitespace-nowrap will-change-transform"
      >
        {loop.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-8 px-8 text-2xl md:text-3xl tracking-tight font-[var(--font-moisette)] text-white/70"
          >
            {item}
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ background: "var(--partner-primary)" }}
            />
          </span>
        ))}
      </motion.div>
      {/* edge fades */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-24"
        style={{
          background:
            "linear-gradient(to right, #0a0a0a, transparent)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-24"
        style={{
          background:
            "linear-gradient(to left, #0a0a0a, transparent)",
        }}
      />
    </div>
  );
}

/** Subtle SVG noise overlay — adds film grain on dark backgrounds. */
export function GrainOverlay() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[60] mix-blend-overlay opacity-[0.06]"
      width="100%"
      height="100%"
    >
      <filter id="partner-grain">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.9"
          numOctaves="2"
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#partner-grain)" />
    </svg>
  );
}

/** A scroll cue arrow that fades out as the user scrolls. */
export function ScrollCue() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 30]);

  return (
    <motion.div
      ref={ref}
      style={{ opacity, y }}
      className="absolute bottom-6 left-6 md:left-12 flex items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-white/55"
    >
      <span>Scroll</span>
      <motion.span
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
        className="block h-3 w-px"
        style={{ background: "var(--partner-primary)" }}
      />
    </motion.div>
  );
}

/** Decorative gradient orb used as ambient lighting. */
export function AmbientOrb({
  className,
  intensity = 0.18,
}: {
  className?: string;
  intensity?: number;
}) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute rounded-full blur-3xl", className)}
      style={{
        background: `radial-gradient(circle, color-mix(in oklch, var(--partner-primary) ${
          intensity * 100
        }%, transparent), transparent 70%)`,
      }}
    />
  );
}
