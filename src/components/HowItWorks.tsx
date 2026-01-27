"use client";

import React from "react";
import { UserPlus, CreditCard, Send, ArrowRight } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Sign up & get verified",
      description: "Create your account in minutes with just your email and basic verification.",
      details: "Quick KYC process designed for speed. Get approved in minutes, not days. No lengthy paperwork or complex requirements.",
      icon: <UserPlus className="w-10 h-10" />,
      color: "from-blue-500 to-indigo-500"
    },
    {
      number: "02",
      title: "Get virtual accounts & add funds",
      description: "Receive local virtual account numbers and fund with your currency.",
      details: "Get CAD, USD, NGN virtual accounts instantly. Add money via bank transfer, card, or crypto. Your funds are ready to use immediately.",
      icon: <CreditCard className="w-10 h-10" />,
      color: "from-emerald-500 to-teal-500"
    },
    {
      number: "03",
      title: "Send or receive globally",
      description: "Transfer money worldwide in seconds with zero gas fees.",
      details: "Enter recipient details and send. Money arrives in seconds, not days. Track every transaction in real-time with complete transparency.",
      icon: <Send className="w-10 h-10" />,
      color: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <section className="w-full py-16 md:py-24 px-6 md:px-12 bg-muted/30">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight">
            How It Works
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground font-light">
            Three simple steps to bridge money globally with virtual accounts.
          </p>
        </div>

        {/* Steps - Side by Side Layout */}
        <div className="space-y-20">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`grid md:grid-cols-2 gap-8 md:gap-16 items-center ${
                index % 2 === 1 ? 'md:flex-row-reverse' : ''
              }`}
            >
              {/* Content */}
              <div className={`space-y-6 ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                <div className="inline-flex items-baseline gap-4">
                  <span className="text-6xl md:text-7xl font-bold text-muted-foreground/20">
                    {step.number}
                  </span>
                  <div className={`p-3 rounded-2xl bg-gradient-to-br ${step.color} bg-opacity-10`}>
                    <div className={`text-transparent bg-clip-text bg-gradient-to-br ${step.color}`}>
                      {step.icon}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-2xl md:text-3xl font-normal tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-lg text-muted-foreground font-light">
                    {step.description}
                  </p>
                  <p className="text-base text-muted-foreground/80 font-light leading-relaxed">
                    {step.details}
                  </p>
                </div>

                {index < steps.length - 1 && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground font-normal">
                    <span>Next step</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </div>

              {/* Visual Element */}
              <div className={`relative ${index % 2 === 1 ? 'md:order-1' : ''}`}>
                <div className={`aspect-video rounded-3xl bg-gradient-to-br ${step.color} opacity-10 blur-3xl absolute inset-0`}></div>
                <div className="relative bg-card border border-border rounded-3xl p-8 md:p-12 backdrop-blur overflow-hidden">
                  {/* Step Number Watermark */}
                  <div className="absolute top-0 right-0 text-[200px] font-bold text-muted-foreground/5 leading-none select-none">
                    {step.number}
                  </div>

                  {/* Icon Display */}
                  <div className="relative flex items-center justify-center py-12">
                    <div className={`w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br ${step.color} opacity-20 flex items-center justify-center`}>
                      {React.cloneElement(step.icon, {
                        className: "w-16 h-16 md:w-20 md:h-20 stroke-current text-foreground/60"
                      })}
                    </div>
                  </div>

                  {/* Progress Indicator */}
                  <div className="flex justify-center gap-2 mt-4">
                    {steps.map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 rounded-full transition-all ${
                          i === index
                            ? 'w-8 bg-primary'
                            : 'w-2 bg-muted-foreground/20'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center pt-8">
          <button className="group inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 font-normal text-lg shadow-lg shadow-primary/25">
            Get Started Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
