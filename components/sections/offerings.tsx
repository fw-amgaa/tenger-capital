'use client'

import { useComponentWidth } from "@/hooks/use-component-width"
import { cn } from "@/lib/utils"
import { motion, useAnimation, useInView, useMotionTemplate, useMotionValueEvent, useScroll, useTransform } from "framer-motion"
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import GradientBorderButton from "../gradient-border-button"
import Link from "next/link"

const openingState = 0.22
const firstState = 0.3
const secondState = 0.6
const thirdState = 0.65
const fourthState = 0.71
const fifthState = 0.75
const closingState = 0.8

const initialBorderRadius = '32px'
const initialMargin = '64px'

const months = [
    {
        month: "JAN",
        hours: "0AM"
    },
    {
        month: "FEB",
        hours: "4AM"
    },
    {
        month: "MAR",
        hours: "8AM"
    },
    {
        month: "APR",
        hours: "12AM"
    },
    {
        month: "MAY",
        hours: "4PM"
    },
    {
        month: "JUN",
        hours: "8PM"
    },
    {
        month: "JUL",
        hours: "12PM"
    },
    {
        month: "AUG",
        hours: "0AM"
    },
    {
        month: "SEP",
        hours: "0AM"
    },
    {
        month: "OCT",
        hours: "0AM"
    },
    {
        month: "NOV",
        hours: "0AM"
    },
    {
        month: "DEC",
        hours: "0AM"
    },
]

interface Props {
    setHeaderMode: Dispatch<SetStateAction<"light" | "dark">>
}

