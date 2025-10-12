"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";

interface TeamMember {
  name: string;
  role: string;
  image: string;
}

export default function TeamMembers() {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const teamMembers: TeamMember[] = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=800&fit=crop",
    },
    {
      name: "Michael Chen",
      role: "CTO",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop",
    },
    {
      name: "Emily Rodriguez",
      role: "Head of Design",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&h=800&fit=crop",
    },
    {
      name: "James Wilson",
      role: "Lead Developer",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=800&fit=crop",
    },
  ];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            window.addEventListener("scroll", handleScroll);
          } else {
            window.removeEventListener("scroll", handleScroll);
          }
        });
      },
      {
        threshold: 0,
        rootMargin: "0px",
      }
    );

    const handleScroll = () => {
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const containerHeight = container.offsetHeight;
      const viewportHeight = window.innerHeight;

      const scrollStart = 0;
      const scrollEnd = containerHeight - viewportHeight;
      const scrolled = -rect.top;

      const progress = Math.max(
        0,
        Math.min(1, (scrolled - scrollStart) / scrollEnd)
      );
      setScrollProgress(progress);
    };

    observer.observe(container);
    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const totalMembers = teamMembers.length;
  const currentIndex = Math.floor(scrollProgress * (totalMembers - 1));
  const memberProgress = (scrollProgress * (totalMembers - 1)) % 1;

  return (
    <div className="">
      {/* Spacer before section */}
      <div className="flex items-center justify-center">
        <h2 className="my-100 text-white text-6xl">MEET THE TEAM</h2>
      </div>

      {/* Scroll section with sticky images */}
      <div ref={containerRef} className="relative">
        <div className="grid grid-cols-2 gap-16 items-start max-w-6xl mx-auto px-8 py-20">
          {/* Scrolling team member details - RIGHT SIDE */}
          <div className="text-white">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="min-h-screen flex flex-col justify-center"
              >
                <h3 className="text-5xl font-bold mb-4">{member.name}</h3>
                <p className="text-2xl text-gray-400 mb-8">{member.role}</p>
                <p className="text-lg text-gray-500 max-w-md">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>
            ))}
          </div>

          {/* Sticky image stack - LEFT SIDE */}
          <div className="sticky top-60 h-[500px]">
            <div className="relative w-full h-full">
              {teamMembers.map((member, index) => {
                const isActive = index === currentIndex;
                const isPast = index < currentIndex;

                return (
                  <div
                    key={index}
                    className="absolute inset-0 rounded-2xl overflow-hidden"
                    style={{
                      zIndex: totalMembers - index,
                    }}
                  >
                    {/* Background image (current) */}
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={800}
                      height={800}
                      className="w-full h-full object-cover"
                      style={{
                        opacity: isPast ? 0 : 1,
                      }}
                    />

                    {/* Next image with reversed vertical clip-path reveal (bottom to top) */}
                    {/* Next image with vertical clip-path reveal (top to bottom) */}
                    {isActive && index < totalMembers - 1 && (
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
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="h-100" />
    </div>
  );
}
