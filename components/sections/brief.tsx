"use client";

import { AnimatePresence, motion, PanInfo } from "framer-motion";
import { Bell, TrendingUp, User } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import Seperator from "../seperator";
import { useLanguage } from "@/lib/language-context";

const Brief = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [direction, setDirection] = useState(1);
  const duration = 8000;
  const { t } = useLanguage();

  const carouselData = [
    {
      icon: <Bell className="w-4 h-4" />,
      title: t("Real-Time Data"),
      description: t("brief.realtime.desc"),
      phoneImage: "/phone-screen/market.jpg",
    },
    {
      icon: <User className="w-4 h-4" />,
      title: t("Human Service"),
      description: t("brief.human.desc"),
      phoneImage: "/phone-screen/order_entry.jpg",
    },
    {
      icon: <TrendingUp className="w-4 h-4" />,
      title: t("Monitor your Portfolio"),
      description: t("brief.portfolio.desc"),
      phoneImage: "/phone-screen/portfolio.jpg",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setDirection(1);
          setCurrentIndex((current) => (current + 1) % carouselData.length);
          return 0;
        }
        return prev + 100 / (duration / 100);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const handleNext = () => {
    setDirection(1);
    setProgress(0);
    setCurrentIndex((prev) => (prev + 1) % carouselData.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setProgress(0);
    setCurrentIndex(
      (prev) => (prev - 1 + carouselData.length) % carouselData.length
    );
  };

  const handleDotClick = (index: number) => {
    if (index > currentIndex) {
      setDirection(1);
    } else if (index < currentIndex) {
      setDirection(-1);
    }
    setProgress(0);
    setCurrentIndex(index);
  };

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const swipeThreshold = 50;
    if (info.offset.x > swipeThreshold) {
      handlePrev();
    } else if (info.offset.x < -swipeThreshold) {
      handleNext();
    }
  };

  const currentItem = carouselData[currentIndex];

  // Phone animation - slides and scales
  const phoneVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -100 : 100,
      opacity: 0,
      scale: 0.9,
    }),
  };

  // Content animation - slides smoothly
  const contentVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -50 : 50,
      opacity: 0,
    }),
  };

  const transition = {
    duration: 0.15,
    ease: [0.25, 0.1, 0.25, 1] as const,
  };

  return (
    <div className="section-container relative flex flex-col gap-16">
      <div className="relative flex flex-col gap-8">
        <div className="absolute w-full h-full z-0 overflow-hidden top-0 left-0">
          <video
            src={"/videos/2040x516.mp4"}
            controls={false}
            playsInline
            muted={true}
            autoPlay={true}
            loop={true}
            className="h-full object-cover"
          />
        </div>
        <Seperator />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-4 mb-16 md:mb-48 z-5">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif">
              {t("Inspired by Tenger")}
            </h1>
            <div className="my-2 h-px w-24 bg-gradient-to-r from-[rgb(255,153,0)] to-transparent" />
            <h1 className="text-3xl md:text-4xl font-serif opacity-40">
              {t("Integrity.")} <br />
              {t("Wisdom.")} <br />
              {t("Foresight.")}
            </h1>
          </div>

          <h3 className="text-base md:text-lg leading-relaxed md:w-[440px]">
            {t("brief.description")}
          </h3>
        </div>
      </div>

      {/* Carousel Section */}
      <div className="flex w-full flex-col sm:flex-row sm:gap-4 lg:gap-8">
        {/* Mobile Mockup - Left Side */}
        <div className="bg-[#1a1a1a] rounded-3xl relative flex aspect-[1/1.25] w-full overflow-clip lg:aspect-[.95] lg:w-[calc(55%-1.5rem)]">
          <div className="flex flex-col items-center justify-center pt-8 lg:pt-16 pb-4 lg:pb-8 w-full">
            {/* Entire Phone Frame animates */}
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={phoneVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={transition}
                className="text-white border-white rounded-overflow-hidden-safari relative aspect-[786/1704] h-full w-auto overflow-hidden rounded-2xl border-[1px] md:rounded-3xl lg:rounded-4xl"
              >
                {/* Phone Screen Content */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900">
                  <Image
                    src={currentItem.phoneImage}
                    alt={currentItem.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Illustrative Label */}
            <p className="text-center text-[#f8f8f8] opacity-30 text-[8px] mt-6">
              {t("For illustrative purposes only.")}
            </p>
          </div>
        </div>

        {/* Content Card - Right Side */}
        <div className="bg-white rounded-3xl items-center justify-center relative mt-[-4rem] flex flex-col aspect-[0.92] w-full sm:w-[150%] md:w-full sm:mt-[0px] lg:w-[calc(45%-1.5rem)]">
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="max-w-[300px] w-full cursor-grab active:cursor-grabbing flex flex-col items-center"
          >
            {/* Content that transitions */}
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={contentVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={transition}
                className="flex flex-col items-center"
              >
                {/* Icon */}
                <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white mb-8">
                  {currentItem.icon}
                </div>

                {/* Title */}
                <span className="font-bold mb-4 text-black">
                  {currentItem.title}
                </span>

                {/* Description */}
                <p className="text-black opacity-70 mb-12 text-center">
                  {currentItem.description}
                </p>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          <div className="absolute top-[auto] right-[auto] bottom-8 left-[50%] translate-x-[-50%] flex items-center gap-[.4rem] justify-center">
            <button
              onClick={handlePrev}
              className="cursor-pointer w-[30px] h-[30px] rounded-lg bg-[#0A0A0A0D] text-black transition-colors flex items-center justify-center rotate-[-180deg]"
              aria-label="Previous"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="10"
                height="8"
                fill="none"
              >
                <path
                  fill="currentColor"
                  d="m5.731 0-.564.564L8.199 3.6H.131v.8h8.068L5.167 7.436 5.731 8l4-4z"
                ></path>
              </svg>
            </button>

            {/* Progress Indicators */}
            <div className="flex items-center justify-center gap-2 bg-[#0A0A0A0D] h-[30px] rounded-lg px-4">
              {carouselData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className="relative group"
                  aria-label={`Go to slide ${index + 1}`}
                >
                  {index === currentIndex ? (
                    // Active indicator - progress bar
                    <div className="w-16 h-1 bg-gray-300 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-black rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.1, ease: "linear" }}
                      />
                    </div>
                  ) : (
                    // Inactive indicators - dots
                    <div
                      className={`w-1 h-1 rounded-full cursor-pointer transition-colors bg-black opacity-20 group-hover:bg-gray-400`}
                    />
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={handleNext}
              className="cursor-pointer w-[30px] h-[30px] rounded-lg bg-[#0A0A0A0D] text-black transition-colors flex items-center justify-center"
              aria-label="Next"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="10"
                height="8"
                fill="none"
              >
                <path
                  fill="currentColor"
                  d="m5.731 0-.564.564L8.199 3.6H.131v.8h8.068L5.167 7.436 5.731 8l4-4z"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Brief;
