"use client";

import React from "react";
import Image from "next/image";
import { Loader } from "lucide-react";
import iPhoneFront from "../assets/home-front.png";
import AppStoreButtons from "./AppStoreButtons";

const HeroSection = () => {
  return (
    <section className="relative w-full py-12 md:py-0 px-4 md:px-8 overflow-hidden">
      {/* Gradient glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full">
        <div className="w-full h-full opacity-10 bg-primary blur-[120px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-8xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center w-full">
          {/* Left side - Text content */}
          <div className="w-full lg:w-1/2 space-y-4">
            <div className="flex justify-start">
              <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium rounded-full bg-muted text-primary">
                <span className="flex h-2 w-2 rounded-full bg-primary"></span>
                Launching new payment features
                <Loader className="h-3 w-3 animate-spin text-primary" />
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[75px] font-bold">
              Bridge money. Anywhere. Instantly.
            </h1>

            <p className="text-base sm:text-lg md:text-xl font-normal text-muted-foreground max-w-xl">
              Send, receive, and hold digital dollars. <br/> All in one app, built with regulated partners.
            </p>

            <div className="pt-4">
              <AppStoreButtons />
            </div>
          </div>

          {/* Right side - Mobile app screenshot */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
            <div className="px-40 py-12 flex items-center justify-center" style={{ backgroundColor: 'rgba(8, 52, 0, 0.1)' }}>
              <Image
                src={iPhoneFront}
                alt="PayBridge Home Screen"
                width={300}
                height={600}
                className="w-full max-w-[350px] h-auto"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default HeroSection;
