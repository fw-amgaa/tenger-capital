"use client";

import Image from "next/image";

export default function AutoScrollGallery() {
  return (
    <div className="w-full md:w-[45%] aspect-[279/333] md:aspect-[500/630] rounded-3xl overflow-hidden relative">
      <Image src={"/home/main.jpg"} alt="hero" fill objectFit="cover" />
    </div>
  );
}
