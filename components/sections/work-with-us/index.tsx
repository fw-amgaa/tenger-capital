"use client";

import { AnimatePresence, motion, useTime, useTransform } from "framer-motion";
import { PlusIcon, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ChartPieDonutActive } from "./pie-chart";
import { ChartBarLabelCustom } from "./bar-chart";
import { ChartBarMultiple } from "./bar-chart-multiple";
import { ChartReveal } from "./chart-reveal";

const statsData = [
  {
    title: "Бондын анхдагч зах зээл (2025 оны байдлаар)",
    percentage: "379.2",
    unit: "₮",
    suffix: "тэрбум төгрөг",
    labels: ["Others", "TG"],
    hasBarChart: true,
    disclosure: "Бондын анхдагч зах зээл (2025 оны байдлаар)",
  },
  {
    title: "Бондын анхдагч зах зээлийн эзлэх хувь.",
    percentage: "25",
    unit: "%",
    suffix: "2025 оны нийт зах зээлийн",
    label: "Tenger Capital",
    hasPieChart: true,
    disclosure: "Бондын анхдагч зах зээлийн эзлэх хувь.",
  },
  {
    title: "Компаний үйл ажиллагааний өсөлт",
    percentage: "9.04",
    unit: "x",
    suffix: "өнгөрсөн жилээс",
    hasChart: true,
    disclosure: "Компаний үйл ажиллагааний өсөлт",
  },
];

const WorkWithUs = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

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
        <h2 className="text-[32px] my-48 text-center md:w-[240px] leading-[1]">
          Why Should You Work With Us?
        </h2>
      </div>
      {/* Desktop View */}
      <div className="hidden section-container md:grid md:grid-cols-3 gap-4 lg:gap-6 2xl:px-36">
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
  label,
  hasChart,
  hasBarChart,
  hasPieChart,
  disclosure,
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
      <div className="relative aspect-3/5 rounded-3xl overflow-hidden max-w-[400px] mx-auto">
        {/* Rotating Gradient Border */}
        <motion.div
          style={{
            background: rotatingBackground,
          }}
          className="absolute inset-0 rounded-3xl"
        />

        {/* Inner Card */}
        <div className="absolute inset-[1px] bg-black rounded-3xl overflow-hidden">
          <div className="bg-[#ff990026] p-8 flex flex-col h-full relative">
            {/* Plus/Close Button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="absolute top-6 right-6 w-6 h-6 rounded-full flex items-center justify-center bg-white/10 text-white/60 hover:text-white/80 transition-colors z-20"
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
            <p className="text-white/60 text-sm leading-relaxed mb-auto pr-8">
              {title}
            </p>

            {/* Visual Content */}
            <div className="flex-grow flex items-end mb-8">
              {hasChart && (
                <div className="w-full h-56 relative">
                  <div className="absolute top-12 left-[7%]">
                    <div className="px-3 py-1 rounded-full border border-[#d4a55a] bg-[#5a4628] text-[#d4a55a] text-xs font-medium whitespace-nowrap">
                      9.04x
                    </div>
                  </div>

                  <div className="absolute top-12 right-[28%]">
                    <div className="px-3 py-1 rounded-full border border-[#d4a55a] bg-[#5a4628] text-[#d4a55a] text-xs font-medium whitespace-nowrap">
                      7.5x
                    </div>
                  </div>

                  <ChartReveal>
                    <ChartBarMultiple />
                  </ChartReveal>
                </div>
              )}

              {hasBarChart && (
                <div className="w-full h-64 flex gap-8">
                  <ChartReveal>
                    <ChartBarLabelCustom />
                  </ChartReveal>
                </div>
              )}

              {hasPieChart && (
                <div className="w-full h-64 flex items-center justify-center">
                  <div className="relative w-64 h-64">
                    <ChartReveal>
                      <ChartPieDonutActive />
                    </ChartReveal>

                    <div className="absolute top-12 right-0">
                      <div className="px-3 py-1 rounded-full border border-[#d4a55a] bg-[#5a4628] text-[#d4a55a] text-xs font-medium whitespace-nowrap">
                        {label}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Percentage Display */}
            <div className="flex items-baseline gap-1">
              <span className="text-white text-7xl font-bold leading-none">
                {percentage}
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
                  className="absolute inset-0 rounded-3xl bg-white/10 backdrop-blur-sm p-4 md:p-8 flex items-center justify-center overflow-hidden"
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
