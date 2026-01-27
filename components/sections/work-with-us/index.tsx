"use client";

import GradientBadge from "@/components/gradient-badge";
import {
  animate,
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useTime,
  useTransform,
} from "framer-motion";
import { PlusIcon, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { useLanguage } from "@/lib/language-context";

const WorkWithUs = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  const id = useId();
  const goldId = `gold-${id}`;
  const fillId = `fill-${id}`;

  const statsData = [
    {
      title: t("workwithus.stat1.title"),
      percentage: "9.2",
      unit: "x",
      suffix: "Since 2024",
      hasChart: true,
      disclosure:
        "This metric compares Tenger Capital’s total underwriting and brokerage transaction volume at the end of 2025 with the firm’s total transaction volume at the end of 2024. The comparison highlights year-on-year growth in both primary issuance and secondary market activity, reflecting the expansion of our client base, transaction capacity, and execution footprint within Mongolia’s capital markets.",

      children: (
        <div className="relative flex w-full h-full grow flex-nowrap items-end justify-center gap-[1.2rem] overflow-clip z-1">
          <div
            className="relative h-[30%] w-[50%] shrink-0 rounded-t-4xl"
            style={{
              background:
                "linear-gradient(180deg, rgba(255, 153, 0, 0.1) 0%, rgba(255, 153, 0, 0) 100%)",
            }}
          >
            <div className="flex w-fit items-center justify-center text-xs backdrop-blur-[20px] px-3 lg:px-4 py-2 lg:py-2 bg-[rgba(255,255,255,0.1)] absolute top-4 right-4 inline-flex h-7 rounded-2xl">
              <span className="gap-2">
                <span>2024</span>
              </span>
            </div>
          </div>
          <div
            className="relative w-[50%] shrink-0 rounded-t-4xl"
            style={{
              height: "max(75%, 170px)",
              background:
                "linear-gradient(180deg, rgba(255, 153, 0, 0.3) 0%, rgba(255, 153, 0, 0) 100%)",
            }}
          >
            <div className="absolute top-4 left-4  z-2">
              <GradientBadge>TC in 2025</GradientBadge>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: t("workwithus.stat2.title"),
      percentage: "25",
      unit: "%",
      suffix: "of 2025 total issuance",
      label: "Tenger Capital",
      hasPieChart: true,
      disclosure:
        "Tenger Capital SC LLC acted as lead manager, co-manager, underwriter, or executing broker for approximately one-quarter of total primary bond issuances completed in 2025 across the OTC market and MSE. This share is calculated based on executed issuance volume, demonstrating our active role in originating, structuring, and bringing bond transactions to market.",
      children: (
        <div className="relative flex w-full h-[80%] mt-[30%] grow-1 justify-center z-1">
          <div className="absolute top-[50%] right-[20%] z-2">
            <GradientBadge>With Tenger Capital</GradientBadge>
          </div>

          {/* The Graph Container */}
          <div className="absolute top-0 right-0 h-[170%] w-[170%] overflow-hidden flex items-center justify-center">
            <svg viewBox="0 0 115 115" className="w-full h-full">
              <defs>
                <linearGradient
                  id="gold-_R_hlfdb_"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stop-color="#FF9900"></stop>
                  <stop offset="50%" stop-color="#F8E5B5"></stop>
                  <stop offset="100%" stop-color="#FF9900"></stop>
                </linearGradient>
                <linearGradient
                  id="fill-_R_hlfdb_"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" stop-color="rgba(255, 153, 0, 0.4)"></stop>
                  <stop offset="100%" stop-color="rgba(255, 153, 0, 0)"></stop>
                </linearGradient>
              </defs>
              <path
                d="M 66 15 A 42 45 0 1 1 60 105 A 45 45 0 1 1 60 15 Z M 60 35 A 25 25 0 1 0 60 85 A 25 25 0 1 0 60 35 Z"
                fill="rgba(139, 90, 43, 0.6)"
                fill-rule="evenodd"
              ></path>

              <path
                d="M 60 15 A 45 45 0 0 1 106 60 L 85 60 A 25 25 0 0 0 60 35 Z"
                fill="url(#fill-_R_hlfdb_)"
              ></path>
              <line
                x1="60"
                y1="15"
                x2="60"
                y2="35"
                stroke="#FF9900"
                stroke-width="0.4"
                stroke-linecap="round"
              ></line>
              <path
                d="M 60 15 A 43 43 0 0 1 105 60"
                stroke="url(#gold-_R_hlfdb_)"
                stroke-width="0.4"
                fill="none"
                stroke-linecap="round"
              ></path>
              <line
                x1="105"
                y1="60"
                x2="85"
                y2="60"
                stroke="#FF9900"
                stroke-width="0.4"
                stroke-linecap="round"
              ></line>
              <path
                d="M 60 35 A 25 25 0 0 1 85 60"
                stroke="url(#gold-_R_hlfdb_)"
                stroke-width="0.4"
                fill="none"
                stroke-linecap="round"
              ></path>
            </svg>
          </div>
        </div>
      ),
    },
    {
      title: t("workwithus.stat3.title"),
      percentage: "379.2",
      unit: "₮",
      suffix: "Billion MNT",
      labels: ["Others", "TC"],
      hasBarChart: true,
      disclosure:
        "This figure represents the total nominal value of bonds and asset-backed securities issued and successfully executed in 2025 across both the over-the-counter (OTC) market and the Mongolian Stock Exchange (MSE). It includes primary issuances completed during the year, reflecting overall market issuance activity and funding raised through Mongolia’s fixed-income capital markets.",
      children: (
        <div className="relative flex w-full h-full grow flex-nowrap items-end justify-center gap-2 overflow-clip z-1">
          <div
            className="relative h-[25%] w-[18%] shrink-0 rounded-t-2xl"
            style={{
              background:
                "linear-gradient(180deg, rgba(255, 153, 0, 0.1) 0%, rgba(255, 153, 0, 0) 100%)",
            }}
          >
            {/* <div className="flex w-fit items-center justify-center text-xs backdrop-blur-[20px] px-3 lg:px-4 py-2 lg:py-2 bg-[rgba(255,255,255,0.1)] absolute top-2 right-5 inline-flex h-7 rounded-2xl">
              <span className="gap-2">
                <span>#5</span>
              </span>
            </div> */}
          </div>
          <div
            className="relative h-[27%] w-[18%] shrink-0 rounded-t-2xl"
            style={{
              background:
                "linear-gradient(180deg, rgba(255, 153, 0, 0.1) 0%, rgba(255, 153, 0, 0) 100%)",
            }}
          >
            {/* <div className="flex w-fit items-center justify-center text-xs backdrop-blur-[20px] px-3 lg:px-4 py-2 lg:py-2 bg-[rgba(255,255,255,0.1)] absolute top-2 right-3 inline-flex h-7 rounded-2xl">
              <span className="gap-2">
                <span>#4</span>
              </span>
            </div> */}
          </div>

          <div
            className="relative h-[33%] w-[18%] shrink-0 rounded-t-2xl"
            style={{
              background:
                "linear-gradient(180deg, rgba(255, 153, 0, 0.1) 0%, rgba(255, 153, 0, 0) 100%)",
            }}
          >
            {/* <div className="flex w-fit items-center justify-center text-xs backdrop-blur-[20px] px-3 lg:px-4 py-2 lg:py-2 bg-[rgba(255,255,255,0.1)] absolute top-2 right-3 inline-flex h-7 rounded-2xl">
              <span className="gap-2">
                <span>#3</span>
              </span>
            </div> */}
          </div>

          <div
            className="relative w-[28%] shrink-0 rounded-t-2xl"
            style={{
              height: "max(60%, 170px)",
              background:
                "linear-gradient(180deg, rgba(255, 153, 0, 0.3) 0%, rgba(255, 153, 0, 0) 100%)",
            }}
          >
            <div className="absolute top-2 left-2.5  z-2">
              <GradientBadge>TC #2</GradientBadge>
            </div>
          </div>
          <div
            className="relative h-[75%] w-[18%] shrink-0 rounded-t-2xl"
            style={{
              background:
                "linear-gradient(180deg, rgba(255, 153, 0, 0.1) 0%, rgba(255, 153, 0, 0) 100%)",
            }}
          >
            {/* <div className="flex w-fit items-center justify-center text-xs backdrop-blur-[20px] px-3 lg:px-4 py-2 lg:py-2 bg-[rgba(255,255,255,0.1)] absolute top-2 right-2 inline-flex h-7 rounded-2xl">
              <span className="gap-2">
                <span>#1</span>
              </span>
            </div> */}
          </div>
        </div>
      ),
    },
  ];

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollPosition = scrollRef.current.scrollLeft;
      const cardWidth = scrollRef.current.offsetWidth;
      const newIndex = Math.round(scrollPosition / cardWidth);
      setCurrentIndex(newIndex);
    }
  };

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll);
      return () => scrollElement.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return (
    <div className="w-full">
      <div className="flex justify-center">
        <h2 className="text-4xl md:text-[48px] my-24 md:my-48 text-center md:w-[420px] leading-[1]">
          {t("Why Should You Work With Us?")}
        </h2>
      </div>
      {/* Desktop View */}
      <div className="hidden section-container md:grid md:grid-cols-3 gap-4 xl:px-24 2xl:px-36">
        {statsData.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Mobile View - Scrollable */}
      <div
        ref={scrollRef}
        className="md:hidden flex overflow-x-scroll snap-x snap-mandatory scrollbar-hide ml-8"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {statsData.map((stat, index) => (
          <div
            key={index}
            className="flex-shrink-0 max-w-[400px] w-full snap-center px-4 first:pl-4 last:pr-4"
          >
            <StatsCard {...stat} />
          </div>
        ))}
      </div>

      {/* Mobile Pagination Dots */}
      <div className="md:hidden flex justify-center gap-2 mt-6">
        {statsData.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              scrollRef.current?.scrollTo({
                left: index * scrollRef.current.offsetWidth,
                behavior: "smooth",
              });
            }}
            className="relative"
          >
            <div
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? "bg-white" : "bg-white/30"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

