"use client";

import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import { useRef, useState } from "react";
import { useLanguage } from "@/lib/language-context";

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
  const { t } = useLanguage();

  const teamMembers: TeamMember[] = [
    {
      name: "Gombodorj Nyamtogtokh",
      role: "Chief Executive Officer",
      description:
        "Associate Wealth Advisor at TG. Prior to TG, Allison worked at Bank of America Private Bank in Charlotte and New York City,serving high net worth and ultra high net worth clients.",
      image: "/team-members/all-bw part1-3.jpg",
    },
    {
      name: "Darkhanbayar Radnaa-Ochir",
      role: "Tenger Fund Management CEO",
      description:
        "Associate Wealth Advisor at TG. Prior to TG, Allison worked at Bank of America Private Bank in Charlotte and New York City,serving high net worth and ultra high net worth clients.",
      image: "/team-members/all-bw part1-6.jpg",
    },
    {
      name: "Lkhamsuren Boldbaatar",
      role: "Chief Financial and Operating Officer",
      description:
        "Associate Wealth Advisor at TG. Prior to TG, Allison worked at Bank of America Private Bank in Charlotte and New York City,serving high net worth and ultra high net worth clients.",
      image: "/team-members/all-bw part1-2.jpg",
    },
    {
      name: "Dashnyam Sanduijav",
      role: "Chief Investment Officer",
      description:
        "Associate Wealth Advisor at TG. Prior to TG, Allison worked at Bank of America Private Bank in Charlotte and New York City,serving high net worth and ultra high net worth clients.",
      image: "/team-members/all-bw part1-7.jpg",
    },
    {
      name: "Byambatogoo Davaasuren",
      role: "Chief Marketing Officer",
      description:
        "Associate Wealth Advisor at TG. Prior to TG, Allison worked at Bank of America Private Bank in Charlotte and New York City,serving high net worth and ultra high net worth clients.",
      image: "/team-members/all-bw part2-3.jpg",
    },
    {
      name: "Bilguun Ganbaatar",
      role: "Chief Trade Officer",
      description:
        "Associate Wealth Advisor at TG. Prior to TG, Allison worked at Bank of America Private Bank in Charlotte and New York City,serving high net worth and ultra high net worth clients.",
      image: "/team-members/all-bw part2-4.jpg",
    },
    {
      name: "Erdenekhuu Ulziibadrakh",
      role: "Broker & Office Manager",
      description:
        "Associate Wealth Advisor at TG. Prior to TG, Allison worked at Bank of America Private Bank in Charlotte and New York City,serving high net worth and ultra high net worth clients.",
      image: "/team-members/all-bw part1-5.jpg",
    },
    {
      name: "Bolor Bilegsaikhan",
      role: "Broker",
      description:
        "Associate Wealth Advisor at TG. Prior to TG, Allison worked at Bank of America Private Bank in Charlotte and New York City,serving high net worth and ultra high net worth clients.",
      image: "/team-members/all-bw part2-6.jpg",
    },
    {
      name: "Khangal Batmagnai",
      role: "Broker",
      description:
        "Associate Wealth Advisor at TG. Prior to TG, Allison worked at Bank of America Private Bank in Charlotte and New York City,serving high net worth and ultra high net worth clients.",
      image: "/team-members/all-bw part1-4.jpg",
    },
    {
      name: "Biger Ulambayar",
      role: "Marketing Manager",
      description:
        "Associate Wealth Advisor at TG. Prior to TG, Allison worked at Bank of America Private Bank in Charlotte and New York City,serving high net worth and ultra high net worth clients.",
      image: "/team-members/all-bw part1-8.jpg",
    },
    {
      name: "Nomin-Erdene Baatarchuluun",
      role: "Analyst",
      description:
        "Associate Wealth Advisor at TG. Prior to TG, Allison worked at Bank of America Private Bank in Charlotte and New York City,serving high net worth and ultra high net worth clients.",
      image: "/team-members/all-bw part2-2.jpg",
    },
    {
      name: "Munkhzolboo Batbayar",
      role: "Accountant",
      description:
        "Associate Wealth Advisor at TG. Prior to TG, Allison worked at Bank of America Private Bank in Charlotte and New York City,serving high net worth and ultra high net worth clients.",
      image: "/team-members/all-bw part2-7.jpg",
    },
    {
      name: "Nyamkhishig Purev",
      role: "Driver",
      description:
        "Associate Wealth Advisor at TG. Prior to TG, Allison worked at Bank of America Private Bank in Charlotte and New York City,serving high net worth and ultra high net worth clients.",
      image: "/team-members/all-bw part1-1.jpg",
    },
  ];

  // Framer Motion scroll progress across the entire container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  // With 8 members at 100vh each, description centers align at intervals of 1/7
  // Map directly so image transitions sync with description centers
  const clampedProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);

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
            {t("MEET THE TEAM")}
          </h2>
        </div>
      )}

      {/* Mobile View */}
      <div className="md:hidden">
        <div className="grid grid-cols-1 gap-16 px-8 py-24">
          {teamMembers.map((member, index) => (
            <div key={index} className="text-white">
              <h3 className="text-3xl font-light mb-8">{member.name}</h3>
              <div className="mb-6 h-px w-16 bg-gradient-to-r from-[rgb(255,153,0)] to-transparent" />
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
        <div className="grid grid-cols-2 gap-16 items-start max-w-6xl mx-auto px-16">
          {/* Scrolling team member details - LEFT SIDE */}
          {/* Each description height = (0.84 / 7) * totalScroll / totalScroll * 100 = 12% of container per transition */}
          {/* With 8 members taking full container, each should be ~12% but we have 8 items not 7 transitions */}
          <div className="text-white max-w-[400px]">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="flex flex-col justify-center"
                style={{ height: "100vh" }}
              >
                <h3 className="text-3xl font-bold mb-2">{member.name}</h3>
                <div className="mb-2 h-px w-24 bg-gradient-to-r from-[rgb(255,153,0)] to-transparent" />
                <h3 className="text-lg mb-2">{member.role}</h3>
                {/* <p className="text-[16px] text-[#f8f8f8] leading-[1.4]">
                  {member.description}
                </p> */}
              </div>
            ))}
          </div>

          {/* Sticky image stack - RIGHT SIDE */}
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
    </div>
  );
}
