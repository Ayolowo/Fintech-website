"use client";

import React from "react";

const PaymentMethods = () => {
  const paymentMethods = [
    { name: "MTN MoMo", color: "text-yellow-600" },
    { name: "ACH", color: "text-blue-600" },
    { name: "SPEI", color: "text-green-600" },
    { name: "PIX", color: "text-teal-600" },
    { name: "Interac", color: "text-yellow-500" },
    { name: "Airtel Money", color: "text-red-600" },
    { name: "M-Pesa", color: "text-green-700" },
    { name: "SEPA", color: "text-blue-700" },
    { name: "Bank Transfer", color: "text-gray-700" },
    { name: "Visa", color: "text-blue-800" },
    { name: "Mastercard", color: "text-red-700" },
  ];

  // Duplicate the array to create seamless loop
  const duplicatedMethods = [...paymentMethods, ...paymentMethods];

  return (
    <section className="w-full py-20 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8 mb-12">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Built to work with payment methods you use every single day
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            Pay people in 140+ countries
          </p>
        </div>
      </div>

      {/* Auto-scrolling container */}
      <div className="relative">
        <div className="flex gap-8 animate-scroll items-center">
          {duplicatedMethods.map((method, index) => (
            <div
              key={index}
              className="flex-shrink-0 px-6 py-3 rounded-full bg-muted/50 backdrop-blur-sm"
            >
              <p className={`text-lg font-bold whitespace-nowrap ${method.color}`}>
                {method.name}
              </p>
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
