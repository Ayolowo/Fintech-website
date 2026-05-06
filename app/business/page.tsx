import React from 'react';
import Header from '@/components/Header';
import BusinessHeroSection from '@/components/BusinessHeroSection';
import BusinessStatement from '@/components/BusinessStatement';
import BusinessPartnersRow from '@/components/BusinessPartnersRow';
import Testimonials from '@/components/Testimonials';
import BusinessFeatures from '@/components/BusinessFeatures';
import BusinessCTA from '@/components/BusinessCTA';
import Footer from '@/components/Footer';
import QRWidget from '@/components/QRWidget';

export default function Business() {
  return (
    <div className="flex flex-col bg-white text-foreground">
      <div className="relative">
        <Header />
        <BusinessHeroSection />
      </div>
      <BusinessPartnersRow />
      <BusinessStatement />
      <Testimonials />
      <BusinessFeatures />
      <BusinessCTA />
      <Footer />
      <QRWidget />
    </div>
  );
}
