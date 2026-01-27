"use client";

import GradientBorderButton from "@/components/gradient-border-button";
import Seperator from "@/components/seperator";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import { useRef, useState } from "react";
import introduction from "@/videos/2040x516.mp4";
import NextVideo from "next-video";
import { useLanguage } from "@/lib/language-context";

interface Service {
  name: string;
  description: React.ReactNode;
  image: string;
}

export default function Brokerage({
  showTitle = true,
}: {
  showTitle?: boolean;
}) {
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  const services: Service[] = [
    {
      name: t("Domestic Exchange"),
      description: (
        <div className="flex flex-col gap-2">
          <p className="text-md text-[#f8f8f8] leading-[1.4]">
            {t("domestic.description")}
          </p>
          <ol className="text-md ml-6">
            <li>- {t("Equities")}</li>
            <li>- {t("Corporate bonds")}</li>
            <li>- {t("Government bonds")}</li>
            <li>- {t("Asset-backed securities")}</li>
          </ol>

          <div className="mt-6 m-auto">
            <GradientBorderButton borderAnimation={false}>
              {t("Open your account")}
            </GradientBorderButton>
          </div>
        </div>
      ),

      image: "/offerings/mse.jpg",
    },
    {
      name: t("International Markets"),
      description: (
        <div className="flex flex-col gap-2">
          <p className="text-md text-[#f8f8f8] leading-[1.4]">
            {t("international.description")}
          </p>

          <div className="mt-6 m-auto">
            <GradientBorderButton borderAnimation={false}>
              {t("Open your account")}
            </GradientBorderButton>
          </div>
        </div>
      ),
      image: "/offerings/external_trade.jpg",
    },
    {
      name: t("OTC market"),
      description: (
        <div className="flex flex-col gap-2">
          <p className="text-md text-[#f8f8f8] leading-[1.4]">
            {t("otc.description")}
          </p>

          <div className="mt-6 m-auto">
            <GradientBorderButton borderAnimation={false}>
              {t("Open your account")}
            </GradientBorderButton>
          </div>
        </div>
      ),
      image: "/offerings/otc-market.jpg",
    },
  ];

  // Framer Motion scroll progress across the entire container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  // Only advance progress while the sticky image is actually pinned on screen.
  // Clamp to an inner band to avoid pre/post changes (tune as needed).
  const clampedProgress = useTransform(scrollYProgress, [0.08, 0.92], [0, 1]);

  useMotionValueEvent(clampedProgress, "change", (v) => {
    setProgress(Math.max(0, Math.min(1, v)));
  });

  const totalServices = services.length;
  const currentIndex = Math.floor(progress * (totalServices - 1));
  const memberProgress = (progress * (totalServices - 1)) % 1;

  return (
    <div className="section-container mt-16 md:mt-32">
      <div className="relative flex flex-col gap-8">
        <div className="absolute w-full h-full z-0 overflow-hidden top-0 left-0">
          <NextVideo
            src={introduction}
            controls={false}
            playsInline
            muted={true}
            autoPlay={true}
            loop={true}
            className="h-full [--media-object-fit:cover]"
          />
        </div>
        <Seperator />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-4 mb-16 md:mb-48 z-5">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif">{t("Brokerage")}</h1>
            <h1 className="text-3xl md:text-4xl font-serif opacity-40">
              {t("Stand solid. Stay liquid.")}
            </h1>
          </div>

          <p className="text-base md:text-md leading-relaxed md:w-[400px]">
            {t("brokerage.description")}
          </p>
        </div>
      </div>

      {/* Mobile view */}
      <div className="md:hidden">
        <div className="grid grid-cols-1 gap-16 px-8">
          {services.map((member, index) => (
            <div key={index} className="text-white">
              <h3 className="text-3xl font-light mb-8">{member.name}</h3>
              <p className="text-md leading-[1.4] opacity-70">
                {member.description}
              </p>

              <div className="w-full aspect-square mt-8 relative rounded-2xl overflow-hidden">
                <Image
                  src={member.image}
                  alt={member.name + "image"}
                  fill
                  objectFit="cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll section with sticky images */}
      <div ref={containerRef} className="relative px-8 hidden md:block">
        <div className="grid grid-cols-2 gap-16 items-start max-w-6xl mx-auto px-8">
          {/* Sticky image stack - LEFT SIDE */}
          <div className="sticky top-0 h-screen flex items-center">
            <div className="relative w-full h-[65vh]">
              {services.map((member, index) => {
                const isActive = index === currentIndex;
                const isPast = index < currentIndex;

                return (
                  <motion.div
                    key={index}
                    className="absolute inset-0 rounded-3xl overflow-hidden"
                    style={{
                      zIndex: totalServices - index,
                    }}
                  >
                    {/* Background image (current) */}
                    <motion.div className="absolute inset-0">
                      <Image
                        src={member.image}
                        alt={member.name}
                        width={800}
                        height={800}
                        className="w-full h-full object-cover"
                        style={{ opacity: isPast ? 0 : 1 }}
                      />
                    </motion.div>

                    {/* Next image with reversed vertical clip-path reveal (bottom to top) */}
                    {/* Next image with vertical clip-path reveal (top to bottom) */}
                    {isActive && index < totalServices - 1 && (
                      <motion.div className="absolute inset-0">
                        <Image
                          width={800}
                          height={800}
                          src={services[index + 1].image}
                          alt={services[index + 1].name}
                          className="absolute inset-0 w-full h-full object-cover"
                          style={{
                            clipPath: `inset(${
                              100 - memberProgress * 100
                            }% 0 0 0)`,
                          }}
                        />
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Scrolling team member details - RIGHT SIDE */}
          <div className="text-white max-w-[400px]">
            {services.map((service, index) => (
              <div
                key={index}
                className="min-h-screen flex flex-col justify-center"
              >
                <h3 className="text-3xl font-bold mb-8">{service.name}</h3>

                {service.description}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
