import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import TaskBoard from "./TaskBoard";
import { Loader } from "lucide-react";
import iPhoneFront from "../assets/iPhone-14-home-front.png";
import iPhoneSide from "../assets/iPhone-14-home-side.png";

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);
  return (
    <section className="relative w-full py-12 md:py-20 px-6 md:px-12 flex flex-col items-center justify-center overflow-hidden bg-background">
      {/* Cosmic particle effect (background dots) */}
      <div className="absolute inset-0 cosmic-grid opacity-30"></div>

      {/* Gradient glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full">
        <div className="w-full h-full opacity-10 bg-primary blur-[120px]"></div>
      </div>

      <div
        className={`relative z-10 max-w-4xl text-center space-y-6 transition-all duration-700 transform ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="flex justify-center">
          <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium rounded-full bg-muted text-primary">
            <span className="flex h-2 w-2 rounded-full bg-primary"></span>
            Launching new payment features
            <Loader className="h-3 w-3 animate-spin text-primary" />
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[68px] font-e-ukraine-Medium text-4xl md:text-6xl lg:text-7xl tracking-tighter text-balance text-foreground">
          Bridge money. Anywhere. Instantly.
        </h1>

        <p className="text-base sm:text-lg md:text-xl font-e-ukraine-Light text-muted-foreground text-muted-foreground max-w-2xl mx-auto text-balance">
          International money, made local. Send across countries like it's a
          local transfer. No banks, no delays, no surprises.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 items-center">
          <Button
            style={{
              backgroundColor: "#5CEA6A",
              color: "#1A1A1A",
            }}
            className="text-sm sm:text-base h-10 sm:h-12 px-6 sm:px-8 font-e-ukraine-Regular bg-primary text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground text-base h-12 px-8 transition-all duration-200 min-h-[48px]"
          >
            Join the waitlist
          </Button>
          <Button
            variant="outline"
            className="text-sm sm:text-base h-10 sm:h-12 px-6 sm:px-8 font-e-ukraine-Regular border-border text-foreground hover:bg-accent hover:text-accent-foreground text-base h-12 px-8 transition-all duration-200 min-h-[48px]"
          >
            See how it works
          </Button>
        </div>
      </div>

      {/* Task Manager UI integrated in hero section with glassmorphic effect */}
      <div
        className={`w-full max-w-7xl mt-12 z-10 transition-all duration-1000 delay-500 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
        }`}
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: "40px",
          marginTop: "100px",
        }}
      >
        {/* Dashboard Header */}
        <img
          src={iPhoneFront}
          alt="PayBridge Home Screen"
          style={{ width: "400px" }}
        />{" "}
        <img
          src={iPhoneSide}
          alt="PayBridge Home Screen Side"
          style={{ width: "450px" }}
        />
        {/* Dashboard Content */}
        <div className="flex h-[600px] overflow-hidden">
          {/* Sidebar */}

          {/* Main Content */}
        </div>
      </div>
    </section>
  );
};
export default HeroSection;
