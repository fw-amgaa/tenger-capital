"use client";

import { cn } from "@/lib/utils";
import { motion, useTime, useTransform } from "framer-motion";
import { useState } from "react";

interface GradientButtonProps {
  children?: React.ReactNode;
  mode?: "light" | "dark";
  borderAnimation?: boolean;
}

const GradientBorderButton = ({
  children,
  mode = "dark",
  borderAnimation = true,
}: GradientButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const time = useTime();

  const rotate = useTransform(time, [0, 3000], [0, 360], { clamp: false });

  const rotatingBackground = useTransform(rotate, (r) => {
    return `linear-gradient(${r}deg, rgb(255,153,0) 15.57%, rgb(248,229,181) 33.39%, rgb(161,111,16) 50.58%, rgb(248,229,181) 67.75%, rgb(255,153,0) 91.74%)`;
  });

  const staticBackground = mode === "light" ? "#0a0a0a1a" : "#3b3b3b";

  return (
    <motion.button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileTap={{ scale: 0.98 }}
      className="btn-swipe-effect relative overflow-hidden rounded-full bg-transparent px-6 py-2 font-medium cursor-pointer"
    >
      {/* Glow effect on hover */}
      <motion.div
        animate={{
          opacity: isHovered ? 0.6 : 0,
          scale: isHovered ? 1.2 : 1,
        }}
        transition={{ duration: 0.4 }}
        className="absolute inset-0 rounded-full blur-xl"
        style={{
          background:
            mode === "light"
              ? "radial-gradient(circle, rgba(255,153,0,0.4) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(255,153,0,0.6) 0%, transparent 70%)",
        }}
      />

      <motion.span
        animate={{
          filter: isHovered
            ? [
                `blur(0px) drop-shadow(0 0 0px ${
                  mode === "light" ? "rgba(10,10,10,0)" : "rgba(59,59,59,0)"
                })`,
                `blur(4px) drop-shadow(0 0 8px ${
                  mode === "light" ? "rgba(10,10,10,0.6)" : "rgba(59,59,59,0.8)"
                })`,
                `blur(0px) drop-shadow(0 0 0px ${
                  mode === "light" ? "rgba(10,10,10,0)" : "rgba(59,59,59,0)"
                })`,
              ]
            : `blur(0px) drop-shadow(0 0 0px ${
                mode === "light" ? "rgba(10,10,10,0)" : "rgba(59,59,59,0)"
              })`,
        }}
        transition={{
          duration: 0.6,
          times: [0, 0.5, 1],
          ease: "easeInOut",
        }}
        className={cn(
          "relative z-10 flex items-center gap-2 text-[10px] font-semibold",
          mode === "light" ? "text-black" : "text-white"
        )}
      >
        {children}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 ml-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 8l4 4m0 0l-4 4m4-4H3"
          />
        </svg>
      </motion.span>

      {/* Rotating Gradient Border Layer */}
      <motion.div
        style={{
          background: rotatingBackground,
          opacity: borderAnimation ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="absolute -inset-[1px] rounded-full"
      />

      {/* Static Border Layer */}
      <motion.div
        animate={{
          opacity: borderAnimation ? 0 : 1,
        }}
        transition={{ duration: 0.3 }}
        style={{ background: staticBackground }}
        className="absolute -inset-[1px] rounded-full"
      />

      {/* Inner Background */}
      <motion.span
        transition={{ duration: 0.3 }}
        className={cn(
          "absolute inset-[1px] rounded-full",
          mode === "light" ? "bg-white" : "bg-black"
        )}
      />

      {/* Shimmer effect on hover */}
      <motion.div
        animate={{
          x: isHovered ? ["0%", "200%"] : "0%",
          opacity: isHovered ? [0, 1, 0] : 0,
        }}
        transition={{
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="absolute inset-0 z-[5]"
        style={{
          background:
            mode === "light"
              ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)"
              : "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
          width: "50%",
        }}
      />
    </motion.button>
  );
};

export default GradientBorderButton;
