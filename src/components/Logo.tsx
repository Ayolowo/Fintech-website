"use client";

import LogoDark from "@/assets/dark-logo";
import LogoLight from "@/assets/light-logo";
import React from "react";

interface LogoProps {
  className?: string;
  variant?: "dark" | "light";
}

const Logo = ({ className, variant = "dark" }: LogoProps) => {
  return variant === "light" ? (
    <LogoLight className={className} />
  ) : (
    <LogoDark className={className} />
  );
};

export default Logo;
