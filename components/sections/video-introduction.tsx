"use client";

import { useEffect, useRef } from "react";
import Video from "next-video";
import introduction from "@/videos/introduction.mp4";
import { useInView } from "framer-motion";

const VideoIntroduction = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.5 });

  useEffect(() => {
    if (!containerRef.current) return;

    // Small delay to ensure video element is rendered
    const timeoutId = setTimeout(() => {
      // Find the video element within the container (next-video wraps it)
      const videoElement = containerRef.current?.querySelector(
        "video"
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
      } else if (!isInView && videoElement) {
        // Pause when scrolled out of view to save resources
        videoElement.pause();
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [isInView]);

  return (
    <div ref={containerRef} className="my-24 md:my-48 section-container">
      <Video
        src={introduction}
        controls={true}
        playsInline
        muted={false}
        autoPlay={true}
      />
    </div>
  );
};

export default VideoIntroduction;
