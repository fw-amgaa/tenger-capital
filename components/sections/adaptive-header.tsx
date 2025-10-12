"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import GradientBorderButton from "../gradient-border-button";

export default function AdaptiveHeader() {
  const [logoVariant, setLogoVariant] = useState<"light" | "dark">("light");
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const logoLight = "/logo/logo_main_white.png";
  const logoDark = "/logo/logo_main_black.png";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const sections = document.querySelectorAll("[data-header-theme]");

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the section with highest intersection ratio in the header area
        let topSection: Element | null = null;
        let maxRatio = 0;

        entries.forEach((entry) => {
          // Only consider sections intersecting with top 100px (header area)
          const rect = entry.boundingClientRect;
          if (rect.top < 100 && rect.bottom > 0) {
            if (entry.intersectionRatio > maxRatio) {
              maxRatio = entry.intersectionRatio;
              topSection = entry.target;
            }
          }
        });

        if (topSection) {
          const sectionTheme = (topSection as Element).getAttribute(
            "data-header-theme"
          );
          const currentTheme = theme === "system" ? systemTheme : theme;

          // Determine logo variant based on section theme AND global theme
          if (sectionTheme === "light") {
            // Light section background = use dark logo
            setLogoVariant("dark");
          } else if (sectionTheme === "dark") {
            // Dark section background = use light logo
            setLogoVariant("light");
          } else if (sectionTheme === "auto") {
            // Auto = follow global theme
            setLogoVariant(currentTheme === "dark" ? "light" : "dark");
          }
        }
      },
      {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
        rootMargin: "-80px 0px 0px 0px", // Adjust based on header height
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, [mounted, theme, systemTheme]);

  if (!mounted) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
        <div className="container mx-auto px-6 py-4">
          <div className="w-32 h-10 bg-gray-200 animate-pulse rounded" />
        </div>
      </header>
    );
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo with smooth transition */}
        <div className="relative w-32 h-10">
          <Image
            src={logoLight}
            width={128}
            height={40}
            alt="Logo"
            className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 ${
              logoVariant === "light" ? "opacity-100" : "opacity-0"
            }`}
          />
          <Image
            src={logoDark}
            alt="Logo"
            width={128}
            height={40}
            className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 ${
              logoVariant === "dark" ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>

        {/* Navigation */}
        <nav className="flex gap-6">
          <GradientBorderButton>OPEN AN ACCOUNT</GradientBorderButton>
        </nav>
      </div>
    </header>
  );
}
