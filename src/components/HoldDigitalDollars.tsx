"use client";

import React from "react";
import Image from "next/image";

const HoldDigitalDollars = () => {
  return (
    <section className="w-full min-h-screen relative z-20 bg-muted/30 -mt-96 pt-96 pb-96">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left side - Content */}
          <div className="space-y-6 lg:pt-12">
            <p className="text-sm font-medium text-primary uppercase tracking-wider">
              STABILITY, NOT VOLATILITY
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
              Hold your money in digital dollars
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed">
              Avoid currency fluctuations and protect the value of your money by storing it in digital dollars.
            </p>
          </div>

          {/* Right side - Visual */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-[400px] aspect-[9/19] bg-gradient-to-br from-orange-100 to-orange-50 rounded-3xl flex items-center justify-center">
              <div className="text-center space-y-2 p-8">
                <p className="text-sm text-muted-foreground font-normal">Balance View</p>
                <p className="text-xs text-muted-foreground/60">Replace with app screenshot</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HoldDigitalDollars;
