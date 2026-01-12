"use client";

import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import { useRef, useState } from "react";

interface TeamMember {
  name: string;
  role: string;
  image: string;
  description: string;
}

export default function TeamMembers({
  showTitle = true,
}: {
  showTitle?: boolean;
}) {
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const teamMembers: TeamMember[] = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      description:
        "Associate Wealth Advisor at TG. Prior to TG, Allison worked at Bank of America Private Bank in Charlotte and New York City,serving high net worth and ultra high net worth clients.",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=800&fit=crop",
    },
    {
      name: "Michael Chen",
      role: "CTO",
      description:
        "Associate Wealth Advisor at TG. Prior to TG, Allison worked at Bank of America Private Bank in Charlotte and New York City,serving high net worth and ultra high net worth clients.",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop",
    },
    {
      name: "Emily Rodriguez",
      role: "Head of Design",
      description:
        "Associate Wealth Advisor at TG. Prior to TG, Allison worked at Bank of America Private Bank in Charlotte and New York City,serving high net worth and ultra high net worth clients.",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&h=800&fit=crop",
    },
    {
      name: "James Wilson",
      role: "Lead Developer",
      description:
        "Associate Wealth Advisor at TG. Prior to TG, Allison worked at Bank of America Private Bank in Charlotte and New York City,serving high net worth and ultra high net worth clients.",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=800&fit=crop",
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

  const totalMembers = teamMembers.length;
  const currentIndex = Math.floor(progress * (totalMembers - 1));
  const memberProgress = (progress * (totalMembers - 1)) % 1;

  return (
    <div className="section-container">
      {/* Spacer before section */}
      {showTitle && (
        <div className="flex items-center justify-center">
          <h2 className="mt-24 md:mt-48 text-white text-5xl md:text-7xl text-center">
            MEET THE TEAM
          </h2>
        </div>
      )}

      {/* Mobile View */}
      <div className="md:hidden">
        <div className="grid grid-cols-1 gap-16 px-8 py-24">
          {teamMembers.map((member, index) => (
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
        <div className="grid grid-cols-2 gap-16 items-start max-w-6xl mx-auto px-16 py-20">
          {/* Scrolling team member details - RIGHT SIDE */}
          <div className="text-white max-w-[400px]">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="min-h-screen flex flex-col justify-center"
              >
                <h3 className="text-3xl font-bold mb-8">{member.name}</h3>
                <p className="text-[16px] text-[#f8f8f8] leading-[1.4]">
                  Associate Wealth Advisor at TG. Prior to TG, Allison worked at
                  Bank of America Private Bank in Charlotte and New York City,
                  serving high net worth and ultra high net worth clients.
                </p>
              </div>
            ))}
          </div>

          {/* Sticky image stack - LEFT SIDE */}
          <div className="sticky top-0 h-screen flex items-center">
            <div className="relative w-full h-[65vh]">
              {teamMembers.map((member, index) => {
                const isActive = index === currentIndex;
                const isPast = index < currentIndex;

                return (
                  <motion.div
                    key={index}
                    className="absolute inset-0 rounded-3xl overflow-hidden"
                    style={{
                      zIndex: totalMembers - index,
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
                    {isActive && index < totalMembers - 1 && (
                      <motion.div className="absolute inset-0">
                        <Image
                          width={800}
                          height={800}
                          src={teamMembers[index + 1].image}
                          alt={teamMembers[index + 1].name}
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

      <div className="h-40" />
    </div>
  );
}
