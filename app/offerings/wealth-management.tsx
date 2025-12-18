"use client";

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

export default function WealthManagement({
  showTitle = true,
}: {
  showTitle?: boolean;
}) {
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const services: Service[] = [
    {
      name: "Fund Management",
      description: (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-[#f8f8f8] leading-[1.4]">
            We provide personalized fund and portfolio management tailored to
            each client’s goals and risk appetite. Our team builds diversified
            portfolios—from conservative fixed-income to growth-oriented equity
            funds—while actively monitoring and adjusting allocations to stay
            aligned with market conditions and client objectives.
          </p>
        </div>
      ),
      image: "/offerings/fund-management.jpg",
    },
    {
      name: "Equity & Market Research",
      description: (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-[#f8f8f8] leading-[1.4]">
            Our dedicated research unit delivers fundamental equity research,
            technical analyses, sector analyses, macroeconomic insights, and
            valuation assessments. These research capabilities form the backbone
            of our investment decisions, supporting portfolio construction, idea
            generation, and tactical market positioning.
          </p>
        </div>
      ),
      image: "/offerings/equity.jpg",
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
            <h1 className="text-3xl md:text-4xl font-serif">
              Wealth & Asset Management
            </h1>
            <h1 className="text-3xl md:text-4xl font-serif opacity-40">
              Preserving wealth. Securing future.
            </h1>
          </div>

          <p className="text-base md:text-md leading-relaxed md:w-[400px]">
            Tenger Capital SC LLC delivers tailored wealth and asset management
            solutions designed to help clients grow, preserve, and strategically
            allocate their capital. Through disciplined portfolio management,
            in-house equity research, and a structured fund platform, we offer
            investment strategies that align with each client’s risk appetite
            and long-term financial objectives.
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
