"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

type TextCarouselProps = {
  items: string[];
  intervalMs?: number; // defaults to 7s
  className?: string;
};

export default function TextCarousel({
  items,
  intervalMs = 5000,
  className,
}: TextCarouselProps) {
  const [index, setIndex] = useState(0);
  const itemCount = items.length;
  const timerRef = useRef<number | null>(null);
  const measureRef = useRef<HTMLDivElement | null>(null);
  const [textWidth, setTextWidth] = useState<number>(0);

  const goTo = (i: number) =>
    setIndex(((i % itemCount) + itemCount) % itemCount);
  const next = () => goTo(index + 1);

  // Autoplay with reset on index change
  useEffect(() => {
    if (!itemCount) return;
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(
      next,
      intervalMs
    ) as unknown as number;
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, itemCount, intervalMs]);

  // Pause on hover for better UX
  const onMouseEnter = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };
  const onMouseLeave = () => {
    if (!timerRef.current)
      timerRef.current = window.setInterval(
        next,
        intervalMs
      ) as unknown as number;
  };

  const indicators = useMemo(() => new Array(itemCount).fill(0), [itemCount]);

  // Measure current text width whenever index changes to animate container width
  useEffect(() => {
    if (!measureRef.current) return;
    setTextWidth(measureRef.current.offsetWidth);
  }, [index, items]);

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cn(
        "inline-flex items-center gap-3",
        "h-[30px] px-3 rounded-lg",
        "bg-[rgba(248,248,248,0.1)] text-white/70",
        "backdrop-blur-sm",
        className
      )}
    >
      {/* Indicators */}
      <div className="flex items-center gap-1.5">
        {indicators.map((_, i) => {
          const active = i === index;
          return (
            <button
              key={i}
              aria-label={`Go to item ${i + 1}`}
              onClick={() => goTo(i)}
              className="relative inline-flex items-center cursor-pointer"
            >
              <motion.span
                layout
                className="block h-1 rounded-full hover:bg-[rgba(255,255,255,0.95)]"
                animate={{
                  width: active ? 12 : 4,
                  backgroundColor: active
                    ? "rgba(255,255,255,0.95)"
                    : "rgba(255,255,255,0.35)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            </button>
          );
        })}
      </div>

      {/* Hidden measurer */}
      <div
        ref={measureRef}
        className="absolute -z-10 pointer-events-none select-none opacity-0 whitespace-nowrap text-[12px] leading-[30px]"
      >
        {items[index]}
      </div>

      {/* Text viewport (width animates to measured width) */}
      <motion.div
        layout
        className="relative overflow-hidden h-[30px] flex items-center max-w-[250px] md:max-w-0"
        animate={{ width: textWidth || "auto" }}
        transition={{ type: "spring", stiffness: 400, damping: 40 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={index}
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="whitespace-nowrap text-[12px] leading-[30px] text-[rgba(248,248,248,0.5)]"
          >
            {items[index]}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
