"use client";

import React, { useRef } from "react";
import { motion, useAnimationFrame, useMotionValue, useTransform } from "framer-motion";
import useMeasure from "react-use-measure";

interface InfiniteSliderProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}

export function InfiniteSlider({
  children,
  speed = 40,
  className,
}: InfiniteSliderProps) {
  const [ref, { width }] = useMeasure();
  const x = useMotionValue(0);
  const isPaused = useRef(false);

  useAnimationFrame((_, delta) => {
    if (isPaused.current) return;
    const moveBy = (speed / 1000) * delta;
    const newX = x.get() - moveBy;
    x.set(newX <= -width / 2 ? 0 : newX);
  });

  return (
    <div
      className={`overflow-hidden ${className ?? ""}`}
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
      }}
      onMouseEnter={() => { isPaused.current = true; }}
      onMouseLeave={() => { isPaused.current = false; }}
    >
      <motion.div
        ref={ref}
        style={{ x }}
        className="flex w-max"
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}
