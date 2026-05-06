import React from 'react';
import Header from '@/components/Header';
import BusinessHeroSection from '@/components/BusinessHeroSection';
import PartnersRow from '@/components/PartnersRow';
import BusinessFeatures from '@/components/BusinessFeatures';
import Footer from '@/components/Footer';
import QRWidget from '@/components/QRWidget';

export default function Business() {
  return (
    <div className="flex flex-col bg-white text-foreground">
      <div className="relative">
        <Header />
        <BusinessHeroSection />
      </div>
      <PartnersRow />
      <BusinessFeatures />
      <Footer />
      <QRWidget />
    </div>
  );
}
