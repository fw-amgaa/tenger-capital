"use client";

import { ScrollControlProvider } from "@/components/scroll-control";
import Brief from "@/components/sections/brief";
import FAQ from "@/components/sections/faq";
import Footer from "@/components/sections/footer";
import Header from "@/components/sections/header";
import HeroSection from "@/components/sections/hero-section";
import { IntroAnimation } from "@/components/sections/intro-animation";
import Offerings from "@/components/sections/offerings";
import VideoIntroduction from "@/components/sections/video-introduction";
import WorkWithUs from "@/components/sections/work-with-us";
import { useState } from "react";

export default function Home() {
  const [introDone, setIntroDone] = useState(true);
  const [headerMode, setHeaderMode] = useState<"light" | "dark">("dark");

  return (
    <ScrollControlProvider>
      <Header headerMode={headerMode} />
      {!introDone && <IntroAnimation onComplete={() => setIntroDone(true)} />}
      <main className="flex flex-col gap-[32px] row-start-2 mb-100">
        <HeroSection introDone={introDone} />
        <VideoIntroduction />
        <Brief />
        <WorkWithUs />
        <div className="h-100" />
        {/* <TeamMembers /> */}
        <Offerings setHeaderMode={setHeaderMode} />
        {/* <Blogs /> */}
        {/* <Partners /> */}
        <FAQ />
      </main>
      <Footer />
      {/* <FloatingDashboard deposits={[{
        amount: '4,000.00',
        id: "1",
        timeAgo: '7 days ago'
      }, {
        amount: '20,000.00',
        id: "2",
        timeAgo: '22 hours ago'
      }]} /> */}
    </ScrollControlProvider>
  );
}
