"use client";

import { useEffect, useRef } from "react";
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
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [isInView]);

  return (
    <div ref={containerRef} className="my-24 md:my-36 section-container">
      <video
        preload={"auto"}
        src={
          "https://player.mux.com/00bQIyb6S8VXZ4L6XvMAduJOFjFN3gQH02StoVIzaMa3w"
        }
        controls={true}
        playsInline={true}
        muted
        autoPlay={true}
      />
    </div>
  );
};

export default VideoIntroduction;
