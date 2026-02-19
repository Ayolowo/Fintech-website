"use client";

import React from "react";
import Link from "next/link";
import BusinessCalculator from "./BusinessCalculator";

const BusinessHero = () => {
  return (
    <section className="relative w-full min-h-[90vh] flex items-center py-10 md:py-15 lg:py-18 px-4 md:px-8 overflow-hidden bg-gradient-to-b from-white to-gray-50">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-30"></div>

      <div className="relative z-10 w-full max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 xl:gap-20">
          {/* Left side - Text content */}
          <div className="w-full lg:w-[60%] space-y-8 text-center lg:text-left flex flex-col items-center lg:items-start">
            <div className="space-y-6">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-black">
                Send & Receive Money Globally{" "}
                <span className="italic font-normal">
                  Fast, Secure, and Affordable!
                </span>
              </h1>

              <p className="text-xl md:text-1xl text-black font-normal">
                Built for business owners, professionals, and freelancers.
              </p>
            </div>

            {/* Contact section */}
            <div className="space-y-2">
              <p className="text-base font-normal text-black">Any questions?</p>
              <a
                href="mailto:support@paybridgefinance.com"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-full font-semibold hover:bg-green-900"
                style={{ backgroundColor: "#9FE870", color: "#163300" }}
              >
                Contact us
              </a>
            </div>
          </div>

          {/* Right side - Calculator */}
          <div className="w-full lg:w-[45%] flex justify-center lg:justify-end">
            <BusinessCalculator />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessHero;
