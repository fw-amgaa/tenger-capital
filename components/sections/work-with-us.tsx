import React, { useState, useRef, useEffect } from 'react';
import { motion, useTime, useTransform, AnimatePresence } from 'framer-motion';
import { PlusIcon, X } from 'lucide-react';

const statsData = [
    {
        title: "Tenger Capital clients have historically compounded their wealth at an average of 10.72%/year. Composite performance represents the net annualized return from 2/20/18 through 12/31/24. Tap the '+' for additional disclosures.",
        percentage: "10.72",
        unit: "%",
        label: "With TG +10.72%",
        hasChart: true,
        disclosure: "Past performance is not indicative of future results. Investment involves risk, including the potential loss of principal. The composite performance shown represents the net annualized return for all Tenger Capital clients from February 20, 2018, through December 31, 2024. Individual results may vary based on timing of investment, market conditions, and personal financial circumstances. This data includes reinvested dividends and is net of all fees and expenses."
    },
    {
        title: "Better value than a typical private wealth manager.",
        percentage: "60",
        unit: "%",
        suffix: "cheaper",
        labels: ["Others", "TG"],
        hasBarChart: true,
        disclosure: "Fee comparison based on industry average private wealth management fees of 1.0% AUM for portfolios under $1M versus Tenger Capital's standard advisory fee of 0.40% AUM. Actual savings may vary based on portfolio size, service level, and additional account fees. This comparison does not include performance-based fees or transaction costs that may apply to either service."
    },
    {
        title: "Save up to 5–10 hours weekly managing your portfolio.",
        percentage: "100",
        unit: "%",
        suffix: "time saved",
        label: "With TG",
        hasPieChart: true,
        disclosure: "Time savings estimate based on average self-directed investor activities including research, portfolio rebalancing, tax optimization, and performance tracking. Actual time saved varies by individual investment strategy complexity and personal involvement preferences. This represents potential time allocation that can be redirected to other activities when using Tenger Capital's managed services."
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
    percentage,
    unit,
    suffix,
    label,
    labels,
    hasChart,
    hasBarChart,
    hasPieChart,
    disclosure
}: {
    title: string;
    percentage: string;
    unit: string;
    suffix?: string;
    label?: string;
    labels?: string[];
    hasChart?: boolean;
    hasBarChart?: boolean;
    hasPieChart?: boolean;
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
        <div className="relative aspect-3/5 rounded-3xl overflow-hidden max-w-[400px]">
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
                    <p className="text-white/60 text-sm leading-relaxed mb-auto pr-8">
                        {title}
                    </p>

                    {/* Visual Content */}
                    <div className="flex-grow flex items-end mb-8">
                        {hasChart && (
                            <div className="w-full h-32 relative">
                                {/* Simple line chart visualization */}
                                <svg viewBox="0 0 400 120" className="w-full h-full">
                                    {/* Grid lines */}
                                    {[0, 1, 2, 3, 4].map((i) => (
                                        <line
                                            key={i}
                                            x1="0"
                                            y1={i * 30}
                                            x2="400"
                                            y2={i * 30}
                                            stroke="rgba(255,255,255,0.05)"
                                            strokeWidth="1"
                                            strokeDasharray="4 4"
                                        />
                                    ))}

                                    {/* Growth line */}
                                    <path
                                        d="M 0 110 Q 100 100 200 60 T 400 20"
                                        fill="none"
                                        stroke="rgb(255,153,0)"
                                        strokeWidth="2"
                                    />

                                    {/* Label badge */}
                                    <g transform="translate(230, 30)">
                                        <rect
                                            x="-55"
                                            y="-12"
                                            width="110"
                                            height="24"
                                            rx="12"
                                            fill="rgb(255,153,0)"
                                        />
                                        <text
                                            x="0"
                                            y="4"
                                            textAnchor="middle"
                                            fill="#2a2520"
                                            fontSize="10"
                                            fontWeight="600"
                                        >
                                            {label}
                                        </text>
                                    </g>

                                    {/* Arrow */}
                                    <path
                                        d="M 390 20 L 400 25 L 390 30"
                                        fill="none"
                                        stroke="rgb(255,153,0)"
                                        strokeWidth="2"
                                    />
                                </svg>
                            </div>
                        )}

                        {hasBarChart && (
                            <div className="w-full h-48 flex items-end gap-8">
                                {/* Others bar */}
                                <div className="flex-1 flex flex-col items-center gap-3">
                                    <div className="relative w-full rounded-t-2xl bg-[#3d3530] h-32">
                                        <div className="absolute top-4 left-1/2 -translate-x-1/2">
                                            <div className="px-4 py-1 rounded-full bg-[#4a3f38] text-white/60 text-xs font-medium whitespace-nowrap">
                                                {labels?.[0]}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* TG bar */}
                                <div className="flex-1 flex flex-col items-center gap-3">
                                    <div className="relative w-full rounded-t-2xl bg-gradient-to-b from-[#8b6a3f] to-[#5a4628] h-48">
                                        <div className="absolute top-4 left-1/2 -translate-x-1/2">
                                            <div className="px-4 py-1 rounded-full border border-[#d4a55a] bg-[#5a4628] text-[#d4a55a] text-xs font-medium whitespace-nowrap">
                                                {labels?.[1]}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {hasPieChart && (
                            <div className="w-full h-48 flex items-center justify-center">
                                {/* Pie chart using SVG */}
                                <div className="relative w-48 h-48">
                                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                                        {/* Full circle background */}
                                        <circle
                                            cx="50"
                                            cy="50"
                                            r="40"
                                            fill="none"
                                            stroke="#3d3530"
                                            strokeWidth="20"
                                        />
                                        {/* 100% arc - full circle */}
                                        <circle
                                            cx="50"
                                            cy="50"
                                            r="40"
                                            fill="none"
                                            stroke="url(#gradient)"
                                            strokeWidth="20"
                                            strokeDasharray="251.2"
                                            strokeDashoffset="0"
                                        />
                                        <defs>
                                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="#d4a55a" />
                                                <stop offset="100%" stopColor="#8b6a3f" />
                                            </linearGradient>
                                        </defs>
                                    </svg>

                                    {/* Label on arc */}
                                    <div className="absolute top-8 right-4">
                                        <div className="px-3 py-1 rounded-full border border-[#d4a55a] bg-[#5a4628] text-[#d4a55a] text-xs font-medium whitespace-nowrap">
                                            {label}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Percentage Display */}
                    <div className="flex items-baseline gap-1">
                        <span className="text-white text-7xl font-bold leading-none">
                            {percentage}
                        </span>
                        <span className="text-white text-4xl font-bold leading-none mb-2">
                            {unit}
                        </span>
                    </div>

                    {/* Suffix */}
                    {suffix && (
                        <p className="text-white/60 text-sm mt-2">{suffix}</p>
                    )}

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