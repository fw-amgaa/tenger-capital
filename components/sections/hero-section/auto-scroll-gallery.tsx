"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import type { HeroSlide } from "@/lib/db/schema";

const FALLBACK_SLIDE: HeroSlide = {
  id: "fallback",
  type: "image",
  url: "/home/hero.jpg",
};

export default function AutoScrollGallery() {
  const [slides, setSlides] = useState<HeroSlide[]>([FALLBACK_SLIDE]);
  const [intervalMs, setIntervalMs] = useState(5000);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/home-hero")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data?.slides?.length) {
          setSlides(data.slides as HeroSlide[]);
          if (typeof data.intervalMs === "number") {
            setIntervalMs(data.intervalMs);
          }
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const current = slides[index] ?? FALLBACK_SLIDE;

  useEffect(() => {
    if (slides.length <= 1) return;
    if (current.type !== "image") return;
    const t = setTimeout(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, intervalMs);
    return () => clearTimeout(t);
  }, [index, slides, intervalMs, current.type]);

  const advance = () => {
    if (slides.length <= 1) return;
    setIndex((i) => (i + 1) % slides.length);
  };

  return (
    <div className="w-full md:w-[45%] aspect-[279/333] md:aspect-[500/630] rounded-3xl overflow-hidden relative bg-muted">
      <AnimatePresence mode="sync">
        <motion.div
          key={current.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {current.type === "image" ? (
            <Image
              src={current.url}
              alt={current.alt || "hero"}
              fill
              sizes="(max-width: 768px) 100vw, 45vw"
              className="object-contain object-left"
              priority={index === 0}
            />
          ) : (
            <video
              key={current.id}
              src={current.url}
              autoPlay
              muted
              playsInline
              onEnded={advance}
              className="w-full h-full object-cover object-left"
            />
          )}
        </motion.div>
      </AnimatePresence>

      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setIndex(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-6 bg-white" : "w-1.5 bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
