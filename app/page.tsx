import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import Footer from '@/components/Footer';
import QRWidget from '@/components/QRWidget';
import PartnersRow from '@/components/PartnersRow';
import Testimonials from '@/components/Testimonials';

export default function Home() {
  return (
    <div className="flex flex-col bg-white text-foreground">
      <div className="relative">
        <Header />
        <HeroSection />
      </div>
      <PartnersRow />
      <Testimonials />
      <Footer />
      <QRWidget />
    </div>
  );
}
