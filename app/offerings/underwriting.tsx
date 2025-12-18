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

export default function UnderWriting({
  showTitle = true,
}: {
  showTitle?: boolean;
}) {
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const services: Service[] = [
    {
      name: "Debt Issuance",
      description: (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-[#f8f8f8] leading-[1.4]">
            We structure and execute debt offerings—from flexible OTC placements
            to MSE-listed bonds—and asset-backed securities. Our team manages
            structuring, due diligence, documentation, filings, and investor
            marketing, helping clients raise capital for expansion, refinancing,
            working capital, or development projects.
          </p>
        </div>
      ),
      image: "/offerings/debt-insurance.png",
    },
    {
      name: "IPO & Equity Capital Markets",
      description: (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-[#f8f8f8] leading-[1.4]">
            We guide companies through the IPO process on the Mongolian Stock
            Exchange, covering preparation, valuation, prospectus drafting,
            regulatory filings, underwriting, and investor outreach. Our support
            helps issuers engage markets effectively, build sustainable
            shareholder structures, and achieve long-term success.
          </p>
        </div>
      ),
      image: "/offerings/mse.jpg",
    },
    {
      name: "Mergers & Acquisitions",
      description: (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-[#f8f8f8] leading-[1.4]">
            We advise on buy-side and sell-side M&A, supporting target
            evaluation, due diligence, deal structuring, valuation, and
            execution. Our team ensures confidential, strategic guidance,
            helping clients secure favorable terms and achieve optimal
            transaction outcomes.
          </p>
        </div>
      ),
      image: "/offerings/m_a.jpg",
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
            <h1 className="text-3xl md:text-4xl font-serif">Underwriting</h1>
            <h1 className="text-3xl md:text-4xl font-serif opacity-40">
              Building value that lasts.
            </h1>
          </div>

          <p className="text-base md:text-md leading-relaxed md:w-[400px]">
            Tenger Capital SC LLC provides end-to-end underwriting and
            capital-raising solutions for corporations and institutions, guiding
            clients through structuring, regulatory compliance, marketing, and
            distribution. We ensure efficient execution and help issuers raise
            capital confidently across domestic and private markets.
          </p>
        </div>
      </div>
      {/* Scroll section with sticky images */}
      <div ref={containerRef} className="relative px-8">
        <div className="grid grid-cols-2 gap-16 items-start max-w-6xl mx-auto px-8">
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
        </div>
      </div>
    </div>
  );
}