export default function Offerings({ setHeaderMode }: Props) {
    const containerRef = useRef<HTMLDivElement>(null)
    const { ref, width } = useComponentWidth();
    const [isOverflowHidden, setIsOverflowHidden] = useState(true);
    const [showMonth, setShowMonth] = useState(false)


    const controls = useAnimation();
    const endControls = useAnimation();

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start end', 'end start'],
    })

    const borderRadius = useTransform(scrollYProgress, [0, openingState, closingState, 1], [initialBorderRadius, '0px', '0px', initialBorderRadius])
    const margin = useTransform(scrollYProgress, [0, openingState, closingState, 1], [initialMargin, '0px', '0px', initialBorderRadius])

    const dayWidth = useTransform(scrollYProgress, [firstState, secondState], ["100%", '10%'])
    const yearWidth = useTransform(scrollYProgress, [firstState, secondState], ["0%", '90%'])

    const monthWidth = useTransform(scrollYProgress, [firstState, secondState], [width / 7, width / 12])
    const graphOpacity = useTransform(scrollYProgress, [firstState, secondState], [0.1, 1])
    const graphScale = useTransform(scrollYProgress, [firstState, secondState], [2, 1])

    const strokeWidth = useTransform(scrollYProgress, [firstState, secondState], [0.5, 1])
    const translate3d = useTransform(scrollYProgress, [firstState, secondState], [2.5, 15])

    const clipPath = useTransform(scrollYProgress, [firstState, thirdState], ['49%', '-1%'])
    const containerScale = useTransform(scrollYProgress, [thirdState, fifthState], [1, 2])
    const thirdStateOpacity = useTransform(scrollYProgress, [thirdState, thirdState + 0.02], [1, 0])

    const clipPathValue = useMotionTemplate`inset(0px ${clipPath} 0px 0px)`;
    const translateY = useMotionTemplate`translate3d(0px, calc(-100% + ${translate3d}vh), 0px)`;
    const thirdStateBorderColor = useMotionTemplate`rgba(219, 219, 219, ${thirdStateOpacity})`;

    // clip-path: inset(0px 49% 0px 0px); stroke-width: 0.5px; transform: translate3d(0px, calc(-100% + 2.5vh), 0px);
    // clip-path: inset(0px -1% 0px 0px); stroke-width: 1px; transform: translate3d(0px, calc(-100% + 15vh), 0px);

    useMotionValueEvent(scrollYProgress, "change", (v) => {
        if (v > firstState) {
            setShowMonth(true)
            controls.start({ opacity: 0, transition: { duration: 0.3 } });
        } else {
            setShowMonth(false)
            controls.start({ opacity: 1, transition: { duration: 0.3 } });
        }

        if (v > thirdState) {
            setIsOverflowHidden(false);    // remove overflow-hidden
        } else {
            setIsOverflowHidden(true);     // apply overflow-hidden
        }

        if (v > fourthState) {
            endControls.start({ opacity: 1 });
        } else {
            endControls.start({ opacity: 0 });
        }

        if (v >= 0.99) {
            setHeaderMode('dark');
        } else if (v > 0.22) {
            setHeaderMode('light');
        } else {
            setHeaderMode('dark');
        }
    });

    return <motion.div ref={containerRef} style={{
        paddingLeft: margin,
        paddingRight: margin,
    }} className="relative mb-64">
        <motion.div style={{ borderRadius }} className="sticky top-0 bg-white w-full h-screen flex items-center justify center">
            <div className="absolute inset-0 overflow-hidden">
                {/* Graph */}
                <div className="absolute inset-0 h-full w-full p-16">
                    <div className="relative w-full h-full">
                        <div className="absolute inset-0">
                            <div ref={ref} className={cn(isOverflowHidden ? "overflow-hidden" : "",
                                "absolute bottom-[7rem] left-[.5rem] flex h-[65%] w-[calc(100%-1rem)] flex-col gap-[1.3rem] lg:top-[6rem] lg:left-[6rem] lg:h-[calc(100%-12rem)] lg:w-[calc(100%-12rem)]")}>
                                <motion.div style={{ scale: containerScale, borderColor: thirdStateBorderColor }} className="h-full w-full border-[1px] overflow-hidden">
                                    <div className="relative flex h-[100%] w-[150%] lg:w-[100%] origin-[50%,80%] overflow-hidden">

                                        <motion.div className="absolute inset-0" style={{ opacity: graphOpacity, transformOrigin: 'left center', scale: graphScale }}>
                                            <motion.div style={{
                                                clipPath: clipPathValue,
                                                strokeWidth,
                                                transform: translateY,
                                            }} className="absolute top-[50%] left-0 h-[auto] w-[100%]" >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 1212 296" className="h-[100%] w-[100%]">
                                                    <path stroke="#0A0A0A" d="m.766 271.251 9.934-4.962a1.03 1.03 0 0 1 1.209.211l5.575 5.831a1.033 1.033 0 0 0 1.662-.234l5.453-10.404q.052-.1.126-.188l5.584-6.61c.304-.36.812-.468 1.237-.264l6.923 3.329q.073.036.15.059l4.959 1.494c.16.048.306.134.425.251l5.31 5.207c.495.486 1.32.354 1.64-.262l2.68-5.161a1.033 1.033 0 0 1 1.776-.098l4.164 6.238c.113.17.174.37.174.574v11.464c0 .268.103.525.29.718l7.348 7.621q.072.075.128.163l5.056 7.955c.413.65 1.367.636 1.76-.025l4.14-6.954c.537-.902 1.92-.521 1.92.529v2.632c0 .571.464 1.034 1.034 1.034h10.405c.232 0 .457-.078.64-.221l9.155-7.202 7.86-4.858a1.034 1.034 0 0 1 1.577.879v6.24c0 1.13 1.552 1.44 1.987.398l7.079-16.969c.339-.813 1.551-.57 1.551.311 0 .592.616.982 1.151.729l10.055-4.757 11.487-5.633a1.034 1.034 0 0 1 1.489.928v3.671c0 .571.462 1.034 1.033 1.034h3.619c.401 0 .765.231.935.593l4.29 9.104c.17.362.534.593.934.593h7.11c.526 0 .953.426.953.952s.426.953.952.953h11.004c.275 0 .539-.11.733-.305l6.255-6.284c.194-.195.458-.304.733-.304h3.091c.375 0 .721-.204.903-.531l5.665-10.185a1.03 1.03 0 0 1 1.449-.375l5.623 3.499c.571.355 1.323.08 1.53-.56l3.728-11.543c.21-.652 1.174-.501 1.174.185 0 .442.46.733.86.543l8.241-3.922a1.034 1.034 0 0 1 1.374.48l10.71 22.007c.42.864 1.689.737 1.929-.193l3.781-14.623a1.033 1.033 0 0 1 1.73-.472l3.476 3.472c.328.327.833.396 1.237.17l8.499-4.776c.167-.094.304-.232.397-.399l8.757-15.744c.291-.523.964-.69 1.466-.364l8.843 5.741c.47.305 1.098.179 1.415-.283l3.841-5.611c.193-.282.512-.45.853-.45h7.859c.57 0 1.033-.463 1.033-1.033v-2.103c0-.759.792-1.259 1.478-.933l7.655 3.644c.5.237 1.098.039 1.357-.45l5.435-10.26 7.361-11.198c.191-.291.516-.466.864-.466h6.502c.375 0 .721-.204.903-.531l7.077-12.724c.182-.328.528-.531.903-.531h7.206c.571 0 1.034-.463 1.034-1.033v-6.417c0-.571.462-1.033 1.033-1.033h9.104c.304 0 .592-.134.789-.366l8.818-10.404c.196-.231.484-.365.788-.365h6.507c.413 0 .787-.246.95-.627l5.062-11.831a1.034 1.034 0 0 1 1.641-.363l2.761 2.482c.189.171.436.265.691.265h5.967c.083 0 .153.007.234.027 1.426.349 16.404 4.018 20.187 5.167a1 1 0 0 1 .546.412l7.468 11.361"></path><path stroke="#0A0A0A" d="m404.136 188.014 9.934-4.962a1.03 1.03 0 0 1 1.209.211l5.575 5.832a1.033 1.033 0 0 0 1.662-.235l5.453-10.404a1 1 0 0 1 .126-.187l5.584-6.611c.304-.36.813-.468 1.237-.264l6.923 3.33q.073.034.15.058l4.959 1.494c.16.048.306.134.426.251l5.308 5.207a1.034 1.034 0 0 0 1.641-.262l2.68-5.161a1.033 1.033 0 0 1 1.776-.098l4.164 6.238c.113.17.174.37.174.574v11.465c0 .267.103.524.289.717l7.349 7.621q.072.076.128.163l5.056 7.955c.414.65 1.367.636 1.761-.025l4.139-6.954c.537-.902 1.921-.521 1.921.529v2.633c0 .57.463 1.033 1.033 1.033h10.405c.232 0 .457-.078.639-.221l9.156-7.202 7.86-4.858a1.034 1.034 0 0 1 1.577.879V203c0 1.13 1.552 1.441 1.987.398l7.079-16.968c.339-.814 1.551-.571 1.551.31 0 .592.616.982 1.151.729l10.055-4.757 11.487-5.633a1.034 1.034 0 0 1 1.489.928v3.671c0 .571.463 1.034 1.033 1.034h3.62c.4 0 .764.231.934.593l4.29 9.104c.17.362.534.593.935.593h7.109c.526 0 .953.427.953.953 0 .525.426.952.952.952h11.004c.275 0 .539-.11.733-.305l6.255-6.284c.194-.195.458-.304.733-.304h3.091c.375 0 .721-.203.903-.531l5.665-10.185a1.034 1.034 0 0 1 1.449-.375l5.623 3.499c.571.355 1.323.08 1.53-.56l3.728-11.543c.211-.652 1.174-.501 1.174.185 0 .442.461.733.86.543l8.241-3.922a1.034 1.034 0 0 1 1.374.481l10.71 22.006c.42.864 1.689.737 1.93-.193l3.78-14.622a1.034 1.034 0 0 1 1.731-.473l3.475 3.472c.328.327.833.397 1.237.17l8.499-4.776c.167-.093.304-.231.397-.398l8.757-15.745c.291-.523.964-.69 1.466-.364l8.843 5.741c.47.305 1.099.18 1.415-.283l3.841-5.611c.193-.282.512-.45.853-.45h7.859c.571 0 1.033-.463 1.033-1.033v-2.102c0-.76.792-1.26 1.478-.934l7.655 3.644c.5.238 1.098.039 1.357-.45l5.435-10.259 7.361-11.199c.192-.291.516-.466.864-.466h6.502c.375 0 .721-.203.903-.531l7.077-12.724c.183-.327.528-.531.903-.531h7.206c.571 0 1.034-.462 1.034-1.033v-6.417c0-.57.462-1.033 1.033-1.033h9.105c.303 0 .592-.134.788-.365l8.818-10.404c.196-.232.484-.366.788-.366h6.507c.414 0 .787-.246.95-.626l5.062-11.832a1.034 1.034 0 0 1 1.641-.362l2.761 2.481c.19.171.436.265.691.265h5.967c.083 0 .153.007.234.027 1.426.349 16.404 4.019 20.187 5.167.225.068.417.216.546.412l7.468 11.361M807.571 104.777l9.935-4.962a1.03 1.03 0 0 1 1.209.211l5.574 5.831a1.034 1.034 0 0 0 1.663-.234l5.452-10.404q.053-.1.126-.188l5.584-6.61c.304-.36.813-.469 1.238-.264l6.923 3.33a1 1 0 0 0 .15.058l4.959 1.493c.16.049.306.135.425.252l5.309 5.206a1.034 1.034 0 0 0 1.641-.261l2.679-5.161a1.034 1.034 0 0 1 1.777-.098l4.163 6.238c.114.17.174.37.174.574v11.464c0 .268.104.525.29.718l7.349 7.621q.072.075.128.163l5.056 7.955c.413.65 1.366.636 1.76-.026l4.139-6.953c.537-.902 1.922-.521 1.922.529v2.632c0 .571.462 1.034 1.033 1.034h10.405c.232 0 .457-.078.639-.221l9.156-7.202 7.86-4.858a1.034 1.034 0 0 1 1.577.879v6.24c0 1.129 1.552 1.44 1.987.398l7.078-16.969c.34-.813 1.551-.571 1.551.311 0 .592.617.982 1.152.729l10.055-4.757 11.487-5.633a1.033 1.033 0 0 1 1.488.928v3.671c0 .57.463 1.034 1.034 1.034h3.619c.4 0 .764.23.935.592l4.289 9.105c.171.362.535.593.935.593h7.11c.526 0 .952.426.952.952s.427.952.952.952h11.005c.275 0 .538-.109.732-.304l6.256-6.284c.194-.195.457-.304.732-.304h3.092c.375 0 .721-.204.903-.531l5.66-10.185c.29-.517.95-.688 1.45-.376l5.63 3.5c.57.355 1.32.08 1.53-.56l3.72-11.543c.22-.652 1.18-.5 1.18.185 0 .442.46.733.86.543l8.24-3.923c.51-.243 1.13-.029 1.37.481l10.71 22.007c.42.864 1.69.737 1.93-.194l3.78-14.622c.2-.773 1.17-1.037 1.73-.472l3.48 3.472c.33.327.83.396 1.24.17l8.5-4.776c.16-.094.3-.232.39-.399l8.76-15.744c.29-.523.96-.69 1.47-.365l8.84 5.742c.47.305 1.1.18 1.41-.284l3.84-5.61c.2-.282.52-.45.86-.45h7.86c.57 0 1.03-.463 1.03-1.034v-2.102c0-.76.79-1.26 1.48-.933l7.65 3.643c.5.238 1.1.04 1.36-.449l5.43-10.26 7.37-11.199c.19-.29.51-.465.86-.465h6.5c.38 0 .72-.204.91-.531l7.07-12.724c.18-.328.53-.531.9-.531h7.21c.57 0 1.03-.463 1.03-1.033v-6.417c0-.57.47-1.033 1.04-1.033h9.1c.31 0 .59-.134.79-.366l8.82-10.404c.19-.231.48-.365.79-.365h6.5c.42 0 .79-.247.95-.627l5.07-11.832c.27-.65 1.11-.835 1.64-.362l2.76 2.482c.19.17.43.265.69.265h5.97c.08 0 .15.007.23.027 1.43.349 16.4 4.018 20.19 5.167.22.068.41.215.54.412l7.47 11.36"></path>
                                                </svg>
                                            </motion.div>
                                        </motion.div>

                                        {months.map(month => <motion.div key={month.month} style={{ borderColor: thirdStateBorderColor, width: monthWidth }} className="flex shrink-0 items-end p-[1rem] border-r-[1px]">
                                            <motion.span style={{ opacity: thirdStateOpacity }} className="text-black/10 font-semibold text-xs">{showMonth ? month.month : month.hours}</motion.span>
                                        </motion.div>)}
                                    </div>
                                </motion.div>

                                <motion.div style={{ opacity: thirdStateOpacity }} className="flex">
                                    <motion.div className="flex flex-col gap-[.6rem]" style={{ width: dayWidth }}>
                                        <div className="h-1.5 w-[100%] rounded-full bg-black/10" />
                                        <p className="text-black opacity-10 font-semibold text-xs">A DAY</p>
                                    </motion.div>
                                    <motion.div className="flex" style={{ width: yearWidth }}>
                                        <div className="w-4" />
                                        <div className="flex flex-col gap-[.6rem] w-full">
                                            <div className="h-1.5 w-[100%] rounded-full bg-black" />
                                            <p className="text-black font-semibold text-xs whitespace-nowrap">A YEAR</p>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            </div>
                        </div>

                        <div className="relative z-2 flex h-full w-full md:items-center md:justify-center">
                            <motion.h2 className="text-xl md:text-7xl text-black md:text-center" animate={controls}>
                                <div>Markets move daily.</div>
                                <div>Your focus shouldn&apos;t.</div>
                            </motion.h2>
                            <div className="absolute bottom-[3.5rem] flex w-full flex-col items-center gap-[3.5rem] lg:w-[50%] lg:min-w-[51.8rem]">
                                <motion.div
                                    className="flex flex-col relative text-center text-black">
                                    <div className="flex flex-col mb-8 text-4xl">
                                        <motion.h3 animate={{ ...endControls, animationDelay: 0 }}>We filter out the noise,&nbsp;</motion.h3>
                                        <motion.h3 animate={{ ...endControls, animationDelay: 0.1 }}>so you don&apos;t have to.&nbsp;</motion.h3>
                                    </div>
                                    <motion.div
                                        animate={{ ...endControls, animationDelay: 0.2 }}
                                    >
                                        <Link href='/offerings'>
                                            <GradientBorderButton borderAnimation={false} mode={'light'}>Offerings</GradientBorderButton>
                                        </Link>
                                    </motion.div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Disclaimer */}
                <motion.div animate={controls} className="flex-center absolute right-0 bottom-[2.4rem] left-0 md:bottom-[4.5rem]">
                    <div className="text-[8px] text-[#364153] text-center opacity-[.3] leading-6">
                        For illustrative purposes only; not representative of actual clients.{" "}
                        <a className="underline underline-offset-[.2rem] font-semibold" href="https://web.archive.org/web/20251007172158mp_/https://titan.com" target="_blank" rel="noopener">
                            Growth is not guaranteed
                        </a>.
                    </div>
                </motion.div>
            </div>
        </motion.div>

        <div className="h-500" />
    </motion.div>
}