"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { useIsMobile } from "@/hooks/use-is-mobile";

export const EASE_CUSTOM = [0.76, 0, 0.24, 1] as const;
export const ENTER_DURATION = 0.25;
export const EXIT_DURATION = 0.2;

const Navigation = () => {
  const isMobile = useIsMobile();
  const navRef = useRef<HTMLDivElement>(null);

  const initial = {
    display: "hidden",
    background: "transparent",
    padding: "0px",
    opacity: 0,
  };

  const height = {
    initial,
    enter: {
      display: "block",
      background: "black",
      opacity: 1,
      padding: isMobile ? "0px" : "16px",
      transition: {
        duration: ENTER_DURATION,
        ease: EASE_CUSTOM,
      },
    },
    exit: {
      ...initial,
      transition: {
        duration: EXIT_DURATION,
        ease: EASE_CUSTOM,
      },
    },
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      // ✦ Start everything at once
      tl.fromTo(
        ".nav-line",
        { scaleX: 0, transformOrigin: "center" },
        { scaleX: 1, duration: 0.45, ease: "power3.out" },
        0 // start immediately
      );

      // ✦ Left side sections (Offerings, About, Blog)
      tl.fromTo(
        ".nav-section",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.08,
          ease: "power2.out",
        },
        0 // simultaneous with line
      );

      // ✦ Smooth image reveal (fade + slight scale)
      tl.fromTo(
        ".nav-section img",
        { scale: 1.15, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.9, ease: "power3.out" },
        0 // same start
      );

      // ✦ Texts inside each nav-section
      tl.fromTo(
        ".nav-section h2, .nav-section .type-btn",
        { y: 15, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.35,
          stagger: 0.05,
          ease: "power2.out",
        },
        0.15 // slight delay so text follows image nicely
      );

      // ✦ Right-side links (bottom → up)
      tl.fromTo(
        ".nav-links li",
        { y: 25, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.45,
          stagger: 0.05,
          ease: "power2.out",
        },
        0 // simultaneous start
      );
    }, navRef);

    return () => ctx.revert();
  }, []);

  return (
    <motion.div
      ref={navRef}
      variants={height}
      initial="initial"
      animate="enter"
      exit="exit"
      className="overflow-hidden top-0 left-0 fixed z-40 h-screen w-screen"
    >
      {/* Your actual navigation content */}
      <div className="bg-white h-full p-6 md:p-12 pt-18 md:pt-20 flex flex-col md:rounded-3xl">
        <div className="nav-line w-[100%] h-[1px] bg-[#0000001a] scale-x-0" />

        <div className="mt-8 grid h-full w-full md:grid-cols-[77%_calc(23%-3rem)] md:grid-rows-[repeat(2,1fr)] gap-4 md:gap-8 max-md:flex max-md:flex-col">
          {/* Main Left Section */}

          {/* Offerings */}
          <a
            href="/offerings"
            className="nav-section group min-h-32 relative flex w-full flex-col justify-between overflow-hidden rounded-3xl p-6 md:p-8 text-white md:flex-col"
          >
            <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105">
              <Image
                src="/navigation/offerings.jpg"
                alt="Offerings"
                fill
                className="object-cover"
              />
            </div>
            <h2 className="relative text-2xl leading-[120%] z-10">Offerings</h2>
            <div className="type-btn relative z-10 flex items-center gap-[.7rem] text-[10px]">
              DISCOVER NOW
              <span className="opacity-30 transition-opacity duration-300 ease-out group-hover:opacity-100">
                →
              </span>
            </div>
          </a>

          {/* About + Blog */}
          <div className="relative flex gap-4 md:gap-8 max-md:flex-col">
            <a
              href="/about"
              className="nav-section group min-h-32 relative flex w-full md:w-1/2 flex-col justify-between overflow-hidden rounded-3xl p-6 md:p-8 text-white"
            >
              <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105">
                <Image
                  src="/navigation/about-us.jpg"
                  alt="About"
                  fill
                  className="object-cover"
                />
              </div>
              <h2 className="relative text-2xl leading-[120%] z-10">
                About us
              </h2>
              <div className="type-btn relative z-10 flex items-center gap-[.7rem] text-[10px]">
                DISCOVER NOW
                <span className="opacity-30 transition-opacity duration-300 ease-out group-hover:opacity-100">
                  →
                </span>
              </div>
            </a>

            <a
              // href="/blog"
              className="nav-section group min-h-32 relative flex w-full md:w-1/2 flex-col justify-between overflow-hidden rounded-3xl p-6 md:p-8 text-white"
            >
              <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105">
                <Image
                  src="/navigation/blogs.avif"
                  alt="Blog"
                  fill
                  className="object-cover"
                />
              </div>
              <h2 className="relative text-2xl leading-[120%] z-10">Blog</h2>
              <div className="type-btn relative z-10 flex items-center gap-[.7rem] text-[10px]">
                COMING SOON
                <span className="opacity-30 transition-opacity duration-300 ease-out group-hover:opacity-100">
                  →
                </span>
              </div>
            </a>
          </div>

          {/* Right column — Learn More */}
          <div
            className="relative flex flex-col justify-between text-black bg-white rounded-3xl"
            style={{ gridArea: "1 / 2 / 3 / 3" }}
          >
            <ul className="flex flex-col nav-links">
              <span className="type-xs mb-4 text-black/40 text-[10px] uppercase tracking-wide">
                Learn More
              </span>
              <li>
                <Link
                  className="relative w-fit text-xs inline-block pb-[.1rem] after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full"
                  target="_self"
                  href="/about"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  className="relative w-fit text-xs inline-block pb-[.1rem] after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full"
                  target="_self"
                  href="/offerings"
                >
                  What We Offer
                </Link>
              </li>
              {/* <li>
                <Link
                  className="relative w-fit text-xs inline-block pb-[.1rem] after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full"
                  target="_self"
                  href="/TG-testimonials"
                >
                  Client Testimonials
                </Link>
              </li>
              <li>
                <Link
                  className="relative w-fit text-xs inline-block pb-[.1rem] after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full"
                  target="_self"
                  href="/careers"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  className="relative w-fit text-xs inline-block pb-[.1rem] after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full"
                  target="_self"
                  href="/blog"
                >
                  Blog
                </Link>
              </li> */}
            </ul>
            <p className="text-sm text-black/80 font-semibold ml-4 flex items-center">
              ✧ <span className="text-xs"> Powered by Esugsoft LLC</span>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Navigation;
