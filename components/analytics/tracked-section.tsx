"use client";

import { useEffect, useRef } from "react";
import { getTracker } from "@/lib/analytics/tracker";

const THRESHOLDS = [0, 0.1, 0.25, 0.5, 0.75, 1];

export function TrackedSection({
  id,
  children,
  className,
  as: As = "div",
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section";
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        getTracker().reportSectionRatio(id, entry.intersectionRatio || 0);
      },
      { threshold: THRESHOLDS },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [id]);

  return (
    <As
      ref={ref as React.Ref<HTMLDivElement & HTMLElement>}
      data-tc-section={id}
      className={className}
    >
      {children}
    </As>
  );
}
