'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'

const initialWidth = 250 // Initial image size in pixels
const initialHeight = 150 // Initial image size in pixels
const sectionPoint = 0.5

export default function HeroSection() {
    const containerRef = useRef<HTMLDivElement>(null)
    const [scaleWidth, setScaleWidth] = useState(1)
    const [scaleHeight, setScaleHeight] = useState(1)

    useEffect(() => {
        const calculateScale = () => {
            const viewportWidth = window.innerWidth
            const viewportHeight = window.innerHeight

            // Calculate scale needed to cover viewport (use the larger scale to ensure full coverage)
            const scaleX = viewportWidth / initialWidth
            const scaleY = viewportHeight / initialHeight

            setScaleWidth(scaleX)
            setScaleHeight(scaleY)
        }

        calculateScale()
        window.addEventListener('resize', calculateScale)
        return () => window.removeEventListener('resize', calculateScale)
    }, [])

    // Track scroll progress
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    })

    const imageWidth = useTransform(scrollYProgress, [0, sectionPoint], [1 * initialWidth, scaleWidth * initialWidth])
    const imageHeight = useTransform(scrollYProgress, [0, sectionPoint], [1 * initialHeight, scaleHeight * initialHeight])
    const imageRadius = useTransform(scrollYProgress, [0, sectionPoint], ['32px', '0px'])
    const middleTextOpacity = useTransform(scrollYProgress, [sectionPoint, 0.8, 1], [0, 1, 1])
    const middleTextTranslation = useTransform(scrollYProgress, [sectionPoint, 0.8], [50, 0])

    return (
        <div ref={containerRef} className="relative bg-background">
            {/* Section 1: Initial view with text and small image */}
            <div className="h-[300vh]">
                {/* Sticky container for the animation */}
                <div className="sticky top-0 h-screen w-full overflow-hidden">
                    {/* Initial centered text */}
                    <motion.div
                        // style={{ opacity: initialTextOpacity }}
                        className="absolute inset-0 flex items-center justify-center z-5"
                    >
                        <h1 className="text-4xl md:text-8xl text-center mb-16 px-32">
                            CREATE VALUE THROUGH INVESTING
                        </h1>
                    </motion.div>

                    <motion.div
                        style={{
                            width: imageWidth,
                            height: imageHeight,
                            borderRadius: imageRadius,
                            bottom: imageRadius
                        }}
                        className="absolute left-1/2 -translate-x-1/2 z-10"
                    >
                        <div className="relative w-full h-full overflow-hidden" style={{ borderRadius: 'inherit' }}>
                            <img
                                src="mockups/4.avif"
                                alt="Expanding landscape"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </motion.div>

                    {/* Middle text that fades in after image locks */}
                    <motion.div
                        style={{ opacity: middleTextOpacity, translateY: middleTextTranslation }}
                        className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
                    >
                        <h2 className="text-4xl md:text-6xl font-bold text-white text-center px-4 drop-shadow-lg">
                            <span>Founded on Integrity.</span><br />
                            <span>Focused on Your Future.</span>
                        </h2>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
