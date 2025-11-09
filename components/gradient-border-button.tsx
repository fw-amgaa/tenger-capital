"use client";

import { cn } from "@/lib/utils";
import { motion, useTime, useTransform } from "framer-motion";
import { useState } from "react";

interface GradientButtonProps {
  children?: React.ReactNode;
  mode?: "light" | "dark";
  borderAnimation?: boolean;
  hasBorder?: boolean; // default true
  iconComponent?: React.ReactNode;
}

const GradientBorderButton = ({
  children,
  mode = "dark",
  borderAnimation = true,
  hasBorder = true,
  iconComponent,
}: GradientButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const time = useTime();

  const buttonIcon = iconComponent || (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="10"
      height="8"
      fill="none"
      className="ml-4"
    >
      <path
        fill="currentColor"
        d="m5.731 0-.564.564L8.199 3.6H.131v.8h8.068L5.167 7.436 5.731 8l4-4z"
      ></path>
    </svg>
  );

  const rotate = useTransform(time, [0, 6000], [0, 360], { clamp: false });

  const rotatingBackground = useTransform(rotate, (r) => {
    return `linear-gradient(${r}deg,
      rgb(255,153,0) 15.57%,
      rgb(248,229,181) 33.39%,
      rgb(161,111,16) 50.58%,
      rgb(248,229,181) 67.75%,
      rgb(255,153,0) 91.74%)`;
  });

  const staticBackground = mode === "light" ? "#0a0a0a1a" : "#3b3b3b";

  return (
    <motion.button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileTap={{ scale: 0.98 }}
      className="relative overflow-hidden rounded-full bg-transparent px-6 py-2 font-medium cursor-pointer"
    >
      {/* ✨ Glow / Background pulse only if hasBorder */}
      {hasBorder && (
        <motion.div
          animate={{
            opacity: isHovered ? 0.45 : 0,
            scale: isHovered ? 1.15 : 1,
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="absolute inset-0 rounded-full blur-lg"
          style={{
            background:
              mode === "light"
                ? "radial-gradient(circle, rgba(255,153,0,0.25) 0%, rgba(255,153,0,0.05) 70%)"
                : "radial-gradient(circle, rgba(255,153,0,0.5) 0%, transparent 70%)",
          }}
        />
      )}

      {/* 🩶 Text + Icon */}
      <motion.span
        animate={{
          filter: isHovered
            ? [
              `blur(0px) drop-shadow(0 0 0px rgba(0,0,0,0))`,
              `blur(${mode === "light" ? 2 : 4}px) drop-shadow(0 0 ${mode === "light" ? 3 : 8
              }px ${mode === "light" ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.6)"
              })`,
              `blur(0px) drop-shadow(0 0 0px rgba(0,0,0,0))`,
            ]
            : `blur(0px) drop-shadow(0 0 0px rgba(0,0,0,0))`,
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
        {buttonIcon}
      </motion.span>

      {/* 🌈 Rotating Gradient Border */}
      {hasBorder && (
        <motion.div
          style={{
            background: rotatingBackground,
            opacity: borderAnimation ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="absolute -inset-[1px] rounded-full"
        />
      )}

      {/* 🩶 Static Border */}
      {hasBorder && (
        <motion.div
          animate={{
            opacity: borderAnimation ? 0 : 1,
          }}
          transition={{ duration: 0.3 }}
          style={{ background: staticBackground }}
          className="absolute -inset-[1px] rounded-full"
        />
      )}

      {/* 🖤 Inner Layer */}
      <motion.span
        transition={{ duration: 0.3 }}
        className={cn(
          "absolute inset-[1px] rounded-full",
          hasBorder
            ? mode === "light"
              ? "bg-white"
              : "bg-black"
            : "bg-transparent"
        )}
      />

      {/* 💫 Shimmer effect */}
      <motion.div
        animate={
          isHovered
            ? { x: ["0%", "200%"], opacity: [0, 1, 0] }
            : { x: "0%", opacity: 0 }
        }
        transition={{
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="absolute inset-0 z-[5]"
        style={{
          background:
            mode === "light"
              ? "linear-gradient(90deg, transparent, rgba(196, 196, 196, 0.39), transparent)"
              : "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
          width: "50%",
        }}
      />
    </motion.button>
  );
};

export default GradientBorderButton;
