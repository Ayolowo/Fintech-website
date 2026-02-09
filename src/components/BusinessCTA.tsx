"use client";

import React from "react";

const BusinessCTA = () => {
  return (
    <section className="w-full py-24 md:py-32 lg:py-40 px-4 md:px-8 bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 relative overflow-hidden">
      {/* Subtle background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(59,130,246,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(#374151_1px,transparent_1px)] [background-size:24px_24px] opacity-20"></div>

      <div className="max-w-5xl mx-auto text-center space-y-10 relative z-10">
        {/* Heading */}
        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-white px-4">
          Ready to Upgrade How Your Business Pays Globally?
        </h2>

        {/* Subheading */}
        <p className="text-xl md:text-2xl lg:text-3xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-medium">
          Join growing businesses using PayBridge to move money faster, cheaper, and safer.
        </p>

        {/* CTA Button */}
        <div className="pt-6">
          <button className="px-12 py-5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-xl transition-all shadow-2xl hover:shadow-blue-500/50 hover:scale-105">
            Sign me up!
          </button>
        </div>
      </div>
    </section>
  );
};

export default BusinessCTA;
