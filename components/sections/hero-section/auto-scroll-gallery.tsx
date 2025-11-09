"use client";

import Image from "next/image";

const images1 = [
  "/mockups/1.avif",
  "/mockups/2.avif",
  "/mockups/3.avif",
  "/mockups/4.avif",
];
// const images2 = ["/mockups/5.avif", "/mockups/6.avif", "/mockups/7.avif"];

export default function AutoScrollGallery() {
  return (
    <div className="w-full md:w-[45%] aspect-[279/333] md:aspect-[500/630] rounded-3xl overflow-hidden relative">
      <Image src={images1[3]} alt="hero" fill />
    </div>
  );
}
