"use client";

import React from "react";

const HowYouUsePayBridge = () => {
  const useCases = [
    {
      title: "Receive Payments & Funding",
      description: "Get paid from customers worldwide or receive investment proceeds - fast and fee-free."
    },
    {
      title: "Pay Freelancers & Employees",
      description: "Pay freelancers, consultants, or employees - in multiple countries, without worrying about wire fees."
    },
    {
      title: "Send Global Payments",
      description: "Send payments to both individuals and other businesses globally with ease."
    },
    {
      title: "One-Time or Recurring Payouts",
      description: "One-time or frequent payouts, sent fast and reliably worldwide."
    },
    {
      title: "Pay Logistics & Suppliers",
      description: "Pay logistics partners and suppliers in a few clicks - keep your operations moving."
    }
  ];

  return (
    <section className="w-full py-20 md:py-28 lg:py-32 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            The Only Bridge You Need To
          </h2>
        </div>

        {/* Use cases grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {useCases.map((useCase, index) => (
            <div
              key={index}
              className="group p-8 rounded-2xl border hover:shadow-lg transition-all bg-white"
              style={{
                borderColor: 'rgba(47, 79, 47, 0.15)'
              }}
            >
              {/* Number indicator */}
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-6 transition-all"
                style={{
                  backgroundColor: '#b8e986'
                }}>
                <span className="text-xl font-bold" >
                  {index + 1}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-xl md:text-2xl font-bold mb-3 leading-tight" >
                {useCase.title}
              </h3>

              {/* Description */}
              <p className="text-base leading-relaxed" >
                {useCase.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowYouUsePayBridge;
