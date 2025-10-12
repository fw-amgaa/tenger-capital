"use client";

import Image from "next/image";
import { ReactNode } from "react";

const images1 = [
  "/mockups/1.avif",
  "/mockups/2.avif",
  "/mockups/3.avif",
  "/mockups/4.avif",
];
const images2 = ["/mockups/5.avif", "/mockups/6.avif", "/mockups/7.avif"];

export default function AutoScrollGallery() {
  return (
    <div className="relative flex gap-4 overflow-hidden min-w-[320px] max-h-screen rounded-xl">
      {/* fade overlays */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background via-background/90 to-transparent z-10" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background via-background/90 to-transparent z-10" />

      <div className="relative overflow-hidden">
        <div className="flex flex-col gap-4 animate-scroll-up">
          {/* original content */}
          {images1.map((item, index) => (
            <ImageWrapper key={index}>
              <Image src={item} alt="" fill className="h-auto object-cover" />
            </ImageWrapper>
          ))}
          {/* duplicate content */}
          {images1.map((item, index) => (
            <ImageWrapper key={`dup-${index}`}>
              <Image src={item} alt="" fill className="h-auto object-cover" />
            </ImageWrapper>
          ))}
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div className="flex flex-col gap-4 animate-scroll-down">
          {/* original content */}
          {images2.map((item, index) => (
            <ImageWrapper key={`2-${index}`}>
              <Image src={item} alt="" fill className="h-auto object-cover" />
            </ImageWrapper>
          ))}
          {/* duplicate content */}
          {images2.map((item, index) => (
            <ImageWrapper key={`dup2-${index}`}>
              <Image src={item} alt="" fill className="h-auto object-cover" />
            </ImageWrapper>
          ))}
        </div>
      </div>
    </div>
  );
}

const ImageWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <div className="overflow-hidden rounded-xl w-[170px] h-[170px] lg:w-[250px] lg:h-[250px] relative">
      {children}
    </div>
  );
};
