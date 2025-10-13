"use client";

import { useTime, useTransform, motion } from "framer-motion";

interface GradientButtonProps {
  children?: React.ReactNode;
}

const GradientBorderButton = ({ children }: GradientButtonProps) => {
  const time = useTime();

  const rotate = useTransform(time, [0, 3000], [0, 360], { clamp: false });

  const rotatingBackground = useTransform(rotate, (r) => {
    return `linear-gradient(${r}deg, rgb(255,153,0) 15.57%, rgb(248,229,181) 33.39%, rgb(161,111,16) 50.58%, rgb(248,229,181) 67.75%, rgb(255,153,0) 91.74%)`;
  });

  return (
    <button className="relative overflow-hidden rounded-full bg-transparent px-6 py-2 text-white font-medium">
      <span className="relative z-10 flex items-center gap-2 text-xs font-semibold">
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
      </span>

      {/* Gradient border layer */}
      <motion.div
        style={{ background: rotatingBackground }}
        className="absolute -inset-[1px] rounded-full"
      />

      {/* Inner black fill */}
      <span className="absolute inset-[1px] rounded-full bg-black" />
    </button>
  );
};

export default GradientBorderButton;
