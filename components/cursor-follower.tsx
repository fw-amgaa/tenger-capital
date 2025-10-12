"use client";

import { useState, useEffect, useRef } from "react";

export default function CursorFollower() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [circlePos, setCirclePos] = useState({ x: 0, y: 0 });
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent): void => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const ease = 0.2; // Adjust for smoothness (0.01-0.3)

    const animate = (): void => {
      setCirclePos((prev) => {
        const diffX = mousePos.x - prev.x;
        const diffY = mousePos.y - prev.y;

        // Stop animating when very close
        if (Math.abs(diffX) < 0.1 && Math.abs(diffY) < 0.1) {
          return mousePos;
        }

        // Easing function
        return {
          x: prev.x + diffX * ease,
          y: prev.y + diffY * ease,
        };
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mousePos]);

  return (
    <>
      <div
        className="fixed pointer-events-none z-50 w-3 h-3 rounded-full bg-[#C68345]"
        style={{
          left: `${circlePos.x}px`,
          top: `${circlePos.y}px`,
          transform: "translate(-50%, -50%)",
        }}
      />
    </>
  );
}
