"use client";

import React from "react";
import Image from "next/image";

const AppPreviews = () => {
  return (
    <section className="w-full py-16 md:py-24 px-4 md:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-[48px] font-semibold tracking-tighter text-foreground">
            Experience seamless money transfers
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground font-light max-w-3xl mx-auto">
            A beautifully designed app that makes managing your money simple and intuitive.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center justify-items-center">
          {/* Placeholder for app screenshots - replace with actual images */}
          <div className="w-full max-w-[300px] aspect-[9/19] bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl border-2 border-border flex items-center justify-center">
            <div className="text-center space-y-2 p-8">
              <p className="text-sm text-muted-foreground font-normal">Dashboard View</p>
              <p className="text-xs text-muted-foreground/60">Replace with app screenshot</p>
            </div>
          </div>

          <div className="w-full max-w-[300px] aspect-[9/19] bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl border-2 border-border flex items-center justify-center">
            <div className="text-center space-y-2 p-8">
              <p className="text-sm text-muted-foreground font-normal">Transaction View</p>
              <p className="text-xs text-muted-foreground/60">Replace with app screenshot</p>
            </div>
          </div>

          <div className="w-full max-w-[300px] aspect-[9/19] bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl border-2 border-border flex items-center justify-center">
            <div className="text-center space-y-2 p-8">
              <p className="text-sm text-muted-foreground font-normal">Profile View</p>
              <p className="text-xs text-muted-foreground/60">Replace with app screenshot</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppPreviews;
