"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";

const videos = [
  "/videos/craft-working.mp4",
  "/videos/farmer-working.mp4",
  "/videos/man-calculating.mp4",
  "/videos/packing-boxes.mp4",
];

const BusinessHeroSection = () => {
  return (
    <section className="relative w-full min-h-screen overflow-hidden" style={{ backgroundColor: "#faf9f9" }}>

      {/* Text content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 md:px-16 lg:px-24 pt-28 sm:pt-32 md:pt-40 pb-8 md:pb-10">
        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-[96px] font-black text-black mb-5 md:mb-6" style={{ lineHeight: 0.99 }}>
          Pay teams.<br /> Pay suppliers.<br /> Move money cheap.
        </h1>

        <p className="text-sm md:text-lg font-normal mb-6 max-w-lg leading-relaxed" style={{ color: "#163300" }}>
          Global payments built for businesses. Send to 140+ countries, hold digital dollars, and settle faster than your bank.
        </p>

        <div className="flex items-center gap-6">
          <a
            href="/business/register"
            className="inline-flex items-center gap-2 px-6 py-3.5 md:px-7 md:py-4 rounded-full text-md md:text-md font-bold transition-all hover:opacity-90"
            style={{ backgroundColor: "#9FE870", color: "#163300" }}
          >
            Get started for free
            <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5" />
          </a>
          <a
            href="mailto:business@paybridgefinance.com"
            className="text-sm md:text-base font-medium underline underline-offset-4 transition-opacity hover:opacity-70"
            style={{ color: "#163300" }}
          >
            Contact sales
          </a>
        </div>
      </div>

      {/* Video row */}
      <div className="flex w-full pb-10 md:pb-16">
        {videos.map((src, i) => (
          <div
            key={i}
            className={`${i === 0 ? "flex-1" : "hidden md:block flex-1"} overflow-hidden h-[240px] sm:h-[340px] md:h-[580px]`}
          >
            <video
              src={src}
              autoPlay
              muted
              loop
              playsInline
              preload={i === 0 ? "auto" : "none"}
              className="w-full h-full object-cover object-center"
            />
          </div>
        ))}
      </div>

    </section>
  );
};

export default BusinessHeroSection;
