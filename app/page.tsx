"use client";

import React from 'react';
import Script from 'next/script';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ExchangeRateCalculator from '@/components/ExchangeRateCalculator';
import Security from '@/components/Security';
import FeaturesShowcase from '@/components/FeaturesShowcase';
import PaymentMethods from '@/components/PaymentMethods';
import WhyWeStarted from '@/components/WhyWeStarted';
import Footer from '@/components/Footer';

export default function Home() {
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "PayBridge",
    "legalName": "PayBridge Inc.",
    "url": "https://www.paybridgefinance.com",
    "logo": "https://www.paybridgefinance.com/logo.png",
    "foundingDate": "2024",
    "description": "PayBridge is a digital financial service that enables international money transfers, virtual USD accounts, and multi-currency exchange for individuals and businesses worldwide.",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "US"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Support",
      "email": "support@paybridgefinance.com",
      "availableLanguage": ["English"]
    },
    "sameAs": [
      "https://twitter.com/paybridge",
      "https://linkedin.com/company/paybridgefinance",
      "https://instagram.com/paybridge",
      "https://www.paybridgefinance.com"
    ]
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    "name": "PayBridge",
    "description": "Send and receive money globally with PayBridge. Virtual USD account, currency exchange, and international money transfers to 140+ countries.",
    "url": "https://www.paybridgefinance.com",
    "logo": "https://www.paybridgefinance.com/logo.png",
    "brand": {
      "@type": "Brand",
      "name": "PayBridge"
    },
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

  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "PayBridge",
    "url": "https://www.paybridgefinance.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.paybridgefinance.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <Script
        id="organization-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
        strategy="beforeInteractive"
      />
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
      <Script
        id="website-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
      />

      <div className="min-h-screen flex flex-col bg-white text-foreground">
        <Header />
        <main>
          <HeroSection />
          <ExchangeRateCalculator />
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
