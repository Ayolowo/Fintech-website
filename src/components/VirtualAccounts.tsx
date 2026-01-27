"use client";

import React from "react";
import { CreditCard, Globe, Zap } from "lucide-react";
import Image from "next/image";

const VirtualAccounts = () => {
  return (
    <section className="w-full min-h-screen relative z-30 bg-background pt-20 pb-96">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left side - Content */}
          <div className="space-y-6 lg:pt-12">
            <p className="text-sm font-medium text-primary uppercase tracking-wider">
              YOUR GLOBAL ACCOUNT
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
              Easily get paid in US dollars
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed">
              Open your own Virtual USD Account to work from anywhere, get paid from clients abroad, and withdraw to your local currency.
            </p>
          </div>

          {/* Bottom - Visual */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-[400px] aspect-[9/19] bg-gradient-to-br from-muted to-muted/50 rounded-3xl flex items-center justify-center">
              <div className="text-center space-y-2 p-8">
                <p className="text-sm text-muted-foreground font-normal">Virtual Account Details</p>
                <p className="text-xs text-muted-foreground/60">Replace with app screenshot</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VirtualAccounts;
