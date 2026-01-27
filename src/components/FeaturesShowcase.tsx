"use client";

import React from "react";
import Image from "next/image";
import virtualAccountImg from "../assets/virtual_account.png";
import withdrawMoneyImg from "../assets/withdraw_money.png";
import holdImg from "../assets/hold.png";

const FeaturesShowcase = () => {
  return (
    <div className="w-full overflow-hidden">
      <div className="max-w-8xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-16 lg:gap-y-0">
          {/* Feature 1 - Virtual Accounts - LEFT COLUMN */}
          <div className="py-12 md:py-20 lg:min-h-screen bg-background flex flex-col justify-start">
            <div className="space-y-4 mb-8 md:mb-12">
              <p className="text-sm font-medium text-primary uppercase tracking-wider">
                YOUR PERSONAL USD ACCOUNT
              </p>
              <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight text-foreground">
                Receive payments in US dollars
              </h2>
              <p className="text-base md:text-lg lg:text-xl text-muted-foreground font-light leading-relaxed">
                Create a USD account in your name to accept payments from anywhere,
                get paid by clients globally, and withdraw to your local currency.
              </p>
            </div>
            <Image
              src={virtualAccountImg}
              alt="Virtual Account Details"
              width={350}
              height={700}
              className="w-full max-w-[280px] md:max-w-[350px] h-auto"
              priority
              placeholder="blur"
            />
          </div>

          {/* Feature 2 - Hold and Convert - RIGHT COLUMN */}
          <div className="py-12 md:py-20 lg:min-h-screen bg-green-50 rounded-3xl px-6 md:px-10 flex flex-col justify-start lg:translate-y-0 xl:translate-y-[50%]">
            <div className="space-y-4 mb-8 md:mb-12">
              <p className="text-sm font-medium text-green-600 uppercase tracking-wider">
                MULTI-CURRENCY WALLET
              </p>
              <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight text-foreground">
                Store and exchange multiple currencies
              </h2>
              <p className="text-base md:text-lg lg:text-xl text-muted-foreground font-light leading-relaxed">
                Keep your funds secure in PayBridge and exchange between currencies anytime. Access competitive rates when you&apos;re ready to convert.
              </p>
            </div>
            <Image
              src={holdImg}
              alt="Hold and Convert"
              width={350}
              height={700}
              className="w-full max-w-[280px] md:max-w-[350px] h-auto"
              placeholder="blur"
            />
          </div>

          {/* Feature 3 - Withdraw - LEFT COLUMN */}
          <div className="py-12 md:py-20 lg:min-h-screen bg-yellow-50 rounded-3xl px-6 md:px-10 flex flex-col justify-start lg:translate-y-0 xl:translate-y-[10%]">
            <div className="space-y-4 mb-8 md:mb-12">
              <p className="text-sm font-medium text-primary uppercase tracking-wider">
                FLEXIBLE PAYOUTS
              </p>
              <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground">
                Send money to your local bank
              </h2>
              <p className="text-base md:text-lg lg:text-xl text-muted-foreground font-light leading-relaxed">
                Keep funds in your PayBridge wallet, convert and withdraw when you&apos;re ready.
              </p>
            </div>
            <Image
              src={withdrawMoneyImg}
              alt="Withdraw Money"
              width={450}
              height={900}
              className="w-full max-w-[300px] md:max-w-[400px] lg:max-w-[450px] h-auto"
              placeholder="blur"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesShowcase;
