"use client";

import React from "react";
import { Shield, Lock, Eye, Fingerprint } from "lucide-react";

const Security = () => {
  const securityFeatures = [
    {
      icon: Shield,
      title: "Bank-Grade Encryption",
      description: "Your data is protected with 256-bit AES encryption, the same security standard used by leading financial institutions worldwide.",
    },
    {
      icon: Fingerprint,
      title: "Biometric Protection",
      description: "Use Face ID or Touch ID to secure your transactions with the convenience of biometric authentication.",
    },
    {
      icon: Eye,
      title: "Privacy First",
      description: "We never sell your data. Your financial information stays private and is only used to provide you with our services.",
    },
    {
      icon: Lock,
      title: "Non-Custodial",
      description: "You maintain full control of your funds at all times. We never hold or have access to your money.",
    },
  ];

  return (
    <section className="w-full py-16 md:py-24 px-4 md:px-8 bg-background">
      <div className="max-w-8xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl lg:text-[36px] font-bold text-foreground">
            Your security is our top priority
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          {securityFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="flex gap-6"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-[#5CEA6A]/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-[#5CEA6A]" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground font-e-ukraine-Light leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Security;
