"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

const stats = [
  { value: 500, prefix: "$", suffix: "M+", label: "Transferred" },
  { value: 140, prefix: "", suffix: "+", label: "Countries" },
  { value: 30, prefix: "", suffix: "+", label: "Currencies" },
  { value: 4.8, prefix: "", suffix: "★", label: "App Rating", decimals: 1 },
];

function Counter({
  value,
  prefix,
  suffix,
  decimals = 0,
}: {
  value: number;
  prefix: string;
  suffix: string;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [display, setDisplay] = useState("0");
  const shouldReduce = useReducedMotion();

  useEffect(() => {
    if (!isInView) return;
    if (shouldReduce) {
      setDisplay(value.toFixed(decimals));
      return;
    }
    const duration = 1500;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay((eased * value).toFixed(decimals));
      if (p < 1) requestAnimationFrame(tick);
      else setDisplay(value.toFixed(decimals));
    };
    requestAnimationFrame(tick);
  }, [isInView, value, decimals, shouldReduce]);

  return (
    <span ref={ref}>
      {prefix}{display}{suffix}
    </span>
  );
}

const StatsBar = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const shouldReduce = useReducedMotion();

  return (
    <section ref={ref} className="w-full bg-[#144419] py-12 md:py-14 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={shouldReduce ? {} : { opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
              className="flex flex-col items-center text-center gap-1"
            >
              <div
                className="font-black text-[#C6EF42] tracking-[-0.04em] leading-none"
                style={{ fontSize: "clamp(2rem, 5vw, 3rem)" }}
              >
                <Counter
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  decimals={stat.decimals}
                />
              </div>
              <p className="text-sm font-medium text-white/60 uppercase tracking-widest">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsBar;