const StatsCard = ({
  title,
  percentage,
  unit,
  suffix,
  disclosure,
  children,
}: {
  title: string;
  percentage: string;
  unit: string;
  suffix?: string;
  label?: string;
  labels?: string[];
  hasChart?: boolean;
  hasBarChart?: boolean;
  hasPieChart?: boolean;
  disclosure?: string;
  children?: React.ReactNode;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const time = useTime();
  const rotate = useTransform(time, [0, 10000], [0, 360], { clamp: false });

  const rotatingBackground = useTransform(rotate, (r) => {
    return `linear-gradient(${r}deg,
      rgb(255,153,0) 15.57%,
      rgb(248,229,181) 33.39%,
      rgb(161,111,16) 50.58%,
      rgb(248,229,181) 67.75%,
      rgb(255,153,0) 91.74%)`;
  });

  return (
    <div className="w-full">
      <div className="relative aspect-3/5 rounded-4xl overflow-hidden max-w-[400px] mx-auto">
        {/* Rotating Gradient Border */}
        <motion.div
          style={{
            background: rotatingBackground,
          }}
          className="absolute inset-0 rounded-3xl"
        />

        {/* Background graph */}
        <div className="absolute w-full h-full top-0 left-0">{children}</div>

        {/* Inner Card */}
        <div className="absolute inset-[1px] bg-black rounded-4xl overflow-hidden">
          <div className="bg-[#ff990026] p-8 flex flex-col h-full relative">
            {/* Plus/Close Button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="absolute top-6 right-6 w-6 h-6 rounded-4xl flex items-center justify-center bg-white/10 text-white/60 hover:text-white/80 transition-colors z-3"
            >
              <AnimatePresence mode="wait">
                {isExpanded ? (
                  <motion.div
                    key="close"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={12} strokeWidth={3} color="white" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="plus"
                    initial={{ opacity: 0, rotate: 90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: -90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <PlusIcon size={12} strokeWidth={3} color="white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* Title */}
            <p className="text-white/80 text-sm leading-relaxed mb-auto p-4 pr-12">
              {title}
            </p>

            {/* Percentage Display */}
            <div className="flex items-baseline gap-1">
              <span className="text-white text-7xl font-medium leading-none">
                <RollingNumber value={percentage} duration={1} />
              </span>
              <span className="text-white text-4xl font-bold leading-none mb-2">
                {unit}
              </span>
            </div>

            {/* Suffix */}
            {suffix && <p className="text-white/60 text-sm mt-2">{suffix}</p>}

            {/* Disclosure Overlay */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 rounded-4xl bg-white/10 backdrop-blur-sm p-4 md:p-8 flex items-center justify-center overflow-hidden z-2"
                >
                  <div className="max-w-full overflow-y-auto max-h-full">
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        duration: 0.8,
                        delay: 0.2,
                        ease: "easeOut",
                      }}
                      className="text-[#fda6228c] text-sm leading-relaxed"
                    >
                      {disclosure?.split("").map((char, index) => (
                        <motion.span
                          key={index}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{
                            duration: 0.02,
                            delay: 0.1 + index * 0.005,
                            ease: "easeOut",
                          }}
                        >
                          {char}
                        </motion.span>
                      ))}
                    </motion.p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkWithUs;

const Digit = ({ value, duration }: { value: number; duration: number }) => {
  return (
    <div className="relative h-[1em] overflow-hidden inline-block">
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: `-${value * 10}%` }}
        transition={{
          duration: duration,
          ease: [0.15, 0.05, 0.75, 1], // Smooth cubic-bezier
        }}
        className="flex flex-col"
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <span key={n} className="flex items-center justify-center">
            {n}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

const RollingNumber = ({
  value,
  duration = 0.5,
}: {
  value: string;
  duration?: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  if (!isInView)
    return (
      <span ref={ref} className="opacity-0">
        {value}
      </span>
    );

  return (
    <span ref={ref} className="inline-flex items-baseline">
      {value.split("").map((char, index) => {
        // If it's a number, animate it
        if (!isNaN(parseInt(char))) {
          return (
            <Digit key={index} value={parseInt(char)} duration={duration} />
          );
        }
        // If it's a dot or comma, just show it
        return (
          <span key={index} className="relative">
            {char}
          </span>
        );
      })}
    </span>
  );
};
