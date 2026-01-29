"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import GradientBorderButton from "../../gradient-border-button";
import styles from "./styles.module.css";
import {
  AnimatePresence,
  motion,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import Navigation, {
  EASE_CUSTOM,
  ENTER_DURATION,
  EXIT_DURATION,
} from "./navigation";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { FlagIcon, LockIcon } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/language-context";

// Define the scroll threshold (in pixels) for the top animation to start
const TOP_SCROLL_THRESHOLD = 800;
// Define the distance (in pixels) from the bottom of the page to hide the button
const BOTTOM_SCROLL_OFFSET = 700;

interface Props {
  headerMode?: "light" | "dark";
}

export default function Header({ headerMode = "dark" }: Props) {
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  // State for top-scroll animation
  const [isScrolledDown, setIsScrolledDown] = useState(false);
  // NEW STATE: Tracks if the user is near the bottom
  const [isNearBottom, setIsNearBottom] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();

  const logoLight = "/logo/logo_main_light.png";
  const logoDark = "/logo/logo_main_dark.png";

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latestScrollY) => {
    // --- 1. TOP Scroll Logic (Unchanged) ---
    if (latestScrollY > TOP_SCROLL_THRESHOLD && !isScrolledDown) {
      setIsScrolledDown(true);
    } else if (latestScrollY <= TOP_SCROLL_THRESHOLD && isScrolledDown) {
      setIsScrolledDown(false);
    }

    // --- 2. BOTTOM Scroll Logic (NEW) ---
    // We need the total scrollable height and the viewport height
    const scrollHeight = document.body.scrollHeight;
    const clientHeight = window.innerHeight;

    // Max possible scroll position (when scrollbar is at the very bottom)
    const maxScroll = scrollHeight - clientHeight;

    // The point at which we want to hide the button
    const bottomThreshold = maxScroll - BOTTOM_SCROLL_OFFSET;

    // Check if the user is past the bottom threshold
    if (latestScrollY >= bottomThreshold && !isNearBottom) {
      setIsNearBottom(true);
    }
    // Check if the user scrolls up past the bottom threshold
    else if (latestScrollY < bottomThreshold && isNearBottom) {
      setIsNearBottom(false);
    }
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Existing logic for body overflow (UNCHANGED)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isOpen]);

  if (!mounted) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
        <div className="mx-auto px-6 py-4">
          <div className="w-32 h-10 bg-gray-200 animate-pulse rounded" />
        </div>
      </header>
    );
  }

  // Determine the final border animation state:
  const shouldAnimateBorder = !isOpen && isScrolledDown;

  const isButtonVisible = isOpen || !isNearBottom;

  // Define a simple motion variant to control the button's visibility (using opacity)
  const buttonVariants = {
    visible: { opacity: 1, y: 0, pointerEvents: "auto" },
    hidden: { opacity: 0, y: 20, pointerEvents: "none" }, // Slide down and hide
  };

  return (
    <>
      <AnimatePresence mode="wait">{isOpen && <Navigation />}</AnimatePresence>

      <motion.div
        layout
        transition={{
          duration: isOpen ? ENTER_DURATION : EXIT_DURATION,
          ease: EASE_CUSTOM,
        }}
        className={cn(
          "fixed z-50 px-6 py-2",
          isOpen && !isMobile
            ? "top-4 left-4 right-4 w-[calc(100% - 16px)]"
            : "top-0 left-0 right-0 w-full"
        )}
      >
        <div
          className={cn(
            "mx-auto md:px-6 py-2 md:py-4 flex items-center justify-between z-50"
          )}
        >
          {/* Logo and Burger Button (UNCHANGED) */}
          <div className="flex items-center gap-4 relative h-10">
            <div
              className={styles.el}
              onClick={() => {
                setIsOpen(!isOpen);
              }}
            >
              <div
                className={`${styles.burger} ${
                  isOpen ? styles.burgerActive : ""
                } ${headerMode === "light" ? styles.dark : ""}`}
              />
            </div>

            <Link className="block relative" href="/">
              {isOpen || headerMode === "light" ? (
                <Image
                  src={logoDark}
                  alt="Logo"
                  width={128}
                  height={40}
                  className={`h-full w-full object-contain transition-opacity duration-300`}
                />
              ) : (
                <Image
                  src={logoLight}
                  width={128}
                  height={40}
                  alt="Logo"
                  className={`h-full w-full object-contain transition-opacity duration-300`}
                />
              )}
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex">
            <motion.div
              className="hidden sm:block"
              variants={buttonVariants}
              animate={isButtonVisible ? "visible" : "hidden"}
              transition={{ duration: 0.3 }}
            >
              <GradientBorderButton
                mode={isOpen ? "light" : headerMode}
                hasBorder={false}
                iconComponent={<></>}
                onClick={toggleLanguage}
              >
                {language === "en" ? "EN" : "MN"}
              </GradientBorderButton>
            </motion.div>
            <motion.div
              className="hidden sm:block"
              variants={buttonVariants}
              animate={isButtonVisible ? "visible" : "hidden"}
              transition={{ duration: 0.3 }}
            >
              <Link
                href="https://xacex.tengercapital.mn/auth/login"
                target="_blank"
              >
                <GradientBorderButton
                  mode={isOpen ? "light" : headerMode}
                  hasBorder={false}
                  iconComponent={<LockIcon size={12} />}
                >
                  LOG IN
                </GradientBorderButton>
              </Link>
            </motion.div>
            <motion.div
              variants={buttonVariants}
              animate={isButtonVisible ? "visible" : "hidden"}
              transition={{ duration: 0.3 }}
            >
              <Link
                href="https://xacex.tengercapital.mn/auth/login"
                target="_blank"
              >
                <GradientBorderButton
                  mode={isOpen ? "light" : headerMode}
                  borderAnimation={shouldAnimateBorder}
                >
                  {t("OPEN AN ACCOUNT")}
                </GradientBorderButton>
              </Link>
            </motion.div>
          </nav>
        </div>
      </motion.div>
    </>
  );
}
