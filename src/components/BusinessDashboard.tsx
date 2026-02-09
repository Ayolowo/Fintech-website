"use client";

import React from "react";
import Image from "next/image";

const BusinessDashboard = () => {
  return (
    <section className="w-full mb-20 py-20 md:py-28 lg:py-10 px-4 md:px-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-16 items-center">
          {/* Top - Text content */}
          <div className="w-full max-w-6xl space-y-10 text-center">
            {/* Main heading */}
            <div className="space-y-6">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black">
                Your Business Dashboard Is On The Way
              </h2>

              <p className="text-xl md:text-1xl text-gray-600 font-medium">
                Manage global payments from one powerful dashboard
              </p>
            </div>

            {/* Bottom - Dashboard Image */}
            <div className="w-full max-w-6xl mx-auto">
              <Image
                src="/dashboard.png"
                alt="PayBridge Business Dashboard"
                width={1291}
                height={824}
                className="w-full h-auto rounded-2xl shadow-2xl border border-gray-200"
                priority
                quality={85}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessDashboard;
