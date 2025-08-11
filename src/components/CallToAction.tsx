import React from "react";
import { Button } from "@/components/ui/button";

const CallToAction = () => {
  return (
    <section className="w-full py-16 md:py-20 px-6 md:px-12">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl lg:text-[48px] font-e-ukraine-Medium tracking-tighter">
            Ready to bridge the gap?
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground font-e-ukraine-Light max-w-2xl mx-auto">
            Join thousands of users already moving money the modern way. No banks, no delays, no surprises.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Button
            style={{
              backgroundColor: "#5CEA6A",
              color: "#1A1A1A",
            }}
            className="text-sm sm:text-base h-12 px-8 font-e-ukraine-Regular hover:bg-primary/80 transition-all duration-200"
          >
            Join the waitlist
          </Button>
          <Button
            variant="outline"
            className="text-sm sm:text-base h-12 px-8 font-e-ukraine-Regular border-border text-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-200"
          >
            Learn more
          </Button>
        </div>

        <div className="pt-8">
          <p className="text-sm text-muted-foreground font-e-ukraine-Light">
            Launching Q4 2025 • Be the first to experience borderless money
          </p>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;