"use client";

import React from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import fashion from "../assets/hero/fashion.jpeg";
import hands from "../assets/hero/hands.jpeg";
import boy from "../assets/hero/boy.jpeg";

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

        <a
          href="/business/register"
          className="inline-flex items-center gap-2 px-6 py-3.5 md:px-7 md:py-4 rounded-full text-sm md:text-md font-bold transition-all hover:opacity-90"
          style={{ backgroundColor: "#9FE870", color: "#163300" }}
        >
          Get started for free
          <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5" />
        </a>
      </div>

      {/* Image row */}
      <div className="flex gap-2 w-full px-4 sm:px-6 md:px-16 lg:px-24 pb-10 md:pb-16">
        <div className="flex-1 rounded-2xl md:rounded-3xl overflow-hidden h-[240px] sm:h-[340px] md:h-[580px]">
          <Image src={fashion} alt="" width={900} height={600} className="w-full h-full object-cover object-center" />
        </div>
        <div className="hidden md:block flex-1 rounded-2xl overflow-hidden h-[580px]">
          <Image src={hands} alt="" width={900} height={600} className="w-full h-full object-cover object-center" />
        </div>
        <div className="hidden md:block flex-1 rounded-2xl overflow-hidden h-[580px]">
          <Image src={boy} alt="" width={900} height={600} className="w-full h-full object-cover object-center" />
        </div>
      </div>

    </section>
  );
};

export default BusinessHeroSection;
