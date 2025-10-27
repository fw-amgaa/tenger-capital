"use client";

import Blogs from "@/components/sections/blogs";
import Brief from "@/components/sections/brief";
import FAQ from "@/components/sections/faq";
import Footer from "@/components/sections/footer";
import HeroSection from "@/components/sections/hero-section";
import { IntroAnimation } from "@/components/sections/intro-animation";
import Partners from "@/components/sections/partners";
import TeamMembers from "@/components/sections/team-members";
import VideoIntroduction from "@/components/sections/video-introduction";
import { useEffect, useState } from "react";
import Lenis from "lenis";

export default function Home() {
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    const lenis = new Lenis();

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }, []);

  return (
    <>
      {!introDone && <IntroAnimation onComplete={() => setIntroDone(true)} />}
      <main className="flex flex-col gap-[32px] row-start-2 px-4 md:px-8 lg:px-12 xl:px-24 mb-100">
        <HeroSection introDone={introDone} />

        <VideoIntroduction />

        <Brief />

        <TeamMembers />

        <Partners />

        <Blogs />

        <FAQ />
      </main>
      <Footer />
    </>
  );
}
