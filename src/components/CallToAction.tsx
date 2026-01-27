import React from "react";
import AppStoreButtons from "./AppStoreButtons";

const CallToAction = () => {
  return (
    <section className="w-full py-16 md:py-20 px-4 md:px-8">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl lg:text-[48px] font-semibold tracking-tighter">
            Ready to bridge the gap?
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground font-light max-w-2xl mx-auto">
            Join thousands of users already moving money the modern way. No banks, no delays, no surprises.
          </p>
        </div>

        <div className="flex justify-center items-center pt-4">
          <AppStoreButtons />
        </div>

        <div className="pt-8">
          <p className="text-sm text-muted-foreground font-light">
            Launching Q4 2025 • Be the first to experience borderless money
          </p>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;