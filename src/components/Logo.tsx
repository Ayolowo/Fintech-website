"use client";

import LogoDark from "@/assets/dark-logo";
import LogoLight from "@/assets/light-logo";
import React from "react";

interface LogoProps {
  isDarkMode?: boolean;
  className?: string;
}

const Logo = ({ isDarkMode, className }: LogoProps) => {
  return (
    <>
      {isDarkMode ? (
        <LogoLight className={className} />
      ) : (
        <LogoDark className={className} />
      )}
    </>
  );
};

export default Logo;
