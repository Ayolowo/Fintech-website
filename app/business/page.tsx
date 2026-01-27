"use client";

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Business() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 md:px-8">
        <div className="text-center space-y-6 max-w-2xl">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground">
            Coming Soon
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground">
            PayBridge for Business is on its way. We&apos;re building powerful tools to help your business manage payments globally.
          </p>
          <div className="pt-8">
            <a
              href="/"
              className="inline-block px-8 py-3 bg-foreground text-background rounded-full font-medium hover:opacity-90 transition-opacity"
            >
              Back to Personal
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
