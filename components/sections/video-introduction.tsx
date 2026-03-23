"use client";

import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import MuxPlayer from "@mux/mux-player-react";
import { useLanguage } from "@/lib/language-context";

const VideoIntroduction = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.5 });

  const { language } = useLanguage();

  useEffect(() => {
    if (!containerRef.current) return;

    // Small delay to ensure video element is rendered
    const timeoutId = setTimeout(() => {
      // Find the video element within the container (next-video wraps it)
      const videoElement = containerRef.current?.querySelector(
        "video",
      ) as HTMLVideoElement | null;

      if (isInView && videoElement) {
        // Try to play the video when it comes into view
        const playPromise = videoElement.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            // Auto-play was prevented (common in browsers with unmuted videos), handle gracefully
            console.log("Video autoplay prevented:", error);
          });
        }
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [isInView]);

  return (
    <div ref={containerRef} className="my-24 md:my-36 section-container">
      <MuxPlayer
        playbackId={
          language === "en"
            ? "nfwEnKHGBrlu8GGB7UG2aIm00IJg100f5ilN01wq00UAc700"
            : "GP3iAIzk2ZPmTNzdKd01u8GFVonyd3aMdDkqf4N82QTk"
        }
        metadataVideoTitle="Tenger Capital"
        className="w-full aspect-32/15 custom-player"
        secondaryColor="#000000"
        primaryColor="#ffffff"
        autoPlay={true}
        muted={true}
      />
    </div>
  );
};

export default VideoIntroduction;
