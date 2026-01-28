"use client";

import React from "react";
import Image from "next/image";
import airtelMoney from "../assets/payment-methods/airtel money.jpg";
import moovMoney from "../assets/payment-methods/moov money.webp";
import mpesa from "../assets/payment-methods/mpesa.avif";
import mtn from "../assets/payment-methods/mtn.avif";
import orange from "../assets/payment-methods/orange.avif";
import solana from "../assets/payment-methods/solana.avif";
import spei from "../assets/payment-methods/spei.avif";
import interac from "../assets/payment-methods/interac.webp"

const PaymentMethods = () => {
  const paymentMethods = [
    { name: "MTN Mobile Money", logo: mtn },
    { name: "M-Pesa", logo: mpesa },
    { name: "Airtel Money", logo: airtelMoney },
    { name: "Moov Money", logo: moovMoney },
    { name: "Orange Money", logo: orange },
    { name: "SPEI", logo: spei },
    { name: "Solana", logo: solana },
    { name: "Interac", logo: interac },
  ];

  // Duplicate the array to create seamless loop
  const duplicatedMethods = [...paymentMethods, ...paymentMethods];

  return (
    <section className="w-full py-20 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8 mb-12">
        <div className="text-center mb-20 mt-20">
          <h2 className="text-3xl md:text-4xl lg:text-[36px] font-bold text-foreground">
            Payment methods you use every single day
          </h2>
        </div>
      </div>

      {/* Auto-scrolling container */}
      <div className="relative">
        <div className="flex gap-32 animate-scroll items-center">
          {duplicatedMethods.map((method, index) => (
            <div key={index} className="flex-shrink-0">
              <Image
                src={method.logo}
                alt={method.name}
                width={180}
                height={90}
                className="w-auto h-[90px] object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 40s linear infinite;
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default PaymentMethods;
