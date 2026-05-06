"use client";

import React from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import instagram from "../assets/hero/instagram.jpeg";
import hands from "../assets/hero/hands.jpeg";
import boy from "../assets/hero/boy.jpeg";

const HeroSection = () => {
  return (
    <section className="relative w-full min-h-screen overflow-hidden" style={{ backgroundColor: "#faf9f9" }}>

      {/* Text content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 md:px-16 lg:px-24 pt-40 pb-10">
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[96px] font-black text-black mb-6" style={{lineHeight: 0.99}}>
          Bridge money. <br /> Anywhere. Instantly.<br /> At ultra low cost.
        </h1>

        <p className="text-md md:text-lg font-normal mb-6 max-w-md leading-relaxed" style={{color: "#163300"}}>
          Send, receive, and hold digital dollars. All in one app, built with regulated partners.
        </p>

        <a
          href="https://apps.apple.com/app/paybridge/id6749968512"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-7 py-4 rounded-full text-md font-bold transition-all hover:opacity-90"
          style={{ backgroundColor: "#9FE870", color: "#163300" }}
        >
          Download the app
          <ArrowUpRight className="w-5 h-5" />
        </a>
      </div>

      {/* Image row — full width, outside any max-width container */}
      <div className="flex gap-2 w-full h-[580px] px-6 md:px-16 lg:px-24 pb-16">
        <div className="flex-1 rounded-3xl overflow-hidden">
          <Image src={instagram} alt="" width={900} height={600} className="w-full h-full object-cover object-center" />
        </div>
        <div className="flex-1 rounded-2xl overflow-hidden">
          <Image src={hands} alt="" width={900} height={600} className="w-full h-full object-cover object-center" />
        </div>
        
        
        <div className="flex-1 rounded-2xl overflow-hidden">
          <Image src={boy} alt="" width={900} height={600} className="w-full h-full object-cover object-center" />
        </div>
      </div>

    </section>
  );
};

export default HeroSection;
