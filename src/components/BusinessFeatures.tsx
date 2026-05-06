"use client";

import React from "react";
import Image from "next/image";
import fashion from "../assets/hero/fashion.jpeg";

const features = [
  {
    title: "Send payments to suppliers in 140+ countries",
    description: "Pay vendors, manufacturers, and partners globally — at rates your bank can't match.",
  },
  {
    title: "Pay your team wherever they are in the world",
    description: "Run payroll across borders without the delays, fees, or paperwork.",
  },
  {
    title: "Hold and convert digital dollars instantly",
    description: "Keep funds in USD and convert to local currencies the moment you need to.",
  },
];

const BusinessFeatures = () => {
  return (
    <section className="w-full py-20" style={{ backgroundColor: "#faf9f9" }}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">

        {/* Header */}
        <div className="mb-14 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-black mb-4" style={{ lineHeight: 1.05 }}>
            Take your business further, faster
          </h2>
          <p className="text-base md:text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: "#163300" }}>
            Send funds. Scale operations. Stay ahead. PayBridge moves money where your business needs it — across borders, in real time.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-start">

          {/* Left — image card with stats */}
          <div className="w-full md:w-[420px] shrink-0 relative rounded-3xl overflow-hidden" style={{ height: 480 }}>
            <Image
              src={fashion}
              alt="Business payments"
              fill
              className="object-cover object-center"
            />
            {/* Stats overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 flex gap-8"
              style={{ background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%)" }}>
              <div>
                <p className="text-white text-3xl font-black">140+</p>
                <p className="text-white/80 text-sm font-medium">countries</p>
              </div>
              <div>
                <p className="text-white text-3xl font-black">24/7</p>
                <p className="text-white/80 text-sm font-medium">real-time settlement</p>
              </div>
            </div>
          </div>

          {/* Right — feature list */}
          <div className="flex flex-col justify-center gap-0 flex-1">
            {features.map((feature, i) => (
              <div key={i} className="py-8 border-b border-black/10 first:border-t first:border-black/10">
                <h3 className="text-xl md:text-2xl font-bold text-black mb-2">
                  {feature.title}
                </h3>
                <p className="text-base leading-relaxed" style={{ color: "#4a5568" }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default BusinessFeatures;
