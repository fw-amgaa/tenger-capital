"use client";

import { ScrollControlProvider } from "@/components/scroll-control";
import Blogs from "@/components/sections/blogs";
import Brief from "@/components/sections/brief";
import FAQ from "@/components/sections/faq";
import FloatingDashboard from "@/components/sections/floating-dashboard";
import Footer from "@/components/sections/footer";
import Header from "@/components/sections/header";
import HeroSection from "@/components/sections/hero-section";
import { IntroAnimation } from "@/components/sections/intro-animation";
import Offerings from "@/components/sections/offerings";
import Partners from "@/components/sections/partners";
import TeamMembers from "@/components/sections/team-members";
import VideoIntroduction from "@/components/sections/video-introduction";
import WorkWithUs from "@/components/sections/work-with-us";
import { useState } from "react";

export default function Home() {
  const [introDone, setIntroDone] = useState(false);
  const [headerMode, setHeaderMode] = useState<"light" | "dark">("dark");

  return (
    <ScrollControlProvider>
      <Header headerMode={headerMode} />
      {!introDone && <IntroAnimation onComplete={() => setIntroDone(true)} />}
      <main className="flex flex-col gap-[32px] row-start-2 mb-48">
        <HeroSection introDone={introDone} />
        <VideoIntroduction />
        <Brief />
        <WorkWithUs />
        <TeamMembers />
        <Offerings setHeaderMode={setHeaderMode} />
        <Blogs />
        <Partners />
        <FAQ />
      </main>
      <Footer />
      <FloatingDashboard
        deposits={[
          {
            amount: "4,000.00",
            id: "1",
            timeAgo: "7 days ago",
          },
          {
            amount: "20,000.00",
            id: "2",
            timeAgo: "22 hours ago",
          },
        ]}
      />
    </ScrollControlProvider>
  );
}
