"use client";

import React from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import instagram from "../assets/hero/Instagram.jpeg";
import hands from "../assets/hero/hands.jpeg";
import boy from "../assets/hero/boy.jpeg";

const HeroSection = () => {
  return (
    <section className="relative w-full min-h-screen overflow-hidden" style={{ backgroundColor: "#faf9f9" }}>

      {/* Text content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 md:px-16 lg:px-24 pt-28 sm:pt-32 md:pt-40 pb-8 md:pb-10">
        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-[96px] font-black text-black mb-5 md:mb-6" style={{ lineHeight: 0.99 }}>
          Bridge money. <br /> Anywhere. Instantly.<br /> At ultra low cost.
        </h1>

        <p className="text-sm md:text-lg font-normal mb-6 max-w-md leading-relaxed" style={{ color: "#163300" }}>
          Send, receive, and hold digital dollars. All in one app, built with regulated partners.
        </p>

        <a
          href="https://apps.apple.com/app/paybridge/id6749968512"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3.5 md:px-7 md:py-4 rounded-full text-sm md:text-md font-bold transition-all hover:opacity-90"
          style={{ backgroundColor: "#9FE870", color: "#163300" }}
        >
          Download the app
          <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5" />
        </a>
      </div>

      {/* Image row */}
      <div className="flex gap-2 w-full px-4 sm:px-6 md:px-16 lg:px-24 pb-10 md:pb-16">
        {/* On mobile: show only first image full width. On md+: show all 3 */}
        <div className="flex-1 rounded-2xl md:rounded-3xl overflow-hidden h-[240px] sm:h-[340px] md:h-[580px]">
          <Image src={instagram} alt="" width={900} height={600} className="w-full h-full object-cover object-center" />
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

export default HeroSection;
