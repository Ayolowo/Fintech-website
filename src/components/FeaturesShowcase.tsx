"use client";

import React from "react";
import Image from "next/image";
import virtualAccountImg from "../assets/virtual_account.png";
import withdrawMoneyImg from "../assets/withdraw_money.png";
import holdImg from "../assets/hold.png";

const FeaturesShowcase = () => {
  return (
    <div className="w-full">
      <div className="max-w-8xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-20">
          {/* Feature 1 - Virtual Accounts - LEFT COLUMN */}
          <div className="min-h-screen bg-background py-20 flex flex-col justify-start">
            <div className="space-y-4 mb-12">
              <p className="text-sm font-medium text-primary uppercase tracking-wider">
                YOUR GLOBAL ACCOUNT
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-foreground">
                Easily get paid in US dollars
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed">
                Open your own Virtual USD Account to work from anywhere, get
                paid from clients abroad, and withdraw to your local currency.
              </p>
            </div>
            <Image
              src={virtualAccountImg}
              alt="Virtual Account Details"
              className="w-full max-w-[350px] h-auto"
              priority
            />
          </div>

          {/* Feature 2 - Hold and Convert - RIGHT COLUMN */}
          <div
            className="min-h-screen bg-green-50 -mx-4 md:-mx-8 px-4 md:px-8 lg:mx-0 lg:px-10 py-20 flex flex-col justify-start lg:rounded-3xl lg:translate-y-[50%]"
          >
            <div className="space-y-4 mb-12">
              <p className="text-sm font-medium text-green-600 uppercase tracking-wider">
                HOLD AND CONVERT
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-foreground">
                Hold and convert to any currency
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed">
                Store your money safely and convert to any currency whenever you need. Get the best rates when you&apos;re ready.
              </p>
            </div>
            <Image
              src={holdImg}
              alt="Hold and Convert"
              className="w-full max-w-[350px] h-auto"
              loading="lazy"
            />
          </div>

          {/* Feature 3 - Withdraw - LEFT COLUMN */}
          <div className="min-h-screen bg-yellow-50 -mx-4 md:-mx-8 px-4 md:px-8 lg:mx-0 lg:px-10 py-20 flex flex-col justify-start lg:rounded-3xl lg:translate-y-[10%]">
            <div className="space-y-4 mb-12">
              <p className="text-sm font-medium text-primary uppercase tracking-wider">
                MOVE MONEY WHEN YOU WANT
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
                Withdraw whenever you need to
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed">
                Hold your money until rates favor you. Withdraw to your local
                accounts, so you can spend easily in your local currency.
              </p>
            </div>
            <Image
              src={withdrawMoneyImg}
              alt="Withdraw Money"
              className="w-full max-w-[450px] h-auto"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesShowcase;
