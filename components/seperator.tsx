"use client";

import { useState, useEffect, useRef } from "react";

export default function Seperator() {
  const [mouseX, setMouseX] = useState<number>(0);
  const [displayX, setDisplayX] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const ease = 0.03; // Lower = slower, smoother (0.01-0.2 recommended)

    const animate = (): void => {
      setDisplayX((prev) => {
        const diff = mouseX - prev;

        // Stop animating when very close
        if (Math.abs(diff) < 0.1) return mouseX;

        // Easing function - accelerates when far, decelerates when close
        return prev + diff * ease;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mouseX]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent): void => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;

      setMouseX(relativeX);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = (): void => {
      setTimeout(() => {
        setIsVisible(false);
      }, 1200);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isVisible]);

  return (
    <div ref={containerRef} className="relative w-full h-4 overflow-hidden">
      {/* Static horizontal line */}
      <div className="absolute left-0 right-0 h-[0.5px] bg-[#ffffff26] top-1/2 -translate-y-1/2" />

      {/* Colored section that follows cursor */}
      <div
        className={`absolute h-px pointer-events-none will-change-transform ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{
          top: "50%",
          transform: "translate(-15%, -50%)",
          left: `${Math.max(0, displayX - 50)}px`,
          width: "853px",
          background:
            "linear-gradient(90deg, #f900, #ff9900b3 17.81%, #f900 35.62%), linear-gradient(90deg, #ffc16400 5.95%, #ffc164b3 15.04%, #ffc16400 24.14%)",
          transition: "opacity 0.5s ease-out",
        }}
      />

      {/* Content area - optional, remove if not needed */}
      <div className="flex items-center justify-center h-full">
        {/* <p className="text-white text-xs">Separator</p> */}
      </div>
    </div>
  );
}
