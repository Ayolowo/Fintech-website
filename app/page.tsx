"use client";

import React from 'react';
import Script from 'next/script';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import Security from '@/components/Security';
import FeaturesShowcase from '@/components/FeaturesShowcase';
import PaymentMethods from '@/components/PaymentMethods';
import WhyWeStarted from '@/components/WhyWeStarted';
import Footer from '@/components/Footer';

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    "name": "PayBridge",
    "description": "Send and receive money globally with PayBridge. Virtual USD account, currency exchange, and international money transfers to 140+ countries.",
    "url": "https://www.paybridgefinance.com",
    "logo": "https://www.paybridgefinance.com/logo.png",
    "sameAs": [
      "https://twitter.com/paybridge",
      "https://linkedin.com/company/paybridgefinance",
      "https://instagram.com/paybridge"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Support",
      "email": "support@paybridgefinance.com"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "250"
    },
    "offers": {
      "@type": "Offer",
      "description": "International money transfer services with virtual USD account",
      "priceCurrency": "USD",
      "price": "0"
    }
  };

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.paybridgefinance.com"
      }
    ]
  };

  return (
    <>
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Script
        id="breadcrumb-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />

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
          <PaymentMethods />
          <Security />
          <WhyWeStarted />
        </main>
        <Footer />
      </div>
    </>
  );
}
