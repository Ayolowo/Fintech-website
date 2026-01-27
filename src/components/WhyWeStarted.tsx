"use client";

import React from "react";

const WhyWeStarted = () => {
  return (
    <section className="w-full py-20 px-4 md:px-8 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground text-center">
            Why we started PayBridge
          </h2>

          <div className="space-y-6 text-lg md:text-xl text-muted-foreground leading-relaxed">
            <p>
              We noticed a fundamental problem in how people move money across borders.
              Traditional banking systems are slow, expensive, and built for a world that no longer exists.
            </p>

            <p>
              Freelancers, remote workers, and families sending money home were being hit with
              high fees and terrible exchange rates. We knew there had to be a better way.
            </p>

            <p className="font-medium text-foreground">
              PayBridge was born from a simple idea: money should move as freely as information does.
              Fast, affordable, and accessible to everyone, everywhere.
            </p>

            <p>
              Today, we&apos;re building the financial infrastructure for the global economy—one that works
              for people, not just institutions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyWeStarted;
