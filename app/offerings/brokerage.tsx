"use client";

import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef, useState } from "react";

interface Service {
    name: string;
    description: string;
    image: string;
}

export default function Brokerage({ showTitle = true }: { showTitle?: boolean }) {
    const [progress, setProgress] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const services: Service[] = [
        {
            name: "MSE",
            description: "Tenger capital manages your portfolio from start to finish. We design the strategy, manage risk, and make ongoing adjustments as markets shift. You stay informed and in control, without the stress of rebalancing, timing trades, or second-guessing decisions. This is active wealth management, built for peace of mind.",

            image:
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=800&fit=crop",
        },
        {
            name: "OTC",
            description: "Think of us as your in-house money team. We handle the moves you don’t have time for, such as account consolidation, rebalancing, and rollovers, with precision and ease.",
            image:
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop",
        },
        {
            name: "IBKR",
            description: "Stay ahead with weekly insights, deep-dive reports, and real-time portfolio updates...without drowning in market chatter.",
            image:
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop",
        }
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
        <div className="section-container">
            {/* Scroll section with sticky images */}
            <div ref={containerRef} className="relative px-8">
                <div className="grid grid-cols-2 gap-16 items-start max-w-6xl mx-auto px-8 py-20">
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
                                                        clipPath: `inset(${100 - memberProgress * 100}% 0 0 0)`,
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
                                <p className="text-[16px] text-[#f8f8f8] leading-[1.4]">
                                    Associate Wealth Advisor at TG. Prior
                                    to TG, Allison worked at Bank of
                                    America Private Bank in Charlotte and
                                    New York City, serving high net worth and
                                    ultra high net worth clients.
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
