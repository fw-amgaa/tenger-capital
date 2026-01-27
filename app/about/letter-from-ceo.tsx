"use client";

import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

export default function LetterFromCeo() {
  const ref = useRef(null);
  const isInView = useInView(ref);

  return (
    <div
      ref={ref}
      style={{
        backgroundImage: 'url("/about-us/bg-pattern.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className="section-container px-8 md:px-16"
    >
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: isInView ? 1 : 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="md:mt-0 md:h-screen relative flex flex-wrap items-center justify-center md:justify-between md:px-16 lg:px-32 xl:px-48 space-y-8 md:gap-8"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 40 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="z-10 md:w-[370px] text-center md:text-left"
        >
          <h1 className="text-4xl md:text-5xl tracking-tight text-primary mb-4 mt-6">
            Letter from CEO
          </h1>
          <p className="text-sm font-light italic text-muted-foreground max-w-xl mx-auto mb-8">
            “As CEO, I founded this company with a simple belief: everyone
            deserves access to clear, reliable guidance when it comes to
            building their wealth. Too many people feel overwhelmed by financial
            decisions, and our mission is to change that. We combine proven
            strategies with a modern, client-first approach so you can move
            forward with confidence and clarity.”
          </p>
        </motion.div>

        <div className="w-full md:w-[45%] aspect-[279/333] md:aspect-[500/630] rounded-3xl overflow-hidden relative">
          <Image
            objectFit="cover"
            src={"/team-members/all-bw part1-3.jpg"}
            alt="hero"
            fill
          />
        </div>
      </motion.main>
    </div>
  );
}
