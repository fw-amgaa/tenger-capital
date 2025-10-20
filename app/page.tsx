"use client";

import Blogs from "@/components/sections/blogs";
import Brief from "@/components/sections/brief";
import FAQ from "@/components/sections/faq";
import Footer from "@/components/sections/footer";
import HeroSection from "@/components/sections/hero-section";
import { IntroAnimation } from "@/components/sections/intro-animation";
import TeamMembers from "@/components/sections/team-members";
import VideoIntroduction from "@/components/sections/video-introduction";
import SmoothScroll from "@/components/smooth-scroll";
import { useState } from "react";

export default function Home() {
  const [introDone, setIntroDone] = useState(true);

  return (
    <div className="">
      {!introDone && <IntroAnimation onComplete={() => setIntroDone(true)} />}
      {/* <SmoothScroll> */}
      <>
        <main className="flex flex-col gap-[32px] row-start-2 px-4 md:px-8 lg:px-12 xl:px-24 mb-100">
          <HeroSection introDone={introDone} />

          <VideoIntroduction />

          <Brief />

          <TeamMembers />

          <Blogs />

          <FAQ />
        </main>
        <Footer />
      </>
      {/* </SmoothScroll> */}
    </div>
  );
}
