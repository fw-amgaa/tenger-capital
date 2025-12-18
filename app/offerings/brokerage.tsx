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

  const services: Service[] = [
    {
      name: "Domestic Exchange",
      description: (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-[#f8f8f8] leading-[1.4]">
            Investors can access the domestic primary and secondary markets
            through our online investment platform and mobile apps and manage
            their portfolios, track performance, and stay informed with market
            insights.
          </p>
          <p className="text-sm text-[#f8f8f8] leading-[1.4]">
            Through Tenger Capital, investors can access both primary and
            secondary markets for a wide range of investment products,
            including:
          </p>
          <ol className="text-sm ml-6">
            <li>- Equities</li>
            <li>- Corporate bonds</li>
            <li>- Government bonds</li>
            <li>- Asset-backed securities</li>
          </ol>

          <div className="mt-6 m-auto">
            <GradientBorderButton borderAnimation={false}>
              OPEN YOUR ACCOUNT
            </GradientBorderButton>
          </div>
        </div>
      ),

      image: "/offerings/mse.jpg",
    },
    {
      name: "International Markets",
      description: (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-[#f8f8f8] leading-[1.4]">
            Investors can access 160 stock markets of over 35 countries. Invest
            globally in stocks, ETFs, options, futures, currencies and bonds
            through our partner Interactive Brokers’ unified platform
          </p>

          <div className="mt-6 m-auto">
            <GradientBorderButton borderAnimation={false}>
              OPEN YOUR ACCOUNT
            </GradientBorderButton>
          </div>
        </div>
      ),
      image: "/offerings/external_trade.jpg",
    },
    {
      name: "OTC market",
      description: (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-[#f8f8f8] leading-[1.4]">
            Investors can participate in the fastest growing capital market
            sector in Mongolia. We facilitate both sides of issuance and sales
            of private bonds with thorough due dilligence and integrity.{" "}
          </p>

          <div className="mt-6 m-auto">
            <GradientBorderButton borderAnimation={false}>
              OPEN YOUR ACCOUNT
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
    <div className="section-container py-20">
      <div className="relative flex flex-col gap-8">
        <div
          className="absolute inset-0 opacity-90 z-0"
          style={{
            backgroundImage:
              'linear-gradient(to bottom, rgba(0,0,0,0) 60%, rgba(0,0,0,0.9) 100%), url("/brand/pattern-fade.png")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
        <Seperator />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-4 mb-48 z-5">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif">Brokerage</h1>
            <h1 className="text-3xl md:text-4xl font-serif opacity-40">
              Stand solid. Stay liquid.
            </h1>
          </div>

          <p className="text-base md:text-md leading-relaxed md:w-[400px]">
            Tenger Capital SC LLC delivers dynamic, full-service brokerage
            solutions for both individual and institutional investors. We help
            you take control of your cash flows and put your capital to work
            with purpose. Powered by our research and advisory experts, you gain
            the insight and confidence to act decisively in today’s fast-moving
            markets.
          </p>
        </div>
      </div>
      {/* Scroll section with sticky images */}
      <div ref={containerRef} className="relative px-8">
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
