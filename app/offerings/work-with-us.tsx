'use client'

import React, { useState, useRef, useEffect } from 'react';
import { motion, useTime, useTransform, AnimatePresence } from 'framer-motion';
import { PlusIcon, X } from 'lucide-react';

const statsData = [
    {
        title: "Underwriting",
        disclosure: "We turn big ideas into real capital — fast, structured, and market-ready. Your deal gets the clarity, reach, and execution it deserves."
    },
    {
        title: "Brokerage",
        disclosure: "Trade smarter with a team that actually knows you. Precision execution, real-time insights, and zero guesswork — just clean, confident moves."
    },
    {
        title: "Wealth Management",
        disclosure: "Your goals, engineered. Dedicated experts, tailored strategies, and smart guidance that makes every decision feel effortless."
    }
];

const WorkWithUs = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        if (scrollRef.current) {
            const scrollPosition = scrollRef.current.scrollLeft;
            const cardWidth = scrollRef.current.offsetWidth;
            const newIndex = Math.round(scrollPosition / cardWidth);
            setCurrentIndex(newIndex);
        }
    };

    useEffect(() => {
        const scrollElement = scrollRef.current;
        if (scrollElement) {
            scrollElement.addEventListener('scroll', handleScroll);
            return () => scrollElement.removeEventListener('scroll', handleScroll);
        }
    }, []);

    return (
        <div className="w-full">
            <div className='flex justify-center'>
                <h2 className='text-[32px] my-48 text-center md:w-[240px] leading-[1]'>
                    Why Should You Work With Us?
                </h2>
            </div>
            {/* Desktop View */}
            <div className="hidden section-container md:grid md:grid-cols-3 gap-4 lg:gap-6">
                {statsData.map((stat, index) => (
                    <StatsCard key={index} {...stat} />
                ))}
            </div>

            {/* Mobile View - Scrollable */}
            <div
                ref={scrollRef}
                className="md:hidden flex overflow-x-scroll snap-x snap-mandatory scrollbar-hide ml-8"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {statsData.map((stat, index) => (
                    <div
                        key={index}
                        className="flex-shrink-0 max-w-[400px] w-full snap-center px-4 first:pl-4 last:pr-4"
                    >
                        <StatsCard {...stat} />
                    </div>
                ))}
            </div>

            {/* Mobile Pagination Dots */}
            <div className="md:hidden flex justify-center gap-2 mt-6">
                {statsData.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            scrollRef.current?.scrollTo({
                                left: index * scrollRef.current.offsetWidth,
                                behavior: 'smooth'
                            });
                        }}
                        className="relative"
                    >
                        <div className={`w-2 h-2 rounded-full transition-colors ${index === currentIndex ? 'bg-white' : 'bg-white/30'
                            }`} />
                    </button>
                ))}
            </div>
        </div>
    );
};

const StatsCard = ({
    title,
    disclosure
}: {
    title: string;
    disclosure?: string;
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const time = useTime();
    const rotate = useTransform(time, [0, 10000], [0, 360], { clamp: false });

    const rotatingBackground = useTransform(rotate, (r) => {
        return `linear-gradient(${r}deg,
      rgb(255,153,0) 15.57%,
      rgb(248,229,181) 33.39%,
      rgb(161,111,16) 50.58%,
      rgb(248,229,181) 67.75%,
      rgb(255,153,0) 91.74%)`;
    });

    return (
        <div className="relative aspect-3/4 rounded-3xl overflow-hidden max-w-[400px]">
            {/* Rotating Gradient Border */}
            <motion.div
                style={{
                    background: rotatingBackground,
                }}
                className="absolute inset-0 rounded-3xl"
            />

            {/* Inner Card */}
            <div className='absolute inset-[1px] bg-black rounded-3xl overflow-hidden'>
                <div className="bg-[#ff990026] p-8 lg:p-12 flex flex-col h-full relative">
                    {/* Plus/Close Button */}
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="absolute top-6 right-6 w-6 h-6 rounded-full flex items-center justify-center bg-white/10 text-white/60 hover:text-white/80 transition-colors z-20"
                    >
                        <AnimatePresence mode="wait">
                            {isExpanded ? (
                                <motion.div
                                    key="close"
                                    initial={{ opacity: 0, rotate: -90 }}
                                    animate={{ opacity: 1, rotate: 0 }}
                                    exit={{ opacity: 0, rotate: 90 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <X size={12} strokeWidth={3} color='white' />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="plus"
                                    initial={{ opacity: 0, rotate: 90 }}
                                    animate={{ opacity: 1, rotate: 0 }}
                                    exit={{ opacity: 0, rotate: -90 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <PlusIcon size={12} strokeWidth={3} color='white' />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </button>

                    {/* Title */}
                    <p className="text-white/80 text-base leading-relaxed mb-auto pr-8">
                        {title}
                    </p>

                    {/* Disclosure */}
                    <p className="text-white/60 text-sm leading-relaxed mb-auto pr-8">
                        {disclosure}
                    </p>

                    {/* Disclosure Overlay */}
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="absolute inset-0 rounded-3xl bg-white/10 backdrop-blur-sm p-4 md:p-8 flex items-center justify-center overflow-hidden"
                            >
                                <div className="max-w-full overflow-y-auto max-h-full">
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{
                                            duration: 0.8,
                                            delay: 0.2,
                                            ease: "easeOut"
                                        }}
                                        className="text-[#fda6228c] text-sm leading-relaxed"
                                    >
                                        {disclosure?.split('').map((char, index) => (
                                            <motion.span
                                                key={index}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{
                                                    duration: 0.02,
                                                    delay: 0.1 + (index * 0.005),
                                                    ease: "easeOut"
                                                }}
                                            >
                                                {char}
                                            </motion.span>
                                        ))}
                                    </motion.p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default WorkWithUs;