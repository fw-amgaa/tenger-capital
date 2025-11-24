'use client'

import { useEffect, useRef, useState } from 'react'

interface StatProps {
    value: string
    label: string
    suffix?: string
    prefix?: string
    delay?: number
}

function StatCard({ value, label, suffix = '', prefix = '', delay = 0 }: StatProps) {
    const [isVisible, setIsVisible] = useState(false)
    const cardRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(() => setIsVisible(true), delay)
                }
            },
            { threshold: 0.1 }
        )

        if (cardRef.current) {
            observer.observe(cardRef.current)
        }

        return () => observer.disconnect()
    }, [delay])

    return (
        <div
            ref={cardRef}
            className={`group relative overflow-hidden rounded-3xl bg-gradient-to-r from-[rgb(255,153,0)] via-[rgb(248,229,181)] via-[rgb(161,111,16)] via-[rgb(248,229,181)] to-[rgb(255,153,0)] p-[1px] transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}
        >
            <div className="relative h-full overflow-hidden rounded-3xl bg-gradient-to-br from-black/95 to-black/98 backdrop-blur-sm transition-all duration-500 hover:from-black/90 hover:to-black/95">
                <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-[#ff990026] blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative bg-[#ff990026] p-8">
                    <div className="mb-4 flex items-baseline gap-1">
                        {prefix && (
                            <span className="text-3xl font-light text-white/60 md:text-4xl">
                                {prefix}
                            </span>
                        )}
                        <span className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
                            {value}
                        </span>
                        {suffix && (
                            <span className="text-3xl font-light text-white/60 md:text-4xl">
                                {suffix}
                            </span>
                        )}
                    </div>

                    <div className="mb-4 h-px w-12 bg-gradient-to-r from-[rgb(255,153,0)] to-transparent" />

                    <p className="text-xs font-medium uppercase tracking-wider text-white/50 md:text-sm">
                        {label}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default function KeyFigures() {
    return (
        <section className="relative overflow-hidden section-container py-24 md:py-32 lg:py-40">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-1/2 left-1/4 h-96 w-96 rounded-full bg-[rgb(255,153,0)]/[0.03] blur-3xl" />
                <div className="absolute -bottom-1/2 right-1/4 h-96 w-96 rounded-full bg-[rgb(248,229,181)]/[0.02] blur-3xl" />
            </div>

            <div className="relative mx-auto max-w-7xl">
                <div className="mb-16 text-center md:mb-20">
                    <h2 className="text-balance text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
                        Trusted by Clients Worldwide
                    </h2>
                    <p className="mx-auto mt-6 max-w-2xl text-sm text-white/60 md:text-lg">
                        Building wealth through expertise, innovation, and unwavering commitment to excellence
                    </p>
                </div>

                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    <StatCard
                        value="300"
                        suffix="B+"
                        prefix="₮"
                        label="Billion raised in 2025H1"
                        delay={0}
                    />
                    <StatCard
                        value="170"
                        suffix="+"
                        label="Institutional and HNW clients"
                        delay={100}
                    />
                    <StatCard
                        value="18"
                        label="Years of Experience"
                        delay={200}
                    />
                    <StatCard
                        value="94"
                        suffix="%"
                        label="Client Retention Rate"
                        delay={300}
                    />
                    <StatCard
                        value="10,000"
                        suffix="+"
                        label="Retail Clients"
                        delay={400}
                    />
                    <StatCard
                        value="15"
                        suffix="%"
                        label="Average Annual Return"
                        delay={500}
                    />
                </div>
            </div>
        </section>
    )
}
