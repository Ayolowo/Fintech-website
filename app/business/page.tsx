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
    <div className="min-h-screen flex flex-col bg-white text-foreground">
      <Header />
      <main>
        <BusinessHero />
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
