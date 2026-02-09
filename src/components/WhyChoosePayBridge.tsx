"use client";

import React from "react";
import { Shield, Zap, TrendingDown, ArrowUpRight } from "lucide-react";

const WhyChoosePayBridge = () => {
  const features = [
    {
      icon: TrendingDown,
      title: "Save More on Every Transfer",
      description: "Reduce wire fees, avoid bad FX rates, and keep more money in your business.",
      stat: "Up to 80% cheaper",
    },
    {
      icon: Zap,
      title: "Get Paid and Pay Faster",
      description: "Most payments settle within minutes. Your business needs speed, and we match your pace.",
      stat: "Settle in minutes",
    },
    {
      icon: Shield,
      title: "Built for Compliance & Security",
      description: "Operate with confidence. We follow industry-leading security protocols so your money stays safe and compliant.",
      stat: "Bank-level security",
    },
    {
      icon: ArrowUpRight,
      title: "Designed to Scale With You",
      description: "From your first supplier to your 500th, PayBridge grows with your business.",
      stat: "No limits",
    },
  ];

  return (
    <section className="w-full py-20 md:py-28 lg:py-32 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Why Choose <span style={{ color: '#9FE870' }}>PayBridge</span>
          </h2>
          <p className="text-xl md:text-1xl text-gray-600 max-w-3xl mx-auto">
            Built for modern businesses that need speed, savings, and reliability.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 md:p-10 rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all bg-white relative overflow-hidden"
            >
              {/* Background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

              <div className="relative z-10">
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-all group-hover:scale-110"
                  style={{ backgroundColor: '#9FE870' }}>
                  <feature.icon className="w-7 h-7" style={{ color: '#163300' }} />
                </div>

                {/* Stat badge */}
                <div className="inline-block px-4 py-2 rounded-full mb-4"
                  style={{ backgroundColor: 'rgba(159, 232, 112, 0.1)' }}>
                  <span className="text-sm font-semibold" style={{ color: '#163300' }}>
                    {feature.stat}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChoosePayBridge;
