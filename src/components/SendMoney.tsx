"use client";

import React from "react";
import Image from "next/image";

const SendMoney = () => {
  return (
    <section className="w-full min-h-screen relative z-10 bg-background -mt-96 pt-96 pb-20">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left side - Content */}
          <div className="space-y-6 lg:pt-12">
            <p className="text-sm font-medium text-primary uppercase tracking-wider">
              MOVE MONEY WHEN YOU WANT
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
              Withdraw whenever you need to
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed">
              Hold your money until rates favor you. Withdraw to your local accounts, so you can spend easily in your local currency.
            </p>
          </div>

          {/* Right side - Visual */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-[400px] aspect-[9/19] bg-gradient-to-br from-muted to-muted/50 rounded-3xl flex items-center justify-center">
              <div className="text-center space-y-2 p-8">
                <p className="text-sm text-muted-foreground font-normal">Withdraw</p>
                <p className="text-xs text-muted-foreground/60">Replace with app screenshot</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SendMoney;
