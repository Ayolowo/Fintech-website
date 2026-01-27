"use client";

import React from 'react';
import { ArrowRight, Globe, Wallet, Zap, Building2, Shield, Banknote } from "lucide-react";

const Features = () => {
  const mainFeatures = [
    {
      title: "Local Currency Experience",
      description: "Work entirely in your home currency — we handle the blockchain complexity.",
      details: "Fund with CAD, NGN, USD, or other local currencies. See balances in familiar terms. All blockchain conversions happen automatically.",
      icon: <Wallet className="w-8 h-8" />
    }
  ];

  const secondaryFeatures = [
    {
      title: "Zero Gas Fees",
      description: "No network fees, no gas costs. Pay almost nothing to move money globally.",
      icon: <Banknote className="w-6 h-6" />
    },
    {
      title: "No Banking Required",
      description: "Direct peer-to-peer transfers that bypass traditional banking infrastructure.",
      icon: <Globe className="w-6 h-6" />
    },
    {
      title: "Enterprise Security",
      description: "Bank-grade security with the transparency and speed of blockchain technology.",
      icon: <Shield className="w-6 h-6" />
    }
  ];

  return (
    <section id="features" className="w-full py-16 md:py-24 px-4 md:px-8 bg-background">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-4 flex flex-col items-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight">
            Designed to be simple. Powered by Solana.
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground font-light max-w-[90%]">
            Your money app should feel as smooth as your favorite mobile wallet — with global reach under the hood.
          </p>
        </div>

        {/* Main Features - Side by Side Layout */}
        <div className="space-y-12">
          {mainFeatures.map((feature, index) => (
            <div
              key={index}
              className={`grid md:grid-cols-2 gap-8 md:gap-12 items-center ${
                index % 2 === 1 ? 'md:flex-row-reverse' : ''
              }`}
            >
              {/* Content */}
              <div className={`space-y-6 ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                <div className="inline-flex p-3 rounded-2xl bg-muted">
                  {feature.icon}
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl md:text-3xl font-normal tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-lg text-muted-foreground font-light">
                    {feature.description}
                  </p>
                  <p className="text-base text-muted-foreground/80 font-light leading-relaxed">
                    {feature.details}
                  </p>
                </div>
                <button className="inline-flex items-center gap-2 text-foreground font-normal">
                  Learn more
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Visual Element */}
              <div className={`relative ${index % 2 === 1 ? 'md:order-1' : ''}`}>
                <div className="bg-card border border-border rounded-3xl p-8 md:p-12">
                  <div className="w-full aspect-square rounded-2xl bg-muted flex items-center justify-center">
                    {React.cloneElement(feature.icon, { className: "w-24 h-24 md:w-32 md:h-32 text-muted-foreground" })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Secondary Features Grid */}
        <div className="pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {secondaryFeatures.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl border border-border bg-card"
              >
                <div className="flex flex-col space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <h4 className="text-lg font-normal tracking-tight">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-muted-foreground font-light">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
