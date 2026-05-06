"use client";

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BusinessHero from '@/components/BusinessHero';
import BusinessDashboard from '@/components/BusinessDashboard';
import WhyChoosePayBridge from '@/components/WhyChoosePayBridge';
import HowYouUsePayBridge from '@/components/HowYouUsePayBridge';
import BusinessFAQ from '@/components/BusinessFAQ';

export default function Business() {
  return (
    <div className="flex flex-col bg-white text-foreground">
      <div className="relative">
        <Header />
        <BusinessHero />
      </div>
      <main>
        <BusinessDashboard />
        <WhyChoosePayBridge />
        <HowYouUsePayBridge />
        <BusinessFAQ />
        {/* <BusinessCTA /> */}
      </main>
      <Footer />
    </div>
  );
}
