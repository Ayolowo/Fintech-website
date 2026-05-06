"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import warehouse from "../assets/business/features/warehouse.jpeg";
import team from "../assets/business/features/team.jpeg";
import money from "../assets/business/features/money.jpeg";

const DURATION = 6000;

const features = [
  {
    title: "Send payments to suppliers in 140+ countries",
    description: "Pay vendors, manufacturers, and partners globally — at rates your bank can't match.",
    image: warehouse,
    alt: "Supplier payments",
  },
  {
    title: "Pay your team wherever they are in the world",
    description: "Run payroll across borders without the delays, fees, or paperwork.",
    image: team,
    alt: "Team payroll",
  },
  {
    title: "Hold and convert digital dollars instantly",
    description: "Keep funds in USD and convert to local currencies the moment you need to.",
    image: money,
    alt: "Digital dollars",
  },
];

const BusinessFeatures = () => {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number>(Date.now());
  const activeRef = useRef(0);

  const startTimer = useCallback((index: number) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    activeRef.current = index;
    setActive(index);
    setProgress(0);
    startRef.current = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startRef.current;
      const pct = Math.min((elapsed / DURATION) * 100, 100);
      setProgress(pct);

      if (pct < 100) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        const next = (activeRef.current + 1) % features.length;
        startTimer(next);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    startTimer(0);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [startTimer]);

  return (
    <section className="w-full py-20" style={{ backgroundColor: "#faf9f9" }}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">

        {/* Header */}
        <div className="mb-20 text-center">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-black mb-4 max-w-5xl mx-auto" style={{ lineHeight: 1.05 }}>
            The safest, fastest and cheapest way to move money for your business
          </h2>
          <p className="text-base text-black md:text-lg leading-relaxed max-w-2xl mx-auto" >
            Supplier payments, team payroll, cross-border transfers — all in one place, at rates banks can&rsquo;t touch.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="flex flex-col-reverse md:flex-row gap-16 md:gap-24 items-center justify-center">

          {/* Left — feature list */}
          <div className="flex flex-col justify-center gap-0 w-full md:w-[480px] shrink-0">
            {features.map((feature, i) => (
              <div
                key={i}
                className="py-8 cursor-pointer text-center md:text-left"
                onClick={() => startTimer(i)}
              >
                <h3
                  className="text-1xl md:text-3xl font-bold mb-3 transition-colors duration-300"
                  style={{ color: active === i ? "#000000" : "#9ca3af" }}
                >
                  {feature.title}
                </h3>
                {active === i && (
                  <p className="text-base leading-relaxed mb-4" style={{ color: "#000000" }}>
                    {feature.description}
                  </p>
                )}
                {/* Progress bar */}
                <div className="h-[2px] w-full rounded-full" style={{ backgroundColor: "#e5e7eb" }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: active === i ? `${progress}%` : i < active ? "100%" : "0%",
                      backgroundColor: "#083400",
                      transition: active === i ? "none" : "width 0.3s ease",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Right — image card */}
          <div className="w-full md:w-[500px] shrink-0 relative overflow-hidden" style={{ height: 680 }}>
            {features.map((feature, i) => (
              <div
                key={i}
                className="absolute inset-0 transition-opacity duration-700"
                style={{ opacity: active === i ? 1 : 0 }}
              >
                <Image
                  src={feature.image}
                  alt={feature.alt}
                  fill
                  className="object-cover object-center"
                />
              </div>
            ))}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center z-10 px-6">
              <div
                className="flex gap-6 px-6 py-4 rounded-2xl"
                style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", backdropFilter: "blur(8px)" }}
              >
                <div className="text-center">
                  <p className="text-white text-2xl font-black">140+</p>
                  <p className="text-white/70 text-xs font-medium tracking-wide uppercase">Countries</p>
                </div>
                <div className="w-px self-stretch" style={{ backgroundColor: "rgba(255,255,255,0.2)" }} />
                <div className="text-center">
                  <p className="text-white text-2xl font-black">24/7</p>
                  <p className="text-white/70 text-xs font-medium tracking-wide uppercase">Real-time settlement</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default BusinessFeatures;
