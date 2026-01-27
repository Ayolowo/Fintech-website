"use client";

import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import Security from '@/components/Security';
import FeaturesShowcase from '@/components/FeaturesShowcase';
import PaymentMethods from '@/components/PaymentMethods';
import WhyWeStarted from '@/components/WhyWeStarted';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <div className="relative bg-background">
        {/* Cosmic particle effect (background dots) */}
        <div className="absolute inset-0 cosmic-grid opacity-30"></div>
        <div className="relative z-10">
          <Header />
          <HeroSection />
        </div>
      </div>
      <main>
        <FeaturesShowcase />
        <Security />
        <WhyWeStarted />
      </main>
      <Footer />
    </div>
  );
}
