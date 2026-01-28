"use client";

import React from "react";
import Image from "next/image";
import virtualAccountImg from "../assets/virtual_account.png";
import withdrawMoneyImg from "../assets/withdraw_money.png";
import holdImg from "../assets/hold.png";

const FeaturesShowcase = () => {
  return (
    <div className="w-full py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Feature 1 - Virtual Accounts - Horizontal Card */}
        <div className="mb-12 md:mb-16">
          <div className="bg-white rounded-[32px] shadow-sm overflow-hidden">
            <div className="flex flex-col md:flex-row items-center">
              <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16">
                <p className="text-sm font-medium text-primary uppercase tracking-wider mb-4">
                  YOUR PERSONAL USD ACCOUNT
                </p>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-foreground mb-6">
                  Receive payments in US dollars
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed">
                  Create a USD account in your name to accept payments from anywhere,
                  get paid by clients globally, and withdraw to your local currency.
                </p>
              </div>
              <div className="w-full md:w-1/2 flex justify-center items-center p-8 md:p-12 bg-gradient-to-br from-blue-50 to-indigo-50">
                <Image
                  src={virtualAccountImg}
                  alt="Virtual Account Details"
                  width={350}
                  height={700}
                  className="w-full max-w-[280px] h-auto"
                  priority
                  placeholder="blur"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Feature 2 - Hold and Convert - Horizontal Card Reversed */}
        <div className="mb-12 md:mb-16">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-[32px] shadow-sm overflow-hidden">
            <div className="flex flex-col md:flex-row-reverse items-center">
              <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16">
                <p className="text-sm font-medium text-green-600 uppercase tracking-wider mb-4">
                  MULTI-CURRENCY WALLET
                </p>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-foreground mb-6">
                  Store and exchange multiple currencies
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed">
                  Keep your funds secure in PayBridge and exchange between currencies anytime. Access competitive rates when you&apos;re ready to convert.
                </p>
              </div>
              <div className="w-full md:w-1/2 flex justify-center items-center p-8 md:p-12">
                <Image
                  src={holdImg}
                  alt="Hold and Convert"
                  width={350}
                  height={700}
                  className="w-full max-w-[280px] h-auto"
                  placeholder="blur"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Feature 3 - Withdraw - Horizontal Card */}
        <div>
          <div className="bg-white rounded-[32px] shadow-sm overflow-hidden">
            <div className="flex flex-col md:flex-row items-center">
              <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16">
                <p className="text-sm font-medium text-primary uppercase tracking-wider mb-4">
                  FLEXIBLE PAYOUTS
                </p>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                  Send money to your local bank
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed">
                  Keep funds in your PayBridge wallet, convert and withdraw when you&apos;re ready.
                </p>
              </div>
              <div className="w-full md:w-1/2 flex justify-center items-center p-8 md:p-12 bg-gradient-to-br from-amber-50 to-yellow-50">
                <Image
                  src={withdrawMoneyImg}
                  alt="Withdraw Money"
                  width={450}
                  height={900}
                  className="w-full max-w-[320px] h-auto"
                  placeholder="blur"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesShowcase;
