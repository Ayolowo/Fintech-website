"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
}

export function BentoGrid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6",
        className
      )}
    >
      {children}
    </div>
  );
}

export function BentoCard({ children, className }: BentoCardProps) {
  return (
    <div
      className={cn(
        "group relative rounded-[32px] overflow-hidden transition-all duration-300",
        className
      )}
    >
      {children}
    </div>
  );
}
