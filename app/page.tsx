"use client";

import { ScrollControlProvider } from "@/components/scroll-control";
import Brief from "@/components/sections/brief";
import FAQ from "@/components/sections/faq";
import Footer from "@/components/sections/footer";
import HeroSection from "@/components/sections/hero-section";
import { IntroAnimation } from "@/components/sections/intro-animation";
import Partners from "@/components/sections/partners";
import TeamMembers from "@/components/sections/team-members";
import VideoIntroduction from "@/components/sections/video-introduction";
import WorkWithUs from "@/components/sections/work-with-us";
import { useState } from "react";

export default function Home() {
  const [introDone, setIntroDone] = useState(false);

  return (
    <ScrollControlProvider>
      {!introDone && <IntroAnimation onComplete={() => setIntroDone(true)} />}
      <main className="flex flex-col gap-[32px] row-start-2 mb-100">
        <HeroSection introDone={introDone} />
        <VideoIntroduction />
        <Brief />
        <WorkWithUs />
        <TeamMembers />
        {/* <SnapFillSection /> */}
        {/* <Blogs /> */}
        <Partners />
        <FAQ />
      </main>
      <Footer />
    </ScrollControlProvider>
  );
}
