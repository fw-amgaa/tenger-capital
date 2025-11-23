"use client";

import GradientBorderButton from "@/components/gradient-border-button";
import Seperator from "@/components/seperator";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef, useState } from "react";

interface Service {
    name: string;
    description: React.ReactNode;
    image: string;
}

export default function UnderWriting({ showTitle = true }: { showTitle?: boolean }) {
    const [progress, setProgress] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const services: Service[] = [
        {
            name: "Debt Issuance",
            description: <div className="flex flex-col gap-2">
                <p className="text-sm text-[#f8f8f8] leading-[1.4]">
                    We structure and execute debt issuances tailored to each issuer’s needs, from flexible OTC private placements to publicly offered MSE-listed bonds. Our team oversees the full process—structuring, due diligence, documentation, regulatory filings, and investor marketing—to support capital raising for expansion, refinancing, working capital, and development projects. We also originate and structure asset-backed securities backed by loan portfolios, receivables, leasing contracts, and microfinance assets. From asset pool analysis and SPV setup to ratings coordination and institutional placement, we help convert cash-flow-generating assets into marketable securities.
                </p>
            </div>,
            image:
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=800&fit=crop",
        },
        {
            name: "Initial Public Offering (IPO) & Equity Capital Markets",
            description: <div className="flex flex-col gap-2">
                <p className="text-sm text-[#f8f8f8] leading-[1.4]">
                    We guide companies through the full IPO process to access equity financing on the Mongolian Stock Exchange. Our team supports issuers from early-stage preparation through listing, including pre-IPO readiness assessments, valuation and financial modeling, prospectus development, and all regulatory submissions. We manage underwriting and book-building activities while leading investor education, marketing campaigns, and roadshows to ensure strong market engagement. Throughout the process, we help issuers build sustainable shareholder structures and position themselves for long-term success in the public markets.
                </p>
            </div>,
            image:
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop",
        },
        {
            name: "Mergers & Acquisitions",
            description: <div className="flex flex-col gap-2">
                <p className="text-sm text-[#f8f8f8] leading-[1.4]">
                    We provide strategic advisory services for both buy-side and sell-side M&A transactions, guiding clients through every stage of the deal process. Our team supports target sourcing and evaluation, conducts financial and commercial due diligence, and leads deal structuring and negotiations to help clients secure favorable terms. We handle valuation and modeling as well as documentation and transaction execution, ensuring a seamless and confidential process. Throughout each engagement, we focus on achieving optimal outcomes through strategic insight and disciplined execution.
                </p>
            </div>,
            image:
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=800&fit=crop",
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
        <div className="section-container py-20">
            <div className="flex flex-col gap-8">
                <Seperator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-4 mb-48">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-serif">UNDERWRITING</h1>
                        {/* <h1 className="text-3xl md:text-4xl font-serif opacity-40">Real Humans. Real Time.</h1> */}
                    </div>

                    <p className="text-base md:text-md leading-relaxed md:w-[400px]">
                        Tenger Capital SC LLC provides end-to-end underwriting and capital-raising solutions for corporations, financial institutions, and government-linked entities. From structuring and regulatory preparation to marketing, distribution, and post-issuance support, our investment banking team ensures efficient and transparent execution. We help issuers raise capital with confidence in both domestic and private markets.                    </p>
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
                </div>
            </div>
        </div>
    );
}
